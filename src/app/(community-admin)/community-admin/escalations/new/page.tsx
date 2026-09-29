"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card } from "@/components/community-admin/ui/ca-card";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { COMMUNITY } from "@/components/community-admin/ui/ca-constants";
import { SectionLabel } from "@/components/community-admin/ui/ca-section-label";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { SBadge } from "@/components/community-admin/ui/ca-badge";

export default function SubmitEscalationPage() {
  const router = useRouter();
  const [type, setType] = useState<'donor-cap' | 'cooldown'>('donor-cap');
  const [step, setStep] = useState<'form' | 'submitted' | 'error'>('form');

  return (
    <Shell
      title="Submit Escalation"
      topRight={<Btn size="sm" variant="outline" onClick={() => router.push('/community-admin/escalations')}>Cancel</Btn>}
    >
      <div className="max-w-[560px]">

        {step === 'submitted' && (
          <div className="bg-ca-green-bg border border-green-400/30 rounded-lg py-3.5 px-4 mb-[18px] flex gap-3 items-start">
            <span className="text-green-400 text-[20px] shrink-0 leading-none">✓</span>
            <div>
              <div className="font-bold text-green-400 mb-1 leading-tight">Escalation Submitted</div>
              <div className="text-[12.5px] text-ca-muted leading-relaxed">
                Your escalation is now pending Super Admin review. You will be notified of the decision.
              </div>
              <div className="mt-3 flex gap-2">
                <Btn size="sm" variant="outline" onClick={() => router.push('/community-admin/escalations')}>View Escalations</Btn>
                <Btn size="sm" variant="ghost" onClick={() => setStep('form')}>Submit Another</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-4">
            <div className="font-bold text-red-400 mb-0.5 leading-tight">Submission Failed</div>
            <div className="text-[12px] text-ca-muted">Check your details and try again.</div>
          </div>
        )}

        {step !== 'submitted' && (
          <Card className="p-[22px]">
            {/* Type */}
            <div className="mb-5">
              <SectionLabel>Escalation Type</SectionLabel>
              <div className="flex flex-col gap-2">
                {([
                  { value: 'donor-cap', label: 'More than 10 donors', desc: 'Request requires more than the platform maximum of 10 donors.' },
                  { value: 'cooldown', label: 'Early cooldown reactivation', desc: 'Requester is still within cooldown but has an urgent need.' },
                ] as const).map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`px-3.5 py-3 rounded-lg border-2 cursor-pointer transition-colors ${type === opt.value ? 'border-ca-accent bg-ca-active' : 'border-ca-border bg-transparent'
                      }`}
                  >
                    <div className="font-bold text-[13px] text-ca-text mb-1">{opt.label}</div>
                    <div className="text-[11.5px] text-ca-muted">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related request */}
            {type === 'donor-cap' && (
              <div className="mb-5">
                <SectionLabel>Related Blood Request</SectionLabel>
                <div className="bg-ca-side border border-ca-border rounded-lg px-3.5 py-3 mb-2.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[12px] text-ca-accent">REQ-0038</span>
                    <SBadge status="Open" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[{ l: 'Blood Type', v: 'AB+' }, { l: 'Donors Needed', v: '12' }, { l: 'Confirmed', v: '0' }, { l: 'Hospital', v: 'AKTH' }].map((f) => (
                      <div key={f.l}>
                        <span className="text-[11px] text-ca-muted mr-1">{f.l}:</span>
                        <span className="text-[12px] text-ca-text font-semibold">{f.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Sel opts={['Select a request...', 'REQ-0038 — AB+ / 12 donors', 'REQ-0041 — O+ / 4 donors']} className="w-full" />
              </div>
            )}

            {type === 'cooldown' && (
              <div className="mb-5">
                <SectionLabel>Related Member / Requester</SectionLabel>
                <div className="bg-ca-side border border-ca-border rounded-lg px-3.5 py-3 mb-2.5">
                  <div className="font-semibold text-ca-text mb-1">Amaka Okafor</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[{ l: 'Status', v: 'In cooldown' }, { l: 'Cooldown started', v: 'Nov 5, 2024' }, { l: 'Cooldown ends', v: 'Dec 5, 2024' }, { l: 'Community', v: COMMUNITY }].map((f) => (
                      <div key={f.l}>
                        <span className="text-[11px] text-ca-muted mr-1">{f.l}:</span>
                        <span className="text-[12px] text-ca-text font-semibold">{f.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Sel opts={['Select a member...', 'Amaka Okafor — in cooldown since Nov 5', 'Bode Lawal — in cooldown since Nov 20']} className="w-full" />
              </div>
            )}

            {/*Reason */}
            <div className={type === 'cooldown' ? 'mb-5' : 'mb-0'}>
              <SectionLabel>Reason</SectionLabel>
              <textarea
                rows={4}
                placeholder="Describe the circumstances requiring this escalation (required)..."
                className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-2.5 text-ca-text text-[12.5px] outline-none focus:border-ca-accent transition-colors resize-y font-sans"
              />
            </div>

            {/* Recommendation */}
            {type === 'cooldown' && (
              <div className="mb-5">
                <SectionLabel>Community Admin Recommendation</SectionLabel>
                <p className="text-[12px] text-ca-muted mb-2.5 leading-relaxed">
                  As Community Admin, your recommendation is required for early cooldown reactivation requests.
                </p>
                <div className="flex gap-2 items-center bg-ca-side border border-ca-border rounded-md px-3 py-2.5">
                  <input type="checkbox" id="vouch-cb" className="shrink-0" />
                  <label htmlFor="vouch-cb" className="text-[12.5px] text-ca-text cursor-pointer leading-relaxed select-none">
                    I, Emeka Adeyemi, vouch that this early reactivation is warranted based on the circumstances described above.
                  </label>
                </div>
              </div>
            )}


            <div className={`flex gap-2.5 ${type === 'cooldown' ? 'pt-0' : 'pt-4'}`}>
              <Btn variant="primary" onClick={() => setStep('submitted')}>Submit for Review</Btn>
              <Btn variant="outline" onClick={() => router.push('/community-admin/escalations')}>Cancel</Btn>
            </div>
          </Card>
        )}
      </div>
    </Shell>
  );
}
