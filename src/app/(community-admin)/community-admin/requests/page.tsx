"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { FilterRow } from "@/components/community-admin/ui/ca-filter-row";
import { SearchInput } from "@/components/community-admin/ui/ca-search-input";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { TH, TD, TableRow } from "@/components/community-admin/ui/ca-table";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { Pagination } from "@/components/community-admin/ui/ca-pagination";
import { useCARequestsStore } from "@/stores/community-admin-requests.store";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CommunityRequestsPage() {
  const router = useRouter();

  const { items: rows, loadItems, isLoading, error, summary } =
    useCARequestsStore();

  useAdminPageHeader({ title: "Community Requests" });

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  return (
    <>
      {summary && (
        <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total", value: summary.total_requests },
            { label: "Open", value: summary.open },
            { label: "Partial", value: summary.partial },
            { label: "Fulfilled", value: summary.fulfilled },
            { label: "Expired", value: summary.expired },
            { label: "Cancelled", value: summary.cancelled },
          ].map((stat) => (
            <Card key={stat.label} className="p-3">
              <div className="text-[10px] font-bold text-ca-muted uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-lg font-extrabold text-ca-text">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>
      )}

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
        <Sel opts={["All Urgencies", "Low", "Medium", "High", "Critical"]} />
      </FilterRow>

      <Card>
        {error ? (
          <p role="alert" className="p-4 text-sm text-red-400">
            {error}
          </p>
        ) : null}
        {isLoading && rows.length === 0 ? (
          <p className="p-4 text-sm text-ca-muted">Loading requests…</p>
        ) : null}
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
              <TableRow
                key={r.id}
                href={`/community-admin/requests/${r.id}`}
              >
                <TD>
                  <span className="font-mono text-[11.5px] text-ca-accent">
                    {r.referenceCode}
                  </span>
                </TD>
                <TD>
                  <span className="font-semibold">{r.requesterName}</span>
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
        <Pagination showing={rows.length} total={`${rows.length} requests`} />
      </Card>
    </>
  );
}