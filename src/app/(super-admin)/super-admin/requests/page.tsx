"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, Search } from "lucide-react";

import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminButton } from "@/components/super-admin/ui/admin-button";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminDataTable } from "@/components/super-admin/ui/admin-data-table";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminFilter } from "@/components/super-admin/ui/admin-filter";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminPagination } from "@/components/super-admin/ui/admin-pagination";
import { AdminSearch } from "@/components/super-admin/ui/admin-search";
import { BLOOD_TYPES } from "@/features/super-admin/constants";
import type {
  PlatformRequest,
  PlatformRequestStatus,
} from "@/features/super-admin/request-types";
import { useSuperAdminRequestsStore } from "@/stores/super-admin-requests.store";

const statusOptions = [
  ["", "All Statuses"],
  ["open", "Open"],
  ["fulfilled", "Fulfilled"],
  ["escalated", "Escalated"],
] as const;

export default function SuperAdminRequestsPage() {
  const { requests, isLoading, error, loadRequests } =
    useSuperAdminRequestsStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [bloodType, setBloodType] = useState("");

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        [
          request.id,
          request.requester,
          request.hospital,
          request.community,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus = !status || request.status === status;
      const matchesBlood = !bloodType || request.bloodType === bloodType;

      return matchesSearch && matchesStatus && matchesBlood;
    });
  }, [requests, search, status, bloodType]);

  return (
    <>
      <AdminPageHeader
        title="Platform Requests"
        description="Review blood requests across the entire LIFESOURCE platform."
        action={
          <AdminButton size="sm">
            <Download size={15} className="mr-2" />
            Export CSV
          </AdminButton>
        }
      />

      <AdminCard className="mb-4 p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_11rem]">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-admin-muted)"
            />
            <AdminSearch
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requests..."
              className="pl-9"
            />
          </div>

          <AdminFilter
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </AdminFilter>

          <AdminFilter
            value={bloodType}
            onChange={(event) => setBloodType(event.target.value)}
          >
            <option value="">All Blood Types</option>
            {BLOOD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </AdminFilter>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden">
        {isLoading ? <AdminLoadingState /> : null}

        {error ? (
          <AdminErrorState
            message={error}
            onRetry={() => void loadRequests()}
          />
        ) : null}

        {!isLoading && !error ? (
          <>
            <AdminDataTable<PlatformRequest>
              rows={filteredRequests}
              getRowKey={(row) => row.id}
              columns={[
                {
                  key: "id",
                  header: "Request ID",
                  render: (row) => (
                    <Link
                      href={`/super-admin/requests/${row.id}`}
                      className="font-mono text-xs font-semibold text-(--color-admin-accent) hover:underline"
                    >
                      {row.id}
                    </Link>
                  ),
                },
                {
                  key: "blood",
                  header: "Blood",
                  render: (row) => (
                    <span className="font-bold text-(--color-blood)">
                      {row.bloodType}
                    </span>
                  ),
                },
                {
                  key: "need",
                  header: "Need",
                  render: (row) => row.donorsNeeded,
                },
                {
                  key: "confirmed",
                  header: "Confirmed",
                  render: (row) => (
                    <span
                      className={
                        row.confirmedDonors >= row.donorsNeeded
                          ? "text-[#4ade80]"
                          : "text-(--color-admin-text)"
                      }
                    >
                      {row.confirmedDonors}/{row.donorsNeeded}
                    </span>
                  ),
                },
                {
                  key: "hospital",
                  header: "Hospital",
                  render: (row) => (
                    <span className="text-(--color-admin-muted)">
                      {row.hospital}
                    </span>
                  ),
                },
                {
                  key: "community",
                  header: "Community",
                  render: (row) => (
                    <span className="text-(--color-admin-muted)">
                      {row.community}
                    </span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => (
                    <AdminBadge status={row.status as PlatformRequestStatus} />
                  ),
                },
                {
                  key: "date",
                  header: "Date",
                  render: (row) => (
                    <span className="text-(--color-admin-muted)">
                      {row.dateLabel}
                    </span>
                  ),
                },
                {
                  key: "view",
                  header: "",
                  render: (row) => (
                    <Link
                      href={`/super-admin/requests/${row.id}`}
                      aria-label={`View ${row.id}`}
                      className="inline-flex rounded-(--radius-md) p-2 text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)"
                    >
                      <Eye size={16} />
                    </Link>
                  ),
                },
              ]}
            />

            {filteredRequests.length === 0 ? (
              <div className="border-t border-(--color-admin-border) px-5 py-10 text-center text-sm text-(--color-admin-muted)">
                No requests match the selected filters.
              </div>
            ) : null}

            <AdminPagination
              showing={filteredRequests.length}
              total={234}
              page={1}
              totalPages={39}
            />
          </>
        ) : null}
      </AdminCard>
    </>
  );
}
