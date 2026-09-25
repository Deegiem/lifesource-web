"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminDataTable, type AdminTableColumn } from "@/components/super-admin/ui/admin-data-table";
import { AdminEmptyState } from "@/components/super-admin/ui/admin-empty-state";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminSearch } from "@/components/super-admin/ui/admin-search";
import { useSuperAdminOverridesStore } from "@/stores/super-admin-overrides.store";
import type { OverrideRequest } from "@/features/super-admin/override-types";

const typeLabels: Record<OverrideRequest["type"], string> = {
  donor_cooldown: "Donor cooldown",
  request_exception: "Request exception",
  other: "Other",
};

export default function OverrideRequestsPage() {
  const { requests, isLoading, error, loadRequests } = useSuperAdminOverridesStore();
  const [search, setSearch] = useState("");
  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((request) => !query || [request.id, request.requester, request.community, request.reason, typeLabels[request.type]].some((value) => value.toLowerCase().includes(query)));
  }, [requests, search]);

  const columns: AdminTableColumn<OverrideRequest>[] = [
    { key: "request", header: "Request", render: (request) => <div><Link href={`/super-admin/overrides/${request.id}`} className="font-semibold hover:text-(--color-admin-accent)">{request.id}</Link><p className="mt-1 text-xs text-(--color-admin-muted)">{typeLabels[request.type]}</p></div> },
    { key: "requester", header: "Requester", render: (request) => request.requester },
    { key: "community", header: "Community", render: (request) => <span className="text-(--color-admin-muted)">{request.community}</span> },
    { key: "status", header: "Status", render: (request) => <AdminBadge status={request.status} /> },
    { key: "submitted", header: "Submitted", render: (request) => <span className="text-(--color-admin-muted)">{request.submittedLabel}</span> },
    { key: "action", header: "", render: (request) => <Link href={`/super-admin/overrides/${request.id}`} aria-label={`Review ${request.id}`} className="inline-flex size-9 items-center justify-center rounded-(--radius-md) border border-(--color-admin-border)"><Eye className="size-4" /></Link> },
  ];

  return (
    // Override Requests   
    <div className="space-y-6">
      <AdminPageHeader title="Override Requests" description="Review platform-level exception requests requiring Super Admin action." />
      <AdminCard className="p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-admin-muted)" /><AdminSearch value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search override requests" className="pl-10" /></div></AdminCard>
      <AdminCard>{isLoading ? <AdminLoadingState /> : error ? <AdminErrorState message={error} onRetry={() => void loadRequests()} /> : filtered.length === 0 ? <AdminEmptyState title="No override requests found" description="No requests match the current search." /> : <AdminDataTable columns={columns} rows={filtered} getRowKey={(row) => row.id} />}</AdminCard>
    </div>
  );
}
