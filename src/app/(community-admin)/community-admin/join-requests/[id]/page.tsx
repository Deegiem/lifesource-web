"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/community-admin/shell";
import {
  Card,
  Crumb,
  InfoRow,
  SectionLabel,
  SBadge,
  Btn,
  COMMUNITY,
  Modal,
} from "@/components/community-admin/ui";

export default function JoinRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);
  const [outcome, setOutcome] = useState<"approved" | "rejected" | null>(null);

  const applicantName = decodeURIComponent(id) || "Danladi Usman";

  const isPending = !outcome;

  return (
    <Shell
      title={`Join Request`}
      topRight={
        <Btn
          size="sm"
          variant="outline"
          onClick={() => router.push("/community-admin/join-requests")}
        >
          Back
        </Btn>
      }
    >
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
              {applicantName} is now a member of {COMMUNITY}.
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

      <div className="grid grid-cols-[1fr_260px] gap-3.5">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-3.5">
            <span className="font-bold text-[13px] text-ca-text">
              Applicant Information
            </span>
            <SBadge status={outcome ?? "Pending"} />
          </div>
          <InfoRow label="Full Name" value={applicantName} />
          <InfoRow label="Phone" value="+234 803 001 0001" />
          <InfoRow label="Requested Community" value={COMMUNITY} />
          <InfoRow label="Join Method" value="Invite link" />
          <InfoRow label="Date Submitted" value="Dec 12, 2024 · 09:32 AM" />
          <InfoRow
            label="Current Status"
            value={<SBadge status={outcome ?? "Pending"} />}
          />
        </Card>

        <div className="flex flex-col gap-3.5">
          {isPending && (
            <Card className="p-4">
              <SectionLabel>Decision</SectionLabel>
              <div className="flex flex-col gap-2">
                <Btn variant="primary" onClick={() => setModal("approve")}>
                  Approve Membership
                </Btn>
                <Btn variant="danger" onClick={() => setModal("reject")}>
                  Reject Request
                </Btn>
              </div>
            </Card>
          )}
          <Card className="p-4">
            <SectionLabel>Community</SectionLabel>
            <div className="font-semibold text-ca-text mb-1">{COMMUNITY}</div>
            <div className="text-[11.5px] text-ca-muted">
              218 active members
            </div>
          </Card>
        </div>
      </div>

      {/* Confirm modals */}
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
                ? `${applicantName} will become an active member of ${COMMUNITY} and can create blood requests.`
                : `${applicantName}'s request to join ${COMMUNITY} will be rejected. They can reapply.`}
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Btn>
              <Btn
                variant={modal === "approve" ? "primary" : "danger"}
                onClick={() => {
                  setOutcome(modal === "approve" ? "approved" : "rejected");
                  setModal(null);
                }}
              >
                {modal === "approve" ? "Approve" : "Reject"}
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </Shell>
  );
}
