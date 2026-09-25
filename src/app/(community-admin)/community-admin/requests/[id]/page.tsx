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
  TH,
  TD,
} from "@/components/community-admin/ui";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [showEscalationNote, setShowEscalationNote] = useState(false);
  const reqId = decodeURIComponent(id) || "REQ-0041";
  const isHighDonor = reqId === "REQ-0041";

  const slots = [
    { slot: 1, status: "Confirmed", time: "2 hrs ago" },
    { slot: 2, status: "Confirmed", time: "3 hrs ago" },
    { slot: 3, status: "Confirmed", time: "5 hrs ago" },
    { slot: 4, status: "Pending", time: "—" },
  ];

  const audit = [
    { action: "Request created", time: "Dec 12 · 10:02" },
    { action: "Broadcast sent", time: "Dec 12 · 10:32" },
    { action: "Donor confirmed", time: "Dec 12 · 11:10" },
    { action: "Donor confirmed", time: "Dec 12 · 12:44" },
  ];

  return (
    <Shell
      title={`Request (${reqId})`}
      topRight={
        <Btn
          size="sm"
          variant="outline"
          onClick={() => router.push("/community-admin/requests")}
        >
          Back
        </Btn>
      }
    >
      <Crumb
        path={[
          ["Community Requests", "/community-admin/requests"],
          [reqId, ""],
        ]}
      />

      {isHighDonor && (
        <div className="bg-ca-amber-bg border border-amber-400/30 rounded-lg px-3.5 py-2.5 mb-3.5 flex justify-between items-center">
          <div>
            <span className="font-bold text-amber-400 text-[12.5px]">
              Request Exception.
            </span>{" "}
            <span className="text-[12.5px] text-ca-muted">
              This request requires more than 10 donors and needs Super Admin
              approval.
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
              <SBadge status="Open" />
            </div>
            <div className="flex flex-col">
              <InfoRow
                label="Request ID"
                value={
                  <span className="font-mono text-ca-accent">{reqId}</span>
                }
              />
              <InfoRow label="Requester" value="Amaka Okafor" />
              <InfoRow label="Community" value={COMMUNITY} />
              <InfoRow
                label="Blood Type"
                value={<span className="font-bold text-ca-red">O+</span>}
              />
              <InfoRow label="Donors Needed" value="4" />
              <InfoRow
                label="Confirmed"
                value={<span className="text-green-400">3 / 4</span>}
              />
              <InfoRow label="Hospital" value="Lagos Island General Hospital" />
              <InfoRow label="Urgency" value="High" />
              <InfoRow label="Created" value="Dec 12, 2024 · 10:02 AM" />
              <InfoRow
                label="Notes"
                value="Pre-op transfusion, surgery Dec 13"
              />
            </div>
          </Card>

          {/* Donor progress */}
          <Card>
            <div className="px-4 py-[11px] border-b border-ca-border">
              <span className="font-bold text-[13px] text-ca-text">
                Donor Progress — 3 of 4 confirmed
              </span>
            </div>
            {/* Progress bar */}
            <div className="px-4 py-[12px] border-b border-ca-border">
              <div className="h-1.5 bg-ca-side rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-green-400 rounded-full" />
              </div>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-ca-side">
                  <TH>Slot</TH>
                  <TH>Status</TH>
                  <TH>Confirmed</TH>
                </tr>
              </thead>
              <tbody>
                {slots.map((d) => (
                  <tr
                    key={d.slot}
                    className="border-b border-ca-border/20 last:border-0 hover:bg-ca-border/5"
                  >
                    <TD muted>Slot {d.slot}</TD>
                    <TD>
                      <SBadge status={d.status} />
                    </TD>
                    <TD muted>{d.time}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3.5">
          <Card className="p-[14px]">
            <SectionLabel>Requester</SectionLabel>
            <div className="font-semibold text-ca-text mb-1">Amaka Okafor</div>
            <div className="text-[11.5px] text-ca-muted mb-2.5">
              Active Member · {COMMUNITY}
            </div>
            <Btn
              size="sm"
              variant="outline"
              onClick={() =>
                router.push("/community-admin/members/Amaka%20Okafor")
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
            {audit.map((a, i) => (
              <div
                key={i}
                className={`px-4 py-[9px] ${i < audit.length - 1 ? "border-b border-ca-border/10" : ""}`}
              >
                <div className="text-[12px] font-medium text-ca-text">
                  {a.action}
                </div>
                <div className="text-[10.5px] text-ca-muted mt-0.5">
                  {a.time}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

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
    </Shell>
  );
}
