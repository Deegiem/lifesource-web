"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminBreadcrumbs } from "@/components/super-admin/ui/admin-breadcrumbs";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminEmptyState } from "@/components/super-admin/ui/admin-empty-state";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminInfoRow } from "@/components/super-admin/ui/admin-info-row";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminCommunitiesStore } from "@/stores/super-admin-communities.store";

export default function CommunityDetailsPage() {
  const params = useParams<{ communityId: string }>();
  const { selectedCommunity, isDetailLoading, detailError, loadCommunity } =
    useSuperAdminCommunitiesStore();

  useEffect(() => {
    void loadCommunity(params.communityId);
  }, [loadCommunity, params.communityId]);

  return (
          <div className="space-y-6">
        <AdminBreadcrumbs
          items={[
            { label: "Communities", href: "/super-admin/communities" },
            { label: params.communityId },
          ]}
        />

        {isDetailLoading ? (
          <AdminCard><AdminLoadingState /></AdminCard>
        ) : detailError || !selectedCommunity ? (
          <AdminCard>
            <AdminErrorState
              message={detailError ?? "Community not found."}
              onRetry={() => void loadCommunity(params.communityId)}
            />
          </AdminCard>
        ) : (
          <>
            <div>
              <Link
                href="/super-admin/communities"
                className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)"
              >
                <ArrowLeft className="size-4" />
                Back to communities
              </Link>
            </div>

            <AdminPageHeader
              title={selectedCommunity.name}
              description={`${selectedCommunity.id} · ${selectedCommunity.location}`}
              action={<AdminBadge status={selectedCommunity.status} />}
            />

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <AdminCard className="p-6">
                <h2 className="text-lg font-bold">Community information</h2>
                <p className="mt-2 text-sm leading-relaxed text-(--color-admin-muted)">
                  {selectedCommunity.description ?? "No description provided."}
                </p>
                <div className="mt-5">
                  <AdminInfoRow label="Community Admin" value={selectedCommunity.adminName} />
                  <AdminInfoRow label="Admin email" value={selectedCommunity.adminEmail ?? "—"} />
                  <AdminInfoRow label="Admin phone" value={selectedCommunity.adminPhone ?? "—"} />
                  <AdminInfoRow label="Created" value={selectedCommunity.createdLabel} />
                </div>
              </AdminCard>

              <AdminCard className="p-6">
                <h2 className="text-lg font-bold">Overview</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-(--radius-lg) bg-(--color-admin-dim) p-4">
                    <p className="text-xs text-(--color-admin-muted)">Members</p>
                    <p className="mt-1 text-2xl font-bold">{selectedCommunity.memberCount}</p>
                  </div>
                  <div className="rounded-(--radius-lg) bg-(--color-admin-dim) p-4">
                    <p className="text-xs text-(--color-admin-muted)">Requests</p>
                    <p className="mt-1 text-2xl font-bold">{selectedCommunity.requestCount}</p>
                  </div>
                </div>
              </AdminCard>
            </div>

            <AdminCard>
              <div className="flex items-center gap-2 border-b border-(--color-admin-border) p-6">
                <Users className="size-5 text-(--color-admin-accent)" />
                <h2 className="text-lg font-bold">Community members</h2>
              </div>

              {selectedCommunity.members.length === 0 ? (
                <AdminEmptyState title="No members" description="This community has no members yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-160 text-left text-sm">
                    <thead>
                      <tr className="bg-(--color-admin-sidebar) text-xs uppercase text-(--color-admin-muted)">
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCommunity.members.map((member) => (
                        <tr key={member.id} className="border-t border-(--color-admin-border)">
                          <td className="px-4 py-3">
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-xs text-(--color-admin-muted)">{member.id}</p>
                          </td>
                          <td className="px-4 py-3 text-(--color-admin-muted)">
                            {member.role === "community_admin" ? "Community Admin" : "Community Member"}
                          </td>
                          <td className="px-4 py-3"><AdminBadge status={member.status} /></td>
                          <td className="px-4 py-3 text-(--color-admin-muted)">{member.joinedLabel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </AdminCard>

            <AdminCard className="p-6">
              <h2 className="text-lg font-bold">Audit history</h2>
              <div className="mt-5 space-y-4">
                {selectedCommunity.auditTrail.map((event) => (
                  <div key={event.id} className="border-l-2 border-(--color-admin-border) pl-4">
                    <p className="text-sm font-semibold">{event.action}</p>
                    <p className="mt-1 text-sm text-(--color-admin-muted)">{event.description}</p>
                    <p className="mt-1 text-xs text-(--color-admin-muted)">
                      {event.actor} · {event.timestampLabel}
                    </p>
                  </div>
                ))}
              </div>
            </AdminCard>
          </>
        )}
      </div>
  );
}
