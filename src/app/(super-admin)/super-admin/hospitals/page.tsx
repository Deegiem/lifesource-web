"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminDataTable, type AdminTableColumn } from "@/components/super-admin/ui/admin-data-table";
import { AdminEmptyState } from "@/components/super-admin/ui/admin-empty-state";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminSearch } from "@/components/super-admin/ui/admin-search";
import { useSuperAdminHospitalsStore } from "@/stores/super-admin-hospitals.store";
import type { PlatformHospital } from "@/features/super-admin/hospital-types";

export default function SuperAdminHospitalsPage() {
  const { hospitals, isLoading, error, loadHospitals } = useSuperAdminHospitalsStore();
  const [search, setSearch] = useState("");

  useEffect(() => { void loadHospitals(); }, [loadHospitals]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return hospitals.filter((hospital) =>
      !query || [hospital.id, hospital.name, hospital.address, hospital.state, hospital.lga]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [hospitals, search]);

  const columns: AdminTableColumn<PlatformHospital>[] = [
    { key: "hospital", header: "Hospital", render: (hospital) => <div><Link href={`/super-admin/hospitals/${hospital.id}`} className="font-semibold hover:text-(--color-admin-accent)">{hospital.name}</Link><p className="mt-1 text-xs text-(--color-admin-muted)">{hospital.id}</p></div> },
    { key: "location", header: "Location", render: (hospital) => <span className="text-(--color-admin-muted)">{hospital.address}, {hospital.lga}, {hospital.state}</span> },
    { key: "coordinates", header: "Coordinates", render: (hospital) => <span className="text-(--color-admin-muted)">{hospital.latitude !== null && hospital.longitude !== null ? `${hospital.latitude}, ${hospital.longitude}` : "Not provided"}</span> },
    { key: "status", header: "Status", render: (hospital) => <AdminBadge status={hospital.status} /> },
    { key: "action", header: "", render: (hospital) => <Link href={`/super-admin/hospitals/${hospital.id}`} aria-label={`View ${hospital.name}`} className="inline-flex size-9 items-center justify-center rounded-(--radius-md) border border-(--color-admin-border)"><Eye className="size-4" /></Link> },
  ];

  return (
    // Hospital Management    
    <div className="space-y-6">
      <AdminPageHeader title="Hospital Management" description="Maintain the preloaded hospitals available for blood requests." action={<Link href="/super-admin/hospitals/new" className="inline-flex min-h-(--control-height-md) items-center gap-2 rounded-(--radius-md) bg-(--color-admin-accent) px-4 text-sm font-semibold text-(--color-text-inverse)"><Plus className="size-4" />Add Hospital</Link>} />
      <AdminCard className="p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-admin-muted)" /><AdminSearch value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search hospitals" className="pl-10" /></div></AdminCard>
      <AdminCard>{isLoading ? <AdminLoadingState /> : error ? <AdminErrorState message={error} onRetry={() => void loadHospitals()} /> : filtered.length === 0 ? <AdminEmptyState title="No hospitals found" description="No hospitals match the current search." /> : <AdminDataTable columns={columns} rows={filtered} getRowKey={(row) => row.id} />}</AdminCard>
    </div>
  );
}
