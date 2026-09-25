"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/community-admin/shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { FilterRow } from "@/components/community-admin/ui/ca-filter-row";
import { SearchInput } from "@/components/community-admin/ui/ca-search-input";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { TH, TD, TableRow } from "@/components/community-admin/ui/ca-table";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { Pagination } from "@/components/community-admin/ui/ca-pagination";
import { useCARequestsStore } from "@/stores/community-admin-requests.store";
import { COMMUNITY, HOSPITALS, BLOOD_TYPES } from "@/components/community-admin/ui/ca-constants";

export default function CommunityRequestsPage() {
  const router = useRouter();

  const { items: rows, isLoading, loadItems } = useCARequestsStore();

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <Shell title={`Community Requests (${COMMUNITY})`}>
      <FilterRow>
        <SearchInput placeholder="Search requests..." />
        <Sel
          opts={[
            "All Statuses",
            "Open",
            "Partially fulfilled",
            "Fulfilled",
            "Expired",
            "Cancelled",
          ]}
        />
        <Sel opts={["All Blood Types", ...BLOOD_TYPES]} />
        <Sel opts={["All Hospitals", ...HOSPITALS]} />
      </FilterRow>
      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ca-side">
              <TH>Request ID</TH>
              <TH>Requester</TH>
              <TH>Blood</TH>
              <TH>Need</TH>
              <TH>Confirmed</TH>
              <TH>Hospital</TH>
              <TH>Urgency</TH>
              <TH>Status</TH>
              <TH>Date</TH>
              <TH w={55}></TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <TableRow key={r.id} href={`/community-admin/requests/${r.id}`}>
                <TD>
                  <span className="font-mono text-[11.5px] text-ca-accent">
                    {r.id}
                  </span>
                </TD>
                <TD>
                  <span className="font-semibold">{r.requester}</span>
                </TD>
                <TD>
                  <span className="font-bold text-ca-red">{r.blood}</span>
                </TD>
                <TD muted>{r.needed}</TD>
                <TD>
                  <span
                    className={
                      r.conf >= r.needed ? "text-green-400" : "text-ca-text"
                    }
                  >
                    {r.conf}/{r.needed}
                  </span>
                </TD>
                <TD muted>{r.hospital}</TD>
                <TD muted>{r.urgency}</TD>
                <TD>
                  <SBadge status={r.status} />
                </TD>
                <TD muted>{r.date}</TD>
                <TD>
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/community-admin/requests/${r.id}`);
                    }}
                  >
                    View
                  </Btn>
                </TD>
              </TableRow>
            ))}
          </tbody>
        </table>
        <Pagination showing={6} total="87 requests" />
      </Card>
    </Shell>
  );
}
