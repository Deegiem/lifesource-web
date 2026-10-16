"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { Crumb } from "@/components/community-admin/ui/ca-breadcrumbs";
import { InfoRow } from "@/components/community-admin/ui/ca-info-row";
import { SectionLabel } from "@/components/community-admin/ui/ca-section-label";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { Modal } from "@/components/community-admin/ui/ca-modal";
import { TH, TD } from "@/components/community-admin/ui/ca-table";
import { useCARequestsStore } from "@/stores/community-admin-requests.store";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [showEscalationNote, setShowEscalationNote] = useState(false);

  const { selectedItem, isLoading, error, loadItem } = useCARequestsStore();

  const request = selectedItem?.id === id ? selectedItem : null;

  useAdminPageHeader({
    title: request ? `Request (${request.reference_code})` : "Request",
    topRight: (
      <Btn
        size="sm"
        variant="outline"
        onClick={() => router.push("/community-admin/requests")}
      >
        Back
      </Btn>
    ),
  });

  React.useEffect(() => {
    void loadItem(id);
  }, [id, loadItem]);

  const reqId = request?.reference_code ?? "—";

  // Progress computation
  const needed = request?.donors_needed ?? 0;
  const confirmed = request?.confirmed_count ?? 0;
  const progressPercent =
    needed > 0 ? Math.min(100, Math.round((confirmed / needed) * 100)) : 0;

  // Escalation flag: request needs > 10 donors
  const isHighDonor = needed > 10;

  // Hospital can be an object or a string depending on backend — normalise
  const hospitalLabel = (() => {
    if (!request?.hospital) return "—";
    if (typeof request.hospital === "string") return request.hospital;
    return request.hospital?.name ?? "—";
  })();

  return (
    <>
      <Crumb
        path={[
          ["Community Requests", "/community-admin/requests"],
          [reqId, ""],
        ]}
      />

      {isLoading && !request ? (
        <Card className="p-4">
          <p className="text-sm text-ca-muted">Loading request…</p>
        </Card>
      ) : null}

      {error ? (
        <Card className="p-4">
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        </Card>
      ) : null}

      {!isLoading && !error && !request ? (
        <Card className="p-4">
          <p className="text-sm text-ca-muted">
            Request not found or you do not have access to it.
          </p>
        </Card>
      ) : null}

      {request && (
        <>
          {isHighDonor && (
            <div className="bg-ca-amber-bg border border-amber-400/30 rounded-lg px-3.5 py-2.5 mb-3.5 flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-400 text-[12.5px]">
                  Request Exception.
                </span>{" "}
                <span className="text-[12.5px] text-ca-muted">
                  This request requires more than 10 donors and needs Super
                  Admin approval.
                </span>
              </div>
              <Btn
                size="sm"
                variant="outline"
                onClick={() => setShowEscalationNote(true)}
              >
                Submit Escalation
              </Btn>
            </div>
          )}

          <div className="grid grid-cols-[1fr_260px] gap-3.5">
            <div className="flex flex-col gap-3.5">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3.5">
                  <span className="font-bold text-[13px] text-ca-text">
                    Request Information
                  </span>
                  <SBadge status={request.status} />
                </div>
                <div className="flex flex-col">
                  <InfoRow
                    label="Request ID"
                    value={
                      <span className="font-mono text-ca-accent">
                        {request.reference_code}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Requester"
                    value={request.requester.full_name}
                  />
                  <InfoRow
                    label="Blood Type"
                    value={
                      <span className="font-bold text-ca-red">
                        {request.blood_type_needed}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Donors Needed"
                    value={String(request.donors_needed)}
                  />
                  <InfoRow
                    label="Accepted"
                    value={String(request.accepted_count)}
                  />
                  <InfoRow
                    label="Confirmed"
                    value={
                      <span className="text-green-400">
                        {request.confirmed_count} / {request.donors_needed}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Donors Left"
                    value={String(request.donors_left)}
                  />
                  <InfoRow label="Hospital" value={hospitalLabel} />
                  <InfoRow label="Urgency" value={request.urgency} />
                  <InfoRow
                    label="Created"
                    value={new Date(request.created_at).toLocaleString()}
                  />
                  <InfoRow
                    label="Expires"
                    value={new Date(request.expires_at).toLocaleString()}
                  />
                  {request.closed_at ? (
                    <InfoRow
                      label="Closed"
                      value={new Date(request.closed_at).toLocaleString()}
                    />
                  ) : null}
                  {request.notes ? (
                    <InfoRow label="Notes" value={request.notes} />
                  ) : null}
                </div>
              </Card>

              {/* Donor progress */}
              <Card>
                <div className="px-4 py-[11px] border-b border-ca-border">
                  <span className="font-bold text-[13px] text-ca-text">
                    Donor Progress — {request.confirmed_count} of{" "}
                    {request.donors_needed} confirmed
                  </span>
                </div>
                <div className="px-4 py-[12px] border-b border-ca-border">
                  <div className="h-1.5 bg-ca-side rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {request.acceptance_activity.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-ca-side">
                        <TH>#</TH>
                        <TH>Status</TH>
                        <TH>Accepted</TH>
                        <TH>Confirmed</TH>
                      </tr>
                    </thead>
                    <tbody>
                      {request.acceptance_activity.map((entry, index) => (
                        <tr
                          key={index}
                          className="border-b border-ca-border/20 last:border-0 hover:bg-ca-border/5"
                        >
                          <TD muted>
                            <span className="font-mono text-[11.5px]">
                              #{index + 1}
                            </span>
                          </TD>
                          <TD>
                            <SBadge status={entry.status} />
                          </TD>
                          <TD muted>
                            {entry.accepted_at
                              ? new Date(entry.accepted_at).toLocaleString()
                              : "—"}
                          </TD>
                          <TD muted>
                            {entry.confirmed_at
                              ? new Date(entry.confirmed_at).toLocaleString()
                              : "—"}
                          </TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="px-4 py-4 text-sm text-ca-muted">
                    No donor acceptances yet.
                  </p>
                )}
              </Card>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-3.5">
              <Card className="p-[14px]">
                <SectionLabel>Requester</SectionLabel>
                <div className="font-semibold text-ca-text mb-1">
                  {request.requester.full_name}
                </div>
                {request.requester.phone ? (
                  <div className="text-[11.5px] text-ca-muted mb-2.5">
                    {request.requester.phone}
                  </div>
                ) : null}
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/community-admin/members/${encodeURIComponent(request.requester.id)}`,
                    )
                  }
                >
                  View Member
                </Btn>
              </Card>

              <Card>
                <div className="px-4 py-[11px] border-b border-ca-border">
                  <span className="font-bold text-[12px] text-ca-text">
                    Activity
                  </span>
                </div>
                <div className="px-4 py-[9px] border-b border-ca-border/10">
                  <div className="text-[12px] font-medium text-ca-text">
                    Request created
                  </div>
                  <div className="text-[10.5px] text-ca-muted mt-0.5">
                    {new Date(request.created_at).toLocaleString()}
                  </div>
                </div>
                {request.acceptance_activity.map((entry, index) => (
                  <div
                    key={index}
                    className="px-4 py-[9px] border-b border-ca-border/10 last:border-0"
                  >
                    <div className="text-[12px] font-medium text-ca-text">
                      Donor {entry.status.toLowerCase()}
                    </div>
                    <div className="text-[10.5px] text-ca-muted mt-0.5">
                      {entry.confirmed_at
                        ? new Date(entry.confirmed_at).toLocaleString()
                        : entry.accepted_at
                          ? new Date(entry.accepted_at).toLocaleString()
                          : "—"}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </>
      )}

      {showEscalationNote && (
        <Modal onClose={() => setShowEscalationNote(false)}>
          <Card className="w-[400px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">
              Submit Escalation
            </div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-4">
              Provide a reason for escalating this request to Super Admins. They
              can broadcast this to neighboring communities.
            </p>
            <textarea
              className="w-full h-[100px] bg-ca-side border border-ca-border rounded-md px-3 py-2 text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors mb-4 resize-none"
              placeholder="e.g. Rare blood type needed urgently, community pool exhausted."
            />
            <div className="flex gap-2 justify-end">
              <Btn
                variant="outline"
                onClick={() => setShowEscalationNote(false)}
              >
                Cancel
              </Btn>
              <Btn
                variant="primary"
                onClick={() => setShowEscalationNote(false)}
              >
                Submit to Super Admin
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </>
  );
}