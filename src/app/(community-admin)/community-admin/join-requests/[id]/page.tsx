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
import { useCAJoinRequestsStore } from "@/stores/community-admin-join-requests.store";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { CommunityMeResponse } from "@/features/api/types";

export default function JoinRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);
  const [outcome, setOutcome] = useState<"approved" | "rejected" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [community, setCommunity] = React.useState<CommunityMeResponse | null>(
    null,
  );

  const { selectedItem, loadItem } = useCAJoinRequestsStore();
  const request = selectedItem?.id === id ? selectedItem : null;
  const applicantName = request?.name ?? "Loading…";

  useAdminPageHeader({
    title: "Join Request",
    topRight: (
      <Btn
        size="sm"
        variant="outline"
        onClick={() => router.push("/community-admin/join-requests")}
      >
        Back
      </Btn>
    ),
  });

  React.useEffect(() => {
    void loadItem(id);
    void apiService.getMyCommunity().then(setCommunity).catch(() => {});
  }, [id, loadItem]);

  const handleDecision = async (decision: "approve" | "reject") => {
    setBusy(true);
    setError("");
    try {
      if (decision === "approve") {
        await apiService.approveMember(id);
        setOutcome("approved");
      } else {
        await apiService.rejectMember(id);
        setOutcome("rejected");
      }
      setModal(null);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Unable to process the request."),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Crumb
        path={[
          ["Join Requests", "/community-admin/join-requests"],
          [applicantName, ""],
        ]}
      />

      {outcome === "approved" && (
        <div className="bg-ca-green-bg border border-green-400/30 rounded-lg py-3 px-4 mb-3.5 flex gap-2.5 items-center">
          <span className="text-green-400 text-[18px]">✓</span>
          <div>
            <div className="font-bold text-green-400 mb-0.5 leading-tight">
              Membership Approved
            </div>
            <div className="text-[12px] text-ca-muted">
              {applicantName} is now a member of {community?.name ?? "your community"}.
            </div>
          </div>
        </div>
      )}
      {outcome === "rejected" && (
        <div className="bg-ca-red-bg border border-red-400/30 rounded-lg py-3 px-4 mb-3.5">
          <div className="font-bold text-red-400 mb-0.5 leading-tight">
            Membership Request Rejected
          </div>
          <div className="text-[12px] text-ca-muted">
            The applicant has been notified.
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-3.5 text-sm text-red-400"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-[1fr_260px] gap-3.5">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-3.5">
            <span className="font-bold text-[13px] text-ca-text">
              Applicant Information
            </span>
            <SBadge status={outcome ?? "Pending"} />
          </div>
          <InfoRow label="Full Name" value={applicantName} />
          <InfoRow label="Email" value={request?.contact ?? "—"} />
          <InfoRow
            label="Requested Community"
            value={community?.name ?? "—"}
          />
          <InfoRow label="Join Method" value={request?.method ?? "—"} />
          <InfoRow label="Date Submitted" value={request?.date ?? "—"} />
          <InfoRow
            label="Current Status"
            value={<SBadge status={outcome ?? request?.status ?? "Pending"} />}
          />
        </Card>

        <div className="flex flex-col gap-3.5">
          {!outcome && (
            <Card className="p-4">
              <SectionLabel>Decision</SectionLabel>
              <div className="flex flex-col gap-2">
                <Btn
                  variant="primary"
                  disabled={busy}
                  onClick={() => setModal("approve")}
                >
                  Approve Membership
                </Btn>
                <Btn
                  variant="danger"
                  disabled={busy}
                  onClick={() => setModal("reject")}
                >
                  Reject Request
                </Btn>
              </div>
            </Card>
          )}
          <Card className="p-4">
            <SectionLabel>Community</SectionLabel>
            <div className="font-semibold text-ca-text mb-1">
              {community?.name ?? "—"}
            </div>
            <div className="text-[11.5px] text-ca-muted">
              {community?.member_count ?? 0} active members
            </div>
          </Card>
        </div>
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <Card className="w-[340px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">
              {modal === "approve"
                ? "Approve Membership?"
                : "Reject Membership?"}
            </div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-[18px]">
              {modal === "approve"
                ? `${applicantName} will become an active member of ${community?.name ?? "your community"} and can create blood requests.`
                : `${applicantName}'s request to join ${community?.name ?? "your community"} will be rejected. They can reapply.`}
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setModal(null)} disabled={busy}>
                Cancel
              </Btn>
              <Btn
                variant={modal === "approve" ? "primary" : "danger"}
                disabled={busy}
                onClick={() => void handleDecision(modal)}
              >
                {busy
                  ? "Processing…"
                  : modal === "approve"
                    ? "Approve"
                    : "Reject"}
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </>
  );
}