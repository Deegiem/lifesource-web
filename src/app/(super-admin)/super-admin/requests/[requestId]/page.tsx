"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminButton } from "@/components/super-admin/ui/admin-button";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminInfoRow } from "@/components/super-admin/ui/admin-info-row";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminRequestsStore } from "@/stores/super-admin-requests.store";

export default function SuperAdminRequestDetailPage() {
  const params = useParams<{ requestId: string }>();
  const requestId = params.requestId;

  const {
    selectedRequest,
    isDetailLoading,
    detailError,
    loadRequest,
  } = useSuperAdminRequestsStore();

  useEffect(() => {
    if (requestId) {
      void loadRequest(requestId);
    }
  }, [requestId, loadRequest]);

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/super-admin/requests"
          className="inline-flex items-center gap-2 text-xs font-semibold text-(--color-admin-accent) hover:underline"
        >
          <ArrowLeft size={14} />
          Requests
        </Link>
        <span className="text-xs text-(--color-admin-dim)">/</span>
        <span className="text-xs text-(--color-admin-muted)">
          {requestId}
        </span>
      </div>

      {isDetailLoading ? <AdminLoadingState /> : null}

      {detailError ? (
        <AdminCard>
          <AdminErrorState message={detailError} />
        </AdminCard>
      ) : null}

      {selectedRequest ? (
        <>
          <AdminPageHeader
            title={`Request ${selectedRequest.id}`}
            description="Platform-wide request details and confirmation progress."
            action={
              <div className="flex gap-2">
                <Link href="/super-admin/requests">
                  <AdminButton size="sm">Back</AdminButton>
                </Link>
                <AdminButton size="sm" variant="danger">
                  Review
                </AdminButton>
              </div>
            }
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="flex min-w-0 flex-col gap-6">
              <AdminCard className="p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-sm font-bold text-(--color-admin-text)">
                    Request Information
                  </h2>
                  <AdminBadge status={selectedRequest.status} />
                </div>

                <AdminInfoRow
                  label="Request ID"
                  value={
                    <span className="font-mono text-(--color-admin-accent)">
                      {selectedRequest.id}
                    </span>
                  }
                />
                <AdminInfoRow
                  label="Blood Type"
                  value={
                    <span className="font-bold text-(--color-blood)">
                      {selectedRequest.bloodType}
                    </span>
                  }
                />
                <AdminInfoRow
                  label="Donors Needed"
                  value={selectedRequest.donorsNeeded}
                />
                <AdminInfoRow
                  label="Confirmed Donors"
                  value={
                    <span className="text-[#4ade80]">
                      {selectedRequest.confirmedDonors} /{" "}
                      {selectedRequest.donorsNeeded}
                    </span>
                  }
                />
                <AdminInfoRow
                  label="Hospital"
                  value={selectedRequest.hospital}
                />
                <AdminInfoRow
                  label="Urgency"
                  value={
                    <span className="capitalize">
                      {selectedRequest.urgency}
                    </span>
                  }
                />
                <AdminInfoRow
                  label="Created"
                  value={selectedRequest.createdLabel}
                />
                <AdminInfoRow label="Notes" value={selectedRequest.notes} />
              </AdminCard>

              <AdminCard className="overflow-hidden">
                <div className="border-b border-(--color-admin-border) px-5 py-4">
                  <h2 className="text-sm font-bold text-(--color-admin-text)">
                    Donor Confirmation Progress
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-(--color-admin-sidebar)">
                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-(--color-admin-muted)">
                          Slot
                        </th>
                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-(--color-admin-muted)">
                          Status
                        </th>
                        <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-(--color-admin-muted)">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.donorSlots.map((slot) => (
                        <tr
                          key={slot.slot}
                          className="border-b border-(--color-admin-border)/20 last:border-b-0"
                        >
                          <td className="px-5 py-3 text-sm text-(--color-admin-muted)">
                            Slot {slot.slot}
                          </td>
                          <td className="px-5 py-3">
                            <AdminBadge status={slot.status} />
                          </td>
                          <td className="px-5 py-3 text-sm text-(--color-admin-muted)">
                            {slot.timeLabel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AdminCard>
            </div>

            <div className="flex flex-col gap-6">
              <AdminCard className="p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-(--color-admin-muted)">
                  Requester
                </p>
                <p className="text-sm font-bold text-(--color-admin-text)">
                  {selectedRequest.requester}
                </p>
                <p className="mt-1 text-xs text-(--color-admin-muted)">
                  {selectedRequest.requesterPhone} ·{" "}
                  {selectedRequest.requesterRole}
                </p>
                <Link
                  href="/super-admin/users"
                  className="mt-4 inline-flex text-xs font-semibold text-(--color-admin-accent) hover:underline"
                >
                  View Profile
                </Link>
              </AdminCard>

              <AdminCard className="p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-(--color-admin-muted)">
                  Community
                </p>
                <p className="text-sm font-bold text-(--color-admin-text)">
                  {selectedRequest.community}
                </p>
                <p className="mt-1 text-xs text-(--color-admin-muted)">
                  {selectedRequest.communityLocation} ·{" "}
                  {selectedRequest.communityType}
                </p>
                <Link
                  href="/super-admin/communities"
                  className="mt-4 inline-flex text-xs font-semibold text-(--color-admin-accent) hover:underline"
                >
                  View Community
                </Link>
              </AdminCard>

              <AdminCard className="overflow-hidden">
                <div className="border-b border-(--color-admin-border) px-5 py-4">
                  <h2 className="text-sm font-bold text-(--color-admin-text)">
                    Audit Trail
                  </h2>
                </div>

                {selectedRequest.auditTrail.map((event) => (
                  <div
                    key={event.id}
                    className="border-b border-(--color-admin-border)/20 px-5 py-4 last:border-b-0"
                  >
                    <p className="text-xs font-semibold text-(--color-admin-text)">
                      {event.action}
                    </p>
                    <p className="mt-1 text-[11px] text-(--color-admin-muted)">
                      {event.actor} · {event.timeLabel}
                    </p>
                  </div>
                ))}
              </AdminCard>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
