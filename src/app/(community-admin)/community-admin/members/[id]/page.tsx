"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card, Crumb, InfoRow, SectionLabel, SBadge, Btn, COMMUNITY, Modal, TD, TH } from '@/components/community-admin/ui';

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [removed, setRemoved] = useState(false);
  
  const memberName = decodeURIComponent(id) || 'Amaka Okafor';
  const initials = memberName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Shell 
      title={memberName}
      topRight={<Btn size="sm" variant="outline" onClick={() => router.push('/community-admin/members')}>Back</Btn>}
    >
      <Crumb path={[['Members', '/community-admin/members'], [memberName, '']]} />

      {removed && (
        <div className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-3.5 flex justify-between items-center">
          <span className="text-[12.5px] text-red-400 font-semibold">{memberName} has been removed from {COMMUNITY}.</span>
          <Btn size="sm" variant="ghost" onClick={() => router.push('/community-admin/members')}>Back to members</Btn>
        </div>
      )}

      <div className="grid grid-cols-[220px_1fr] gap-3.5">
        {/* Profile card */}
        <div className="flex flex-col gap-3">
          <Card className="p-4">
            <div className="flex flex-col items-center pb-3.5 border-b border-ca-border mb-3.5">
              <div className="w-[46px] h-[46px] rounded-full bg-[#0D2826] flex items-center justify-center text-[17px] font-extrabold text-ca-accent mb-2.5">{initials}</div>
              <div className="font-bold text-[14px] text-ca-text text-center">{memberName}</div>
              <div className="mt-1.5"><SBadge status="Member" /></div>
            </div>
            <InfoRow label="Phone"    value="+234 803 000 0001" />
            <InfoRow label="Community" value={COMMUNITY} />
            <InfoRow label="Status"   value={<SBadge status="Active" />} />
            <InfoRow label="Joined"   value="Jan 10, 2024" />
          </Card>
          <Card className="p-4">
            <SectionLabel>Admin Actions</SectionLabel>
            <Btn variant="danger" className="w-full mt-1.5" onClick={() => setModal(true)}>Remove from Community</Btn>
          </Card>
        </div>

        {/* Activity */}
        <div className="flex flex-col gap-3.5">
          <Card className="p-4">
            <SectionLabel>Request Activity</SectionLabel>
            <div className="grid grid-cols-3 gap-2.5 mb-1">
              {[{ l: 'Requests Made', v: '7' }, { l: 'Fulfilled', v: '6' }, { l: 'Last Active', v: '2 hrs ago' }].map((s) => (
                <div key={s.l} className="bg-ca-side rounded-lg px-3 py-2.5">
                  <div className="text-[10.5px] text-ca-muted mb-1">{s.l}</div>
                  <div className="text-[18px] font-bold text-ca-text">{s.v}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="px-4 py-[11px] border-b border-ca-border">
              <span className="font-bold text-[13px] text-ca-text">Recent Requests</span>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-ca-side">
                  <TH>Request ID</TH><TH>Blood</TH><TH>Status</TH><TH>Date</TH>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'REQ-0041', blood: 'O+', status: 'Open',      date: 'Dec 12' },
                  { id: 'REQ-0035', blood: 'O+', status: 'Fulfilled', date: 'Oct 5'  },
                  { id: 'REQ-0022', blood: 'O+', status: 'Fulfilled', date: 'Aug 18' },
                ].map((r) => (
                  <tr key={r.id} className="cursor-pointer hover:bg-ca-border/10" onClick={() => router.push(`/community-admin/requests/${r.id}`)}>
                    <TD><span className="font-mono text-[11.5px] text-ca-accent">{r.id}</span></TD>
                    <TD><span className="font-bold text-ca-red">{r.blood}</span></TD>
                    <TD><SBadge status={r.status} /></TD>
                    <TD muted>{r.date}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Remove confirmation modal */}
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <Card className="w-[360px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">Remove Member?</div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-4">
              <strong className="text-ca-text">{memberName}</strong> will be removed from <strong className="text-ca-text">{COMMUNITY}</strong>. They will lose access to community blood requests. This action cannot be undone without a new invitation.
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
              <Btn variant="danger" onClick={() => { setModal(false); setRemoved(true); }}>Remove Member</Btn>
            </div>
          </Card>
        </Modal>
      )}
    </Shell>
  );
}
