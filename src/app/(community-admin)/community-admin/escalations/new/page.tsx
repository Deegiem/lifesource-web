"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { SectionLabel } from "@/components/community-admin/ui/ca-section-label";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { useCAEscalationsStore } from "@/stores/community-admin-escalations.store";

export default function SubmitEscalationPage() {
  const router = useRouter();
  const { submit } = useCAEscalationsStore();

  const [type, setType] = useState<"donor-cap" | "cooldown">("donor-cap");
  const [step, setStep] = useState<"form" | "submitted" | "error">("form");
  const [reason, setReason] = useState("");
  const [relatedId, setRelatedId] = useState("");
  const [vouched, setVouched] = useState(false);
  const [busy, setBusy] = useState(false);

  useAdminPageHeader({ title: "Submit Escalation" });

  const canSubmit =
    reason.trim().length >= 20 &&
    relatedId.length > 0 &&
    (type !== "cooldown" || vouched);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    try {
      await submit({ type, relatedId, reason });
      setStep("submitted");
    } catch {
      setStep("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="max-w-[560px]">
        {step === "submitted" && (
          <div className="bg-ca-green-bg border border-green-400/30 rounded-lg py-3.5 px-4 mb-[18px] flex gap-3 items-start">
            <span className="text-green-400 text-[20px] shrink-0 leading-none">
              ✓
            </span>
            <div>
              <div className="font-bold text-green-400 mb-1 leading-tight">
                Escalation Submitted
              </div>
              <div className="text-[12.5px] text-ca-muted leading-relaxed">
                Your escalation is now pending Super Admin review. You will be
                notified of the decision.
              </div>
              <div className="mt-3 flex gap-2">
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/community-admin/escalations")}
                >
                  View Escalations
                </Btn>
                <Btn
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setStep("form");
                    setReason("");
                    setRelatedId("");
                    setVouched(false);
                  }}
                >
                  Submit Another
                </Btn>
              </div>
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-4">
            <div className="font-bold text-red-400 mb-0.5 leading-tight">
              Submission Failed
            </div>
            <div className="text-[12px] text-ca-muted">
              Check your details and try again.
            </div>
          </div>
        )}

        {step !== "submitted" && (
          <Card className="p-[22px]">
            <div className="mb-5">
              <SectionLabel>Escalation Type</SectionLabel>
              <div className="flex flex-col gap-2">
                {(
                  [
                    {
                      value: "donor-cap",
                      label: "More than 10 donors",
                      desc: "Request requires more than the platform maximum of 10 donors.",
                    },
                    {
                      value: "cooldown",
                      label: "Early cooldown reactivation",
                      desc: "Requester is still within cooldown but has an urgent need.",
                    },
                  ] as const
                ).map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`px-3.5 py-3 rounded-lg border-2 cursor-pointer transition-colors ${type === opt.value
                        ? "border-ca-accent bg-ca-active"
                        : "border-ca-border bg-transparent"
                      }`}
                  >
                    <div className="font-bold text-[13px] text-ca-text mb-1">
                      {opt.label}
                    </div>
                    <div className="text-[11.5px] text-ca-muted">
                      {opt.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {type === "donor-cap" && (
              <div className="mb-5">
                <SectionLabel>Related Blood Request</SectionLabel>
                <Sel
                  opts={[
                    "Select a request...",
                    "REQ-0038 — AB+ / 12 donors",
                    "REQ-0041 — O+ / 4 donors",
                  ]}
                  className="w-full"
                  onChange={(e) => setRelatedId(e.target.value)} />
              </div>
            )}

            {type === "cooldown" && (
              <div className="mb-5">
                <SectionLabel>Related Member / Requester</SectionLabel>
                <Sel
                  opts={[
                    "Select a member...",
                    "Amaka Okafor — in cooldown since Nov 5",
                    "Bode Lawal — in cooldown since Nov 20",
                  ]}
                  className="w-full"
                  onChange={(e) => setRelatedId(e.target.value)} />
              </div>
            )}

            <div className={type === "cooldown" ? "mb-5" : "mb-0"}>
              <SectionLabel>Reason</SectionLabel>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe the circumstances requiring this escalation (required)..."
                className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-2.5 text-ca-text text-[12.5px] outline-none focus:border-ca-accent transition-colors resize-y font-sans"
              />
            </div>

            {type === "cooldown" && (
              <div className="mb-5">
                <SectionLabel>Community Admin Recommendation</SectionLabel>
                <p className="text-[12px] text-ca-muted mb-2.5 leading-relaxed">
                  As Community Admin, your recommendation is required for early
                  cooldown reactivation requests.
                </p>
                <div className="flex gap-2 items-center bg-ca-side border border-ca-border rounded-md px-3 py-2.5">
                  <input
                    type="checkbox"
                    id="vouch-cb"
                    checked={vouched}
                    onChange={(e) => setVouched(e.target.checked)}
                    className="shrink-0"
                  />
                  <label
                    htmlFor="vouch-cb"
                    className="text-[12.5px] text-ca-text cursor-pointer leading-relaxed select-none"
                  >
                    I vouch that this early reactivation is warranted based on
                    the circumstances described above.
                  </label>
                </div>
              </div>
            )}

            <div className={`flex gap-2.5 ${type === "cooldown" ? "pt-0" : "pt-4"}`}>
              <Btn
                variant="primary"
                disabled={!canSubmit || busy}
                onClick={() => void handleSubmit()}
              >
                {busy ? "Submitting…" : "Submit for Review"}
              </Btn>
              <Btn
                variant="outline"
                onClick={() => router.push("/community-admin/escalations")}
              >
                Cancel
              </Btn>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}