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
import { useCAJoinRequestsStore } from "@/stores/community-admin-join-requests.store";
import { COMMUNITY } from "@/components/community-admin/ui/ca-constants";
import { Modal } from "@/components/community-admin/ui/ca-modal";

export default function JoinRequestsPage() {
  const router = useRouter();

  const { items: rows, isLoading, loadItems, updateItemStatus } = useCAJoinRequestsStore();

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const [modal, setModal] = React.useState<{
    type: "approve" | "reject";
    name: string;
  } | null>(null);

  const confirmAction = () => {
    if (!modal) return;
    updateItemStatus(modal.name, modal.type === "approve" ? "Approved" : "Rejected");
    setModal(null);
  };

  return (
    <Shell title={`Join Requests (${COMMUNITY})`}>
      <FilterRow>
        <SearchInput placeholder="Search applicants..." />
        <Sel opts={["All Statuses", "Pending", "Approved", "Rejected"]} />
      </FilterRow>

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ca-side">
              <TH>Applicant</TH>
              <TH>Contact</TH>
              <TH>Request Date</TH>
              <TH>Method</TH>
              <TH>Status</TH>
              <TH w={120}></TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const urlSafeId = encodeURIComponent(r.name);
              return (
                <TableRow
                  key={r.name}
                  href={`/community-admin/join-requests/${urlSafeId}`}
                >
                  <TD>
                    <span className="font-semibold">{r.name}</span>
                  </TD>
                  <TD muted>{r.contact}</TD>
                  <TD muted>{r.date}</TD>
                  <TD muted>{r.method}</TD>
                  <TD>
                    <SBadge status={r.status} />
                  </TD>
                  <TD>
                    <div className="flex gap-1.5 items-center justify-end">
                      <Btn
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/community-admin/join-requests/${urlSafeId}`,
                          );
                        }}
                      >
                        View
                      </Btn>
                      {r.status === "Pending" && (
                        <>
                          <Btn
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModal({ type: "approve", name: r.name });
                            }}
                          >
                            Approve
                          </Btn>
                          <Btn
                            size="sm"
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModal({ type: "reject", name: r.name });
                            }}
                          >
                            Reject
                          </Btn>
                        </>
                      )}
                    </div>
                  </TD>
                </TableRow>
              );
            })}
          </tbody>
        </table>
        <Pagination showing={6} total="6 requests" />
      </Card>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <Card className="w-[340px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">
              {modal.type === "approve"
                ? "Approve Membership?"
                : "Reject Membership?"}
            </div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-[18px]">
              {modal.type === "approve"
                ? `${modal.name} will become an active member of ${COMMUNITY} and can create blood requests.`
                : `${modal.name}'s request to join ${COMMUNITY} will be rejected. They can reapply.`}
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setModal(null)}>
                Cancel
              </Btn>
              <Btn
                variant={modal.type === "approve" ? "primary" : "danger"}
                onClick={confirmAction}
              >
                {modal.type === "approve" ? "Approve" : "Reject"}
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </Shell>
  );
}
