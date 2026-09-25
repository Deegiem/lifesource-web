"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminSettingsStore } from "@/stores/super-admin-settings.store";
import type { SuperAdminPlatformSettings } from "@/features/super-admin/settings-types";

const fields: { key: keyof SuperAdminPlatformSettings; label: string }[] = [
  { key: "donorCooldownDays", label: "Donor cooldown (days)" },
  { key: "requesterCooldownHours", label: "Requester cooldown (hours)" },
  { key: "earlyRequesterCooldownHours", label: "Early requester cooldown (hours)" },
  { key: "acceptanceExpiryHours", label: "Acceptance expiry (hours)" },
  { key: "maxDirectDonorsPerRequest", label: "Maximum direct donors per request" },
];

export default function SuperAdminSettingsPage() {
  const { settings, isLoading, isSaving, error, loadSettings, saveSettings } = useSuperAdminSettingsStore();
  const [form, setForm] = useState<SuperAdminPlatformSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { void loadSettings(); }, [loadSettings]);
  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  async function save() {
    if (!form) return;
    setSaved(false);
    await saveSettings(form);
    setSaved(true);
  }

  if (isLoading || !form) {
    return <div className="space-y-6"><AdminCard><AdminLoadingState /></AdminCard></div>;
  }

  return (
    // Platform Settings    
    <div className="mx-auto max-w-(--container-lg) space-y-6">
      <AdminPageHeader title="Platform Settings" description="Configure platform-wide values used by the donation workflows." />
      {error && <AdminErrorState message={error} />}
      {saved && <p className="rounded-(--radius-md) bg-(--color-admin-success-soft) p-3 text-sm text-[#4ade80]">Settings saved.</p>}
      <AdminCard className="p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ key, label }) => (
            <label key={key} className="space-y-2">
              <span className="text-sm font-semibold">{label}</span>
              <input type="number" min="1" value={form[key]} onChange={(event) => { setForm((current) => current ? { ...current, [key]: Number(event.target.value) } : current); setSaved(false); }} className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)" />
            </label>
          ))}
        </div>
        <button type="button" onClick={() => void save()} disabled={isSaving} className="mt-6 inline-flex h-(--control-height-md) items-center gap-2 rounded-(--radius-md) bg-(--color-admin-accent) px-5 text-sm font-semibold text-(--color-text-inverse) disabled:opacity-60"><Save className="size-4" />{isSaving ? "Saving..." : "Save Settings"}</button>
      </AdminCard>
    </div>
  );
}
