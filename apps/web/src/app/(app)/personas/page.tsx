"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Milestone {
  id: number;
  target_date: string | null;
  goal: string;
  is_completed: boolean;
}

interface Persona {
  id: number;
  name: string;
  arabic_name: string;
  domain: string;
  eventually: string;
  icon: string;
  color: string;
  one_thing: string | null;
  ritual: string | null;
  guardrail: string | null;
  points: string[];
  milestones: Milestone[];
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", arabic_name: "", domain: "", eventually: "", color: "#2d8a5e" });

  useEffect(() => {
    api.get<Persona[]>("/personas").then(setPersonas);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const p = await api.post<Persona>("/personas", form);
    setPersonas([...personas, p]);
    setForm({ name: "", arabic_name: "", domain: "", eventually: "", color: "#2d8a5e" });
    setShowCreate(false);
  }

  async function handleDelete(id: number) {
    await api.delete(`/personas/${id}`);
    setPersonas(personas.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Personas</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 text-sm px-3 py-1.5 bg-[var(--accent)] text-white rounded hover:opacity-90"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="p-4 border border-[var(--border)] rounded mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
            <input placeholder="Arabic name" value={form.arabic_name} onChange={(e) => setForm({ ...form, arabic_name: e.target.value })} className="px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" dir="rtl" />
          </div>
          <input placeholder="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
          <input placeholder="Eventually..." value={form.eventually} onChange={(e) => setForm({ ...form, eventually: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]" />
          <div className="flex items-center gap-3">
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
            <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded text-sm">Create</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {personas.map((p) => (
          <div key={p.id} className="border border-[var(--border)] rounded">
            <button
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{p.name}</span>
                    {p.arabic_name && <span className="text-sm opacity-50" dir="rtl">{p.arabic_name}</span>}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">{p.domain}</p>
                </div>
              </div>
              {expanded === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expanded === p.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)]">
                {p.eventually && (
                  <div className="mt-3 p-3 bg-[var(--muted)] rounded">
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Eventually</p>
                    <p className="text-sm">{p.eventually}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-3 gap-3">
                  {p.one_thing && (
                    <div className="p-3 border border-[var(--border)] rounded">
                      <p className="text-xs uppercase text-[var(--muted-foreground)] mb-1">One Thing</p>
                      <p className="text-sm">{p.one_thing}</p>
                    </div>
                  )}
                  {p.ritual && (
                    <div className="p-3 border border-[var(--border)] rounded">
                      <p className="text-xs uppercase text-[var(--muted-foreground)] mb-1">Ritual</p>
                      <p className="text-sm">{p.ritual}</p>
                    </div>
                  )}
                  {p.guardrail && (
                    <div className="p-3 border border-[var(--border)] rounded">
                      <p className="text-xs uppercase text-[var(--muted-foreground)] mb-1">Guardrail</p>
                      <p className="text-sm">{p.guardrail}</p>
                    </div>
                  )}
                </div>
                {p.milestones.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-[var(--muted-foreground)] mb-2">Milestones</p>
                    {p.milestones.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-sm py-1">
                        {m.target_date && <span className="text-xs px-2 py-0.5 bg-[var(--muted)] rounded">{m.target_date}</span>}
                        <span>{m.goal}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 text-xs text-[var(--destructive)] hover:underline">
                  <Trash2 size={12} /> Delete persona
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
