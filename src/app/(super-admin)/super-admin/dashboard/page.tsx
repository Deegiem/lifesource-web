"use client";

import { useEffect } from "react";
import { ArrowRight, ClipboardList, UsersRound } from "lucide-react";
import Link from "next/link";

import { AdminShell } from "@/components/super-admin/layout/admin-shell";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminDataTable } from "@/components/super-admin/ui/admin-data-table";
import { useSuperAdminStore } from "@/stores/super-admin.store";
import type { CommunitySummary } from "@/features/super-admin/types";

export default function SuperAdminDashboardPage() {
  const { dashboard, isLoading, error, loadDashboard } = useSuperAdminStore();

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Platform-wide overview of blood donation activity."
      />

      {isLoading && !dashboard ? <AdminLoadingState /> : null}

      {error && !dashboard ? (
        <AdminCard>
          <AdminErrorState message={error} onRetry={() => void loadDashboard()} />
        </AdminCard>
      ) : null}

      {dashboard ? (
        <>
          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<ClipboardList size={18} />}
              label="Total Donations"
              value={dashboard.stats.totalDonations.toLocaleString()}
              detail="Recorded donations"
            />
            <StatCard
              icon={<ClipboardList size={18} />}
              label="Active Requests"
              value={dashboard.stats.activeRequests}
              detail="Currently open"
            />
            <StatCard
              icon={<UsersRound size={18} />}
              label="Cooldown Pool"
              value={dashboard.stats.cooldownPool}
              detail="Donors unavailable"
            />
            <StatCard
              icon={<UsersRound size={18} />}
              label="Communities"
              value={dashboard.stats.communities}
              detail={`${dashboard.stats.activeCommunities} active`}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <AdminCard className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-(--color-admin-border) px-5 py-4">
                <div>
                  <h2 className="text-sm font-bold text-(--color-admin-text)">
                    Community Activity
                  </h2>
                  <p className="mt-1 text-xs text-(--color-admin-muted)">
                    Activity summary across platform communities.
                  </p>
                </div>

                <Link
                  href="/super-admin/communities"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-(--color-admin-accent) hover:underline"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>

              <AdminDataTable<CommunitySummary>
                rows={dashboard.communities}
                getRowKey={(row) => row.id}
                columns={[
                  {
                    key: "name",
                    header: "Community",
                    render: (row) => (
                      <span className="font-semibold">{row.name}</span>
                    ),
                  },
                  {
                    key: "members",
                    header: "Members",
                    render: (row) => (
                      <span className="text-(--color-admin-muted)">
                        {row.members.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    key: "requests",
                    header: "Requests (30d)",
                    render: (row) => (
                      <span className="text-(--color-admin-muted)">
                        {row.requestsLast30Days}
                      </span>
                    ),
                  },
                  {
                    key: "active",
                    header: "Last Active",
                    render: (row) => (
                      <span className="text-(--color-admin-muted)">
                        {row.lastActiveLabel}
                      </span>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => <AdminBadge status={row.status} />,
                  },
                ]}
              />
            </AdminCard>

            <AdminCard className="h-fit overflow-hidden">
              <div className="border-b border-(--color-admin-border) px-5 py-4">
                <h2 className="text-sm font-bold text-(--color-admin-text)">
                  Recent Activity
                </h2>
              </div>

              <div>
                {dashboard.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-b border-(--color-admin-border)/20 px-5 py-4 last:border-b-0"
                  >
                    <p className="text-xs font-semibold text-(--color-admin-text)">
                      {activity.action}
                    </p>
                    <p className="mt-1 truncate text-xs text-(--color-admin-muted)">
                      {activity.entity}
                    </p>
                    <p className="mt-1 text-[10px] text-(--color-admin-dim)">
                      {activity.timestampLabel}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-(--color-admin-border) p-4">
                <Link
                  href="/super-admin/audit-log"
                  className="text-xs font-semibold text-(--color-admin-accent) hover:underline"
                >
                  View audit log
                </Link>
              </div>
            </AdminCard>
          </section>
        </>
      ) : null}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <AdminCard className="p-5">
      <div className="mb-4 flex items-center gap-2 text-(--color-admin-muted)">
        <span className="flex h-8 w-8 items-center justify-center rounded-(--radius-md) bg-(--color-admin-accent-soft) text-(--color-admin-accent)">
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="text-3xl font-extrabold leading-none text-(--color-admin-text)">
        {value}
      </p>

      <p className="mt-2 text-xs text-(--color-admin-muted)">{detail}</p>
    </AdminCard>
  );
}
