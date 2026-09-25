"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/community-admin/shell";
import {
  Card,
  FilterRow,
  SearchInput,
  Sel,
  TH,
  TD,
  SBadge,
  Btn,
  Pagination,
  COMMUNITY,
  HOSPITALS,
  BLOOD_TYPES,
  TableRow,
} from "@/components/community-admin/ui";

export default function CommunityRequestsPage() {
  const router = useRouter();

  const rows = [
    {
      id: "REQ-0041",
      requester: "Amaka Okafor",
      blood: "O+",
      needed: 4,
      conf: 3,
      hospital: "Lagos Island Gen.",
      urgency: "High",
      status: "Open",
      date: "Dec 12",
    },
    {
      id: "REQ-0039",
      requester: "Bode Lawal",
      blood: "A+",
      needed: 2,
      conf: 1,
      hospital: "LUTH",
      urgency: "—",
      status: "Open",
      date: "Dec 11",
    },
    {
      id: "REQ-0037",
      requester: "Chioma Eze",
      blood: "B−",
      needed: 3,
      conf: 3,
      hospital: "Garki Hospital",
      urgency: "Medium",
      status: "Fulfilled",
      date: "Dec 9",
    },
    {
      id: "REQ-0035",
      requester: "Ngozi Okonkwo",
      blood: "O−",
      needed: 2,
      conf: 1,
      hospital: "LUTH",
      urgency: "—",
      status: "Partially fulfilled",
      date: "Dec 8",
    },
    {
      id: "REQ-0030",
      requester: "Musa Garba",
      blood: "AB+",
      needed: 1,
      conf: 1,
      hospital: "AKTH",
      urgency: "—",
      status: "Fulfilled",
      date: "Nov 28",
    },
    {
      id: "REQ-0028",
      requester: "Ibrahim Sule",
      blood: "A−",
      needed: 2,
      conf: 0,
      hospital: "Lagos Island Gen.",
      urgency: "—",
      status: "Expired",
      date: "Nov 20",
    },
  ];

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
