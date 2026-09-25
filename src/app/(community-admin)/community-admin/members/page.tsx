"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card, TH, TD, SBadge, Btn, COMMUNITY, FilterRow, SearchInput, Sel, Pagination, TableRow } from '@/components/community-admin/ui';

export default function MembersPage() {
  const router = useRouter();
  
  const rows = [
    { name: 'Amaka Okafor',     contact: '+234 803 000 0001', status: 'Active',    joined: 'Jan 10, 2024', activity: '1 active request' },
    { name: 'Bode Lawal',       contact: '+234 806 000 0002', status: 'Active',    joined: 'Feb 3, 2024',  activity: '1 active request' },
    { name: 'Chioma Eze',       contact: '+234 812 000 0003', status: 'Active',    joined: 'Mar 12, 2024', activity: 'No active request' },
    { name: 'Danladi Usman',    contact: '+234 801 000 0004', status: 'Suspended', joined: 'Apr 5, 2024',  activity: 'No active request' },
    { name: 'Ngozi Okonkwo',    contact: '+234 805 000 0005', status: 'Active',    joined: 'May 20, 2024', activity: 'No active request' },
    { name: 'Musa Garba',       contact: '+234 818 000 0006', status: 'Active',    joined: 'Jun 8, 2024',  activity: 'No active request' },
    { name: 'Fatima Abdullahi', contact: '+234 803 000 0007', status: 'Pending',   joined: 'Dec 1, 2024',  activity: 'No active request' },
  ];

  return (
    <Shell 
      title={`Members · ${COMMUNITY}`}
      topRight={<Btn size="sm" variant="primary" onClick={() => router.push('/community-admin/members/invite')}>+ Invite Member</Btn>}
    >
      <FilterRow>
        <SearchInput placeholder="Search members..." />
        <Sel opts={['All Statuses', 'Active', 'Pending', 'Suspended']} />
      </FilterRow>
      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ca-side">
              <TH>Member</TH><TH>Contact</TH><TH>Status</TH><TH>Date Joined</TH><TH>Request Activity</TH><TH w={70}></TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const urlSafeId = encodeURIComponent(r.name);
              return (
                <TableRow key={r.name} href={`/community-admin/members/${urlSafeId}`}>
                  <TD><span className="font-semibold">{r.name}</span></TD>
                  <TD muted>{r.contact}</TD>
                  <TD><SBadge status={r.status} /></TD>
                  <TD muted>{r.joined}</TD>
                  <TD muted>{r.activity}</TD>
                  <TD><Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); router.push(`/community-admin/members/${urlSafeId}`); }}>View</Btn></TD>
                </TableRow>
              );
            })}
          </tbody>
        </table>
        <Pagination showing={7} total="218 members" />
      </Card>
    </Shell>
  );
}
