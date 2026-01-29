"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

interface UserSettings {
  super_objective: string;
  prayer_calculation_method: string;
  latitude: number | null;
  longitude: number | null;
  theme: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<UserSettings>("/settings").then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await api.patch("/settings", settings);
    setSaving(false);
  }

  if (!settings) {
    return <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold mb-6">Settings</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Super Objective</label>
          <input
            value={settings.super_objective}
            onChange={(e) => setSettings({ ...settings, super_objective: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Prayer Calculation Method</label>
          <select
            value={settings.prayer_calculation_method}
            onChange={(e) => setSettings({ ...settings, prayer_calculation_method: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]"
          >
            <option value="ISNA">ISNA</option>
            <option value="MWL">Muslim World League</option>
            <option value="Egypt">Egyptian General Authority</option>
            <option value="Karachi">University of Islamic Sciences, Karachi</option>
            <option value="Makkah">Umm al-Qura, Makkah</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={settings.latitude ?? ""}
              onChange={(e) => setSettings({ ...settings, latitude: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={settings.longitude ?? ""}
              onChange={(e) => setSettings({ ...settings, longitude: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded text-sm bg-[var(--background)]"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded text-sm hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
