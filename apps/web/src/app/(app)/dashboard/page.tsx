"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useNow } from "@/hooks/use-now";
import { useCurrentBlock } from "@/hooks/use-current-block";
import { ChevronRight } from "lucide-react";

interface DashboardData {
  super_objective: string;
  personas: { id: number; name: string; arabic_name: string; domain: string; icon: string; color: string }[];
  schedule_blocks: { id: number; start_time: string; end_time: string; activity: string; persona_id: number; is_prayer_block: boolean }[];
  non_negotiables_total: number;
  non_negotiables_checked_today: number;
  streaks: { title: string; current: number; longest: number }[];
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatHour(t: string) {
  const [h] = t.split(":").map(Number);
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const now = useNow();

  useEffect(() => {
    api.get<DashboardData>("/dashboard").then(setData);
  }, []);

  const currentBlock = useCurrentBlock(
    data?.schedule_blocks.map((b) => ({
      ...b,
      persona_name: data?.personas.find((p) => p.id === b.persona_id)?.name,
      persona_color: data?.personas.find((p) => p.id === b.persona_id)?.color,
    })) || [],
    now
  );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentHour = now.getHours() + now.getMinutes() / 60;
  const dayProgress = (currentHour / 24) * 100;
  const checkedPct = data.non_negotiables_total > 0
    ? Math.round((data.non_negotiables_checked_today / data.non_negotiables_total) * 100)
    : 0;

  const currentPersona = currentBlock
    ? data.personas.find((p) => p.id === currentBlock.persona_id)
    : null;

  let blockProgress = 0;
  let remainingMin = 0;
  if (currentBlock) {
    const startMins = timeToMinutes(currentBlock.start_time);
    const endMins = timeToMinutes(currentBlock.end_time);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const duration = endMins > startMins ? endMins - startMins : 1440 - startMins + endMins;
    const elapsed = nowMins >= startMins ? nowMins - startMins : 1440 - startMins + nowMins;
    blockProgress = Math.min(1, Math.max(0, elapsed / duration));
    remainingMin = Math.max(0, duration - elapsed);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-xs text-[var(--muted-foreground)]" dir="rtl">بسم الله الرحمن الرحيم</p>
        <h1 className="text-xl font-bold mt-1">{data.super_objective}</h1>
      </div>

      {/* Day Progress */}
      <div className="relative h-2 bg-[var(--muted)] rounded-full overflow-hidden">
        {data.schedule_blocks.map((b, i) => {
          const start = timeToMinutes(b.start_time);
          const end = timeToMinutes(b.end_time);
          const width = ((end > start ? end - start : 1440 - start + end) / 1440) * 100;
          const left = (start / 1440) * 100;
          const persona = data.personas.find((p) => p.id === b.persona_id);
          return (
            <div
              key={i}
              className="absolute h-full"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: persona?.color || "#888",
                opacity: currentBlock?.id === b.id ? 0.9 : 0.3,
              }}
            />
          );
        })}
        <div
          className="absolute top-0 h-full w-0.5 bg-[var(--foreground)]"
          style={{ left: `${dayProgress}%` }}
        />
      </div>

      {/* Current Block Card */}
      {currentBlock && currentPersona && (
        <div className="p-4 border rounded" style={{ borderColor: currentPersona.color }}>
          <div
            className="absolute inset-0 rounded"
            style={{ backgroundColor: currentPersona.color, opacity: 0.05, width: `${blockProgress * 100}%` }}
          />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold text-white rounded"
                  style={{ backgroundColor: currentPersona.color }}
                >
                  NOW
                </span>
                <span className="font-bold">{currentPersona.name}</span>
                {currentPersona.arabic_name && (
                  <span className="text-sm opacity-50" dir="rtl">{currentPersona.arabic_name}</span>
                )}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{currentBlock.activity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--muted-foreground)]">Remaining</p>
              <p className="font-bold">{Math.floor(remainingMin / 60) > 0 ? `${Math.floor(remainingMin / 60)}h ` : ""}{remainingMin % 60}m</p>
            </div>
          </div>
        </div>
      )}

      {/* Personas Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.personas.map((p) => (
          <div key={p.id} className="p-3 border border-[var(--border)] rounded">
            <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: p.color }} />
            <p className="text-sm font-medium">{p.name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{p.domain}</p>
          </div>
        ))}
      </div>

      {/* Non-Negotiables Progress */}
      <div className="p-4 border border-[var(--border)] rounded">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Daily Non-Negotiables</h3>
          <span className="text-sm font-bold text-[var(--accent)]">{checkedPct}%</span>
        </div>
        <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent)] rounded-full transition-all" style={{ width: `${checkedPct}%` }} />
        </div>
      </div>

      {/* Streaks */}
      {data.streaks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.streaks.map((s) => (
            <div key={s.title} className="p-3 border border-[var(--border)] rounded">
              <p className="text-xs text-[var(--muted-foreground)]">{s.title}</p>
              <p className="text-lg font-bold">{s.current}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Best: {s.longest}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
