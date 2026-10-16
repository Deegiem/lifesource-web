"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/community-admin/ui/ca-card";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import { useCAJoinRequestsStore } from "@/stores/community-admin-join-requests.store";
import type {
  CommunityMeResponse,
  CommunityRequestsSummary,
} from "@/features/api/types";

export default function DashboardPage() {
  const router = useRouter();
  const [community, setCommunity] = React.useState<CommunityMeResponse | null>(null);
  const [summary, setSummary] = React.useState<CommunityRequestsSummary | null>(null);
  const [error, setError] = React.useState("");
  const [busyMember, setBusyMember] = React.useState("");

  const {
    items: pendingMembers,
    loadItems: loadPending,
    updateItemStatus,
  } = useCAJoinRequestsStore();

  useAdminPageHeader({ title: "Dashboard" });

  const load = React.useCallback(async () => {
    setError("");
    try {
      const [currentCommunity, requests] = await Promise.all([
        apiService.getMyCommunity(),
        apiService.listCommunityRequests({ limit: 1, offset: 0 }),
      ]);
      setCommunity(currentCommunity);
      setSummary(requests.summary);
      await loadPending();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load dashboard."));
    }
  }, [loadPending]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const decide = async (memberId: string, approve: boolean) => {
    setBusyMember(memberId);
    setError("");
    try {
      await updateItemStatus(memberId, approve ? "Approved" : "Rejected");
      await loadPending();
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Unable to update the membership."),
      );
    } finally {
      setBusyMember("");
    }
  };

  return (
    <>
      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-400/30 bg-ca-red-bg p-3 text-sm text-red-400"
        >
          {error}
        </div>
      ) : null}

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Community",
            value: community?.name ?? "Loading…",
            sub: community ? `${community.state_name}, ${community.lga_name}` : "",
          },
          {
            label: "Active Members",
            value: community?.member_count ?? "—",
            sub: "Confirmed members",
          },
          {
            label: "Pending Join Requests",
            value: community?.pending_count ?? pendingMembers.length,
            sub: "Awaiting review",
          },
          {
            label: "Community Status",
            value: community?.status ?? "—",
            sub: community?.type ?? "",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="text-[10.5px] font-bold text-ca-muted uppercase tracking-wider mb-2">
              {stat.label}
            </div>
            <div className="truncate text-xl font-extrabold text-ca-text">
              {stat.value}
            </div>
            <div className="mt-1 text-[11px] text-ca-muted">{stat.sub}</div>
          </Card>
        ))}
      </div>

      {/* Requests summary */}
      {summary ? (
        <>
          <h3 className="font-bold text-[13px] text-ca-text mb-3">Requests Summary</h3>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Total Requests", value: summary.total_requests },
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
        </>

      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-ca-border px-4 py-3">
            <span className="font-bold text-[13px] text-ca-text">
              Pending Join Requests
            </span>
            <Btn
              size="sm"
              onClick={() => router.push("/community-admin/join-requests")}
            >
              View all
            </Btn>
          </div>
          {pendingMembers.length ? (
            pendingMembers.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-ca-border/20 px-4 py-3 last:border-0"
              >
                <div>
                  <div className="text-[12.5px] font-semibold text-ca-text">
                    {member.name}
                  </div>
                  <div className="text-[11px] text-ca-muted">
                    {member.contact} · {member.date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Btn
                    size="sm"
                    variant="outline"
                    disabled={busyMember === member.id}
                    onClick={() => void decide(member.id, true)}
                  >
                    Approve
                  </Btn>
                  <Btn
                    size="sm"
                    variant="danger"
                    disabled={busyMember === member.id}
                    onClick={() => void decide(member.id, false)}
                  >
                    Reject
                  </Btn>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-6 text-center text-[12.5px] text-ca-muted">
              {community ? "No pending requests." : "Loading community data…"}
            </p>
          )}
        </Card>

        <Card>
          <div className="border-b border-ca-border px-4 py-3">
            <span className="font-bold text-[13px] text-ca-text">Requests</span>
          </div>
          <div className="p-4 text-sm leading-relaxed text-ca-muted">
            {summary && summary.total_requests > 0
              ? `Your community has ${summary.total_requests} request${summary.total_requests === 1 ? "" : "s"}. ${summary.open} open, ${summary.fulfilled} fulfilled.`
              : "No requests yet. Members can create blood requests from their dashboard."}
          </div>
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            <Btn
              size="sm"
              variant="outline"
              onClick={() => router.push("/community-admin/requests")}
            >
              View Requests
            </Btn>
            <Btn
              size="sm"
              variant="outline"
              onClick={() => router.push("/community-admin/members/invite")}
            >
              Invite member
            </Btn>
            <Btn
              size="sm"
              variant="outline"
              onClick={() => router.push("/community-admin/audit-log")}
            >
              Audit log
            </Btn>
          </div>
        </Card>
      </div>
    </>
  );
}