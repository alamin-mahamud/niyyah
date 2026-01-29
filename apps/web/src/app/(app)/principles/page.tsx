"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Plus, Trash2 } from "lucide-react";

interface Principle {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  verse: string | null;
  icon: string;
}

export default function PrinciplesPage() {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", arabic: "", meaning: "", verse: "" });

  useEffect(() => {
    api.get<Principle[]>("/principles").then(setPrinciples);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const p = await api.post<Principle>("/principles", { ...form, verse: form.verse || null });
    setPrinciples([...principles, p]);
    setForm({ name: "", arabic: "", meaning: "", verse: "" });
    setShowCreate(false);
  }

  async function handleDelete(id: number) {
    await api.delete(`/principles/${id}`);
    setPrinciples(principles.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Guiding Principles</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-[var(--accent)] text-white rounded hover:opacity-90">
          <Plus size={14} /> Add
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="p-4 border border-[var(--border)] rounded mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name (e.g. NIYYAH)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
            <input placeholder="Arabic" value={form.arabic} onChange={(e) => setForm({ ...form, arabic: e.target.value })} className="px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" dir="rtl" />
          </div>
          <textarea placeholder="Meaning" value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })} required className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" rows={2} />
          <input placeholder="Verse reference (optional)" value={form.verse} onChange={(e) => setForm({ ...form, verse: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
          <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded text-sm">Create</button>
        </form>
      )}

      <div className="space-y-3">
        {principles.map((p) => (
          <div key={p.id} className="p-4 border border-[var(--border)] rounded group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{p.name}</span>
                  {p.arabic && <span className="opacity-60" dir="rtl">{p.arabic}</span>}
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{p.meaning}</p>
                {p.verse && <p className="text-xs text-[var(--accent)] mt-1">({p.verse})</p>}
              </div>
              <button onClick={() => handleDelete(p.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)]">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {principles.length === 0 && <p className="text-sm text-[var(--muted-foreground)] text-center py-8">No principles yet. Add your guiding principles.</p>}
      </div>
    </div>
  );
}
