"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card } from "@/components/community-admin/ui/ca-card";
import { TH, TD, TableRow } from "@/components/community-admin/ui/ca-table";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { COMMUNITY } from "@/components/community-admin/ui/ca-constants";
import { Modal } from "@/components/community-admin/ui/ca-modal";

export default function DashboardPage() {
  const router = useRouter();

  const activeRequests = [
    { id: 'REQ-0041', requester: 'Amaka Okafor', blood: 'O+', needed: 4, conf: 3, hospital: 'Lagos Island Gen.', status: 'Open' },
    { id: 'REQ-0039', requester: 'Bode Lawal', blood: 'A+', needed: 2, conf: 1, hospital: 'LUTH', status: 'Open' },
    { id: 'REQ-0037', requester: 'Chioma Eze', blood: 'B−', needed: 3, conf: 3, hospital: 'Garki Hospital', status: 'Fulfilled' },
  ];

  const [pendingJoinRequests, setPendingJoinRequests] = React.useState([
    { name: 'Danladi Usman', contact: '+234 803 001 0001', date: 'Dec 12' },
    { name: 'Ngozi Okonkwo', contact: '+234 806 001 0002', date: 'Dec 11' },
    { name: 'Musa Garba', contact: '+234 812 001 0003', date: 'Dec 10' },
    { name: 'Fatima Abdullahi', contact: '+234 801 001 0004', date: 'Dec 9' },
  ]);

  const [modal, setModal] = React.useState<{type: 'approve' | 'reject', name: string} | null>(null);

  const confirmAction = () => {
    if (!modal) return;
    setPendingJoinRequests(prev => prev.filter(req => req.name !== modal.name));
    setModal(null);
  };

  const recentActivity = [
    { action: 'Join request approved', actor: 'Emeka Adeyemi (You)', time: '30 min ago' },
    { action: 'Member invited', actor: 'Emeka Adeyemi (You)', time: '2 hrs ago' },
    { action: 'Blood request fulfilled', actor: 'System', time: '3 hrs ago' },
    { action: 'Escalation submitted', actor: 'Emeka Adeyemi (You)', time: '1 day ago' },
  ];

  return (
    <Shell title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-[18px]">
        {[
          { label: 'Active Members', value: '218', sub: COMMUNITY },
          { label: 'Pending Join Requests', value: '4', sub: 'awaiting review' },
          { label: 'Active Requests', value: '2', sub: 'open right now' },
          { label: 'Pending Escalations', value: '1', sub: 'awaiting Super Admin' },
        ].map((s) => (
          <Card key={s.label} className="p-3.5 px-4">
            <div className="text-[10.5px] font-bold text-ca-muted uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-[26px] font-extrabold text-ca-text tracking-tight leading-none">{s.value}</div>
            <div className="text-[11px] text-ca-muted mt-1.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-3.5 mb-3.5">
        <Card>
          <div className="px-4 py-2.5 border-b border-ca-border flex justify-between items-center">
            <span className="font-bold text-[13px] text-ca-text">Active Requests</span>
            <Btn size="sm" onClick={() => router.push('/community-admin/requests')}>View all</Btn>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-ca-side">
                <TH>ID</TH><TH>Requester</TH><TH>Blood</TH><TH>Confirmed</TH><TH>Hospital</TH><TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {activeRequests.map((r) => (
                <TableRow key={r.id} href={`/community-admin/requests/${r.id}`}>
                  <TD><span className="font-mono text-[11.5px] text-ca-accent">{r.id}</span></TD>
                  <TD><span className="font-semibold">{r.requester}</span></TD>
                  <TD><span className="font-bold text-ca-red">{r.blood}</span></TD>
                  <TD><span className={r.conf >= r.needed ? "text-green-400" : "text-ca-text"}>{r.conf}/{r.needed}</span></TD>
                  <TD muted>{r.hospital}</TD>
                  <TD><SBadge status={r.status} /></TD>
                </TableRow>
              ))}
            </tbody>
          </table>
        </Card>


        <Card>
          <div className="px-4 py-2.5 border-b border-ca-border flex justify-between items-center">
            <span className="font-bold text-[13px] text-ca-text">Join Requests</span>
            <Btn size="sm" onClick={() => router.push('/community-admin/join-requests')}>Review</Btn>
          </div>
          {pendingJoinRequests.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12.5px] text-ca-muted">No pending requests</div>
          ) : (
            pendingJoinRequests.map((j, i) => {
              const urlSafeId = encodeURIComponent(j.name);
              return (
                <div
                  key={j.name}
                  className={`px-4 py-2.5 flex justify-between items-center cursor-pointer hover:bg-ca-border/10 ${i < pendingJoinRequests.length - 1 ? 'border-b border-ca-border/20' : ''}`}
                  onClick={() => router.push(`/community-admin/join-requests/${urlSafeId}`)}
                >
                  <div>
                    <div className="text-[12.5px] font-semibold text-ca-text">{j.name}</div>
                    <div className="text-[11px] text-ca-muted mt-0.5">{j.contact}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10.5px] text-ca-dim mr-1">{j.date}</div>
                    <Btn size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setModal({ type: 'approve', name: j.name }); }}>Approve</Btn>
                    <Btn size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setModal({ type: 'reject', name: j.name }); }}>Reject</Btn>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <div className="px-4 py-2.5 border-b border-ca-border">
          <span className="font-bold text-[13px] text-ca-text">Recent Activity · {COMMUNITY}</span>
        </div>
        <div className="grid grid-cols-2">
          {recentActivity.map((a, i) => (
            <div
              key={i}
              className={`px-4 py-2.5 ${i < 2 ? 'border-b border-ca-border/20' : ''} ${i % 2 === 0 ? 'border-r border-ca-border/20' : ''}`}
            >
              <div className="text-[12.5px] font-medium text-ca-text">{a.action}</div>
              <div className="text-[11px] text-ca-muted mt-0.5">{a.actor} · {a.time}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick links */}
      <div className="flex gap-2 mt-3.5 flex-wrap">
        {[
          ['Invite Member', '/community-admin/members/invite'],
          ['Join Requests (4 pending)', '/community-admin/join-requests'],
          ['Submit Escalation', '/community-admin/escalations/new'],
          ['Audit Log', '/community-admin/audit-log'],
        ].map(([label, href]) => (
          <Btn key={href} size="sm" variant="outline" onClick={() => router.push(href)}>{label}</Btn>
        ))}
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <Card className="w-[340px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">
              {modal.type === 'approve' ? 'Approve Membership?' : 'Reject Membership?'}
            </div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-[18px]">
              {modal.type === 'approve'
                ? `${modal.name} will become an active member of ${COMMUNITY} and can create blood requests.`
                : `${modal.name}'s request to join ${COMMUNITY} will be rejected. They can reapply.`}
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn 
                variant={modal.type === 'approve' ? 'primary' : 'danger'} 
                onClick={confirmAction}
              >
                {modal.type === 'approve' ? 'Approve' : 'Reject'}
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </Shell>
  );
}
