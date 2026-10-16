"use client";

import { useEffect } from "react";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminSettingsStore } from "@/stores/super-admin-settings.store";

export default function SuperAdminSettingsPage() {
  const { isLoading, error, loadSettings } = useSuperAdminSettingsStore();
  useEffect(() => { void loadSettings(); }, [loadSettings]);

  return <div className="space-y-6"><AdminPageHeader title="Platform Settings" description="Configure platform-wide values used by the donation workflows." />{isLoading ? <AdminCard><AdminLoadingState /></AdminCard> : error ? <AdminCard><AdminErrorState message={error} onRetry={() => void loadSettings()} /></AdminCard> : <AdminCard><p className="p-5 text-sm text-(--color-admin-muted)">No settings data is available.</p></AdminCard>}</div>;
}
