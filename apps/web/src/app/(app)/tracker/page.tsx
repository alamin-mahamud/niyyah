"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Plus, Trash2, Check, Flame } from "lucide-react";

interface Streak { current_streak: number; longest_streak: number; last_check_date: string | null }
interface NonNegotiable { id: number; title: string; category: string; streak: Streak | null }
interface DailyCheck { id: number; non_negotiable_id: number; check_date: string; is_completed: boolean }
interface TrackerDay { date: string; checks: DailyCheck[]; non_negotiables: NonNegotiable[] }

export default function TrackerPage() {
  const [data, setData] = useState<TrackerDay | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", category: "spiritual" });

  async function load() {
    const d = await api.get<TrackerDay>("/tracker/today");
    setData(d);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/tracker/non-negotiables", form);
    setForm({ title: "", category: "spiritual" });
    setShowCreate(false);
    load();
  }

  async function handleCheck(nnId: number) {
    await api.post("/tracker/check", { non_negotiable_id: nnId });
    load();
  }

  async function handleUncheck(checkId: number) {
    await api.delete(`/tracker/check/${checkId}`);
    load();
  }

  async function handleDeleteNN(id: number) {
    await api.delete(`/tracker/non-negotiables/${id}`);
    load();
  }

  if (!data) {
    return <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  const checked = data.checks.length;
  const total = data.non_negotiables.length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Daily Tracker</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{checked}/{total} completed today</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-[var(--accent)] text-white rounded hover:opacity-90">
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[var(--accent)] rounded-full transition-all" style={{ width: `${total > 0 ? (checked / total) * 100 : 0}%` }} />
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="p-4 border border-[var(--border)] rounded mb-6 space-y-3">
          <input placeholder="Non-negotiable title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]">
            <option value="spiritual">Spiritual</option>
            <option value="health">Health</option>
            <option value="growth">Growth</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded text-sm">Add</button>
        </form>
      )}

      <div className="space-y-2">
        {data.non_negotiables.map((nn) => {
          const isChecked = data.checks.some((c) => c.non_negotiable_id === nn.id);
          const check = data.checks.find((c) => c.non_negotiable_id === nn.id);

          return (
            <div key={nn.id} className="flex items-center gap-3 p-3 border border-[var(--border)] rounded group">
              <button
                onClick={() => isChecked && check ? handleUncheck(check.id) : handleCheck(nn.id)}
                className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                  isChecked
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                    : "border-[var(--border)] hover:border-[var(--accent)]"
                }`}
              >
                {isChecked && <Check size={14} />}
              </button>
              <div className="flex-1">
                <p className={`text-sm ${isChecked ? "line-through opacity-60" : ""}`}>{nn.title}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{nn.category}</p>
              </div>
              {nn.streak && nn.streak.current_streak > 0 && (
                <div className="flex items-center gap-1 text-xs text-[var(--accent)]">
                  <Flame size={12} />
                  <span>{nn.streak.current_streak}d</span>
                </div>
              )}
              <button onClick={() => handleDeleteNN(nn.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)]">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
