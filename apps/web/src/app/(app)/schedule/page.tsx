"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useNow } from "@/hooks/use-now";
import { useCurrentBlock } from "@/hooks/use-current-block";
import { Plus, Trash2 } from "lucide-react";

interface Persona { id: number; name: string; color: string }
interface Block { id: number; persona_id: number; start_time: string; end_time: string; activity: string; day_type: string; is_prayer_block: boolean; order: number }

export default function SchedulePage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ persona_id: 0, start_time: "08:00", end_time: "09:00", activity: "" });
  const now = useNow();
  const current = useCurrentBlock(blocks, now);

  useEffect(() => {
    api.get<Block[]>("/schedule").then(setBlocks);
    api.get<Persona[]>("/personas").then((p) => {
      setPersonas(p);
      if (p.length > 0) setForm((f) => ({ ...f, persona_id: p[0].id }));
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const b = await api.post<Block>("/schedule", form);
    setBlocks([...blocks, b].sort((a, bb) => a.start_time.localeCompare(bb.start_time)));
    setShowCreate(false);
  }

  async function handleDelete(id: number) {
    await api.delete(`/schedule/${id}`);
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Schedule</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-[var(--accent)] text-white rounded hover:opacity-90">
          <Plus size={14} /> Add Block
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="p-4 border border-[var(--border)] rounded mb-6 space-y-3">
          <select value={form.persona_id} onChange={(e) => setForm({ ...form, persona_id: Number(e.target.value) })} className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]">
            {personas.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
            <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
          </div>
          <input placeholder="Activity" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} required className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
          <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded text-sm">Create</button>
        </form>
      )}

      <div className="space-y-0">
        {blocks.map((b) => {
          const persona = personas.find((p) => p.id === b.persona_id);
          const isActive = current?.id === b.id;
          return (
            <div key={b.id} className="flex items-stretch gap-4 group">
              <div className="w-20 flex-shrink-0 text-right py-3">
                <p className="text-xs font-mono text-[var(--muted-foreground)]">{b.start_time}</p>
                <p className="text-xs font-mono text-[var(--muted-foreground)]">{b.end_time}</p>
              </div>
              <div className="relative flex flex-col items-center">
                <div
                  className="w-2 flex-1 rounded-full transition-all"
                  style={{
                    backgroundColor: persona?.color || "#888",
                    opacity: isActive ? 0.9 : 0.3,
                    boxShadow: isActive ? `0 0 12px ${persona?.color}55` : "none",
                  }}
                />
              </div>
              <div className={`flex-1 py-3 flex items-center justify-between ${isActive ? "" : "opacity-60"}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{persona?.name || "Unknown"}</span>
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 font-bold text-white rounded" style={{ backgroundColor: persona?.color }}>NOW</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">{b.activity}</p>
                </div>
                <button onClick={() => handleDelete(b.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)]">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {blocks.length === 0 && <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No schedule blocks yet. Add one to get started.</p>}
      </div>
    </div>
  );
}
