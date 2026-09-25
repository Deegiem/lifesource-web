"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search, SlidersHorizontal } from "lucide-react";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminButton } from "@/components/super-admin/ui/admin-button";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminDataTable, type AdminTableColumn } from "@/components/super-admin/ui/admin-data-table";
import { AdminEmptyState } from "@/components/super-admin/ui/admin-empty-state";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminFilter } from "@/components/super-admin/ui/admin-filter";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminSearch } from "@/components/super-admin/ui/admin-search";
import { useSuperAdminCommunitiesStore } from "@/stores/super-admin-communities.store";
import type { PlatformCommunity, PlatformCommunityStatus } from "@/features/super-admin/community-types";

export default function SuperAdminCommunitiesPage() {
  const { communities, isLoading, error, loadCommunities } = useSuperAdminCommunitiesStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PlatformCommunityStatus | "all">("all");

  useEffect(() => { void loadCommunities(); }, [loadCommunities]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return communities.filter((community) => {
      const matchesSearch = !query || [community.id, community.name, community.adminName, community.location, community.type]
        .some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (status === "all" || community.status === status);
    });
  }, [communities, search, status]);

  const columns: AdminTableColumn<PlatformCommunity>[] = [
    {
      key: "community", header: "Community", render: (community) => (
        <div><Link href={`/super-admin/communities/${community.id}`} className="font-semibold hover:text-(--color-admin-accent)">{community.name}</Link><p className="mt-1 text-xs text-(--color-admin-muted)">{community.id} · {community.type}</p></div>
      )
    },
    { key: "location", header: "Location", render: (community) => <span className="text-(--color-admin-muted)">{community.location}</span> },
    { key: "admin", header: "Community Admin", render: (community) => community.adminName },
    { key: "members", header: "Members", render: (community) => community.memberCount },
    { key: "requests", header: "Requests", render: (community) => community.requestCount },
    { key: "status", header: "Status", render: (community) => <AdminBadge status={community.status} /> },
    { key: "action", header: "", render: (community) => <Link href={`/super-admin/communities/${community.id}`} aria-label={`View ${community.name}`} className="inline-flex size-9 items-center justify-center rounded-(--radius-md) border border-(--color-admin-border)"><Eye className="size-4" /></Link> },
  ];

  return (
    // Community Management   
    <div className="space-y-6">
      <AdminPageHeader
        title="Community Management" description="Manage communities and review platform-wide community activity."
        action={
          <Link
            href="/super-admin/community-admins/invite"
            className="inline-flex min-h-(--control-height-md) items-center gap-2 rounded-(--radius-md) bg-(--color-admin-accent) px-4 text-sm font-semibold text-(--color-text-inverse)"
          >
            <Plus className="size-4" />
            Invite Comm Admin
          </Link>} />

      <AdminCard className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-admin-muted)" />
            <AdminSearch
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by community, admin, location or ID" className="pl-10" />
          </div>
          <label className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-(--color-admin-muted)" />
            <span className="sr-only">
              Status
            </span>
            <AdminFilter
              value={status}
              onChange={(event) => setStatus(event.target.value as PlatformCommunityStatus | "all")}>
              <option value="all">
                All statuses
              </option>
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
            </AdminFilter>
          </label>
        </div>
      </AdminCard>
      <AdminCard>
        {isLoading ? <AdminLoadingState />
          : error ? <AdminErrorState message={error} onRetry={() => void loadCommunities()} />
            : filtered.length === 0 ? <AdminEmptyState title="No communities found" description="No communities match the current filters." />
              : <AdminDataTable columns={columns} rows={filtered} getRowKey={(row) => row.id} />}
      </AdminCard>
    </div>
  );
}
