"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card } from "@/components/community-admin/ui/ca-card";
import { TH, TD, TableRow } from "@/components/community-admin/ui/ca-table";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { COMMUNITY } from "@/components/community-admin/ui/ca-constants";
import { useCAMembersStore } from "@/stores/community-admin-members.store";
import { FilterRow } from "@/components/community-admin/ui/ca-filter-row";
import { SearchInput } from "@/components/community-admin/ui/ca-search-input";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { Pagination } from "@/components/community-admin/ui/ca-pagination";

export default function MembersPage() {
  const router = useRouter();
  
  const { items: rows, isLoading, loadItems } = useCAMembersStore();

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

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
