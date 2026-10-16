"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/community-admin/ui/ca-card";
import { TH, TD, TableRow } from "@/components/community-admin/ui/ca-table";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { FilterRow } from "@/components/community-admin/ui/ca-filter-row";
import { SearchInput } from "@/components/community-admin/ui/ca-search-input";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { Pagination } from "@/components/community-admin/ui/ca-pagination";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { useCAMembersStore } from "@/stores/community-admin-members.store";

export default function MembersPage() {
  const router = useRouter();

  const { items: rows, loadItems, isLoading, error } = useCAMembersStore();

  useAdminPageHeader({
    title: "Members",
    topRight: (
      <Btn
        size="sm"
        variant="primary"
        onClick={() => router.push("/community-admin/members/invite")}
      >
        + Invite Member
      </Btn>
    ),
  });

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  return (
    <>
      <FilterRow>
        <SearchInput placeholder="Search members..." />
        <Sel opts={["All Statuses", "Active", "Pending", "Suspended"]} />
      </FilterRow>

      <Card>
        {error ? (
          <p role="alert" className="p-4 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        {isLoading && rows.length === 0 ? (
          <p className="p-4 text-sm text-ca-muted">Loading members…</p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-ca-side">
                <TH>Member</TH>
                <TH>Contact</TH>
                <TH>Status</TH>
                <TH>Date Joined</TH>
                <TH>Request Activity</TH>
                <TH w={70}></TH>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const urlSafeId = encodeURIComponent(r.id);
                return (
                  <TableRow
                    key={r.id}
                    href={`/community-admin/members/${urlSafeId}`}
                  >
                    <TD>
                      <span className="font-semibold">{r.name}</span>
                    </TD>
                    <TD muted>{r.contact}</TD>
                    <TD>
                      <SBadge status={r.status} />
                    </TD>
                    <TD muted>{r.joined}</TD>
                    <TD muted>{r.activity}</TD>
                    <TD>
                      <Btn
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/community-admin/members/${urlSafeId}`,
                          );
                        }}
                      >
                        View
                      </Btn>
                    </TD>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination showing={rows.length} total={`${rows.length} members`} />
      </Card>
    </>
  );
}