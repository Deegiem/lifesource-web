"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card } from "@/components/community-admin/ui/ca-card";
import { FilterRow } from "@/components/community-admin/ui/ca-filter-row";
import { SearchInput } from "@/components/community-admin/ui/ca-search-input";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { TH, TD, TableRow } from "@/components/community-admin/ui/ca-table";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { useCAEscalationsStore } from "@/stores/community-admin-escalations.store";
import { COMMUNITY } from "@/components/community-admin/ui/ca-constants";
import { EmptyState } from "@/components/community-admin/ui/ca-empty-state";

export default function EscalationsPage() {
  const router = useRouter();

  const { items: rows, isLoading, loadItems } = useCAEscalationsStore();

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <Shell 
      title={`Escalations (${COMMUNITY})`}
      topRight={<Btn size="sm" variant="primary" onClick={() => router.push('/community-admin/escalations/new')}>Submit Escalation</Btn>}
    >
      <FilterRow>
        <SearchInput placeholder="Search escalations..." />
        <Sel opts={['All Types', 'More than 10 donors', 'Early cooldown reactivation']} />
        <Sel opts={['All Statuses', 'Draft', 'Pending Review', 'Approved', 'Rejected']} />
      </FilterRow>
      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ca-side">
              <TH>Reference</TH>
              <TH>Related</TH>
              <TH>Escalation Type</TH>
              <TH>Reason</TH>
              <TH>Date</TH>
              <TH>Status</TH>
              <TH w={60}></TH>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((r) => (
              <TableRow key={r.ref} href={`/community-admin/escalations/${r.ref}`}>
                <TD><span className="font-mono text-[11.5px] text-ca-accent">{r.ref}</span></TD>
                <TD><span className="font-mono text-[11.5px] text-ca-text">{r.related}</span></TD>
                <TD>
                  <span className="bg-ca-amber-bg text-amber-500 text-[10px] font-bold px-2 py-[2px] rounded-full">
                    {r.type}
                  </span>
                </TD>
                <TD muted>
                  <span className="text-[11.5px]">
                    {r.reason.length > 45 ? r.reason.slice(0, 45) + '…' : r.reason}
                  </span>
                </TD>
                <TD muted>{r.date}</TD>
                <TD><SBadge status={r.status} /></TD>
                <TD><Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); router.push(`/community-admin/escalations/${r.ref}`); }}>View</Btn></TD>
              </TableRow>
            )) : (
              <tr><td colSpan={7}><EmptyState message="No escalations submitted." /></td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}
