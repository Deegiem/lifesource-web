"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { Crumb } from "@/components/community-admin/ui/ca-breadcrumbs";
import { InfoRow } from "@/components/community-admin/ui/ca-info-row";
import { SectionLabel } from "@/components/community-admin/ui/ca-section-label";
import { SBadge } from "@/components/community-admin/ui/ca-badge";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { Modal } from "@/components/community-admin/ui/ca-modal";
import { TH } from "@/components/community-admin/ui/ca-table";
import { useCAMembersStore } from "@/stores/community-admin-members.store";
import { apiService } from "@/services/api.service";
import type { CommunityMeResponse } from "@/features/api/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [community, setCommunity] = React.useState<CommunityMeResponse | null>(
    null,
  );

  const { selectedItem, isLoading, error, loadItem, revokeMember } =
    useCAMembersStore();

  const isValidId = UUID_RE.test(id);
  const member = selectedItem?.id === id ? selectedItem : null;
  const memberName = member?.name ?? "Member details";
  const initials = memberName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useAdminPageHeader({
    title: memberName,
    topRight: (
      <Btn
        size="sm"
        variant="outline"
        onClick={() => router.push("/community-admin/members")}
      >
        Back
      </Btn>
    ),
  });

  React.useEffect(() => {
    if (isValidId) {
      void loadItem(id);
    }
    void apiService.getMyCommunity().then(setCommunity).catch(() => {});
  }, [id, isValidId, loadItem]);

  const handleRevoke = async () => {
    setBusy(true);
    try {
      await revokeMember(id);
      setModal(false);
      setRemoved(true);
    } catch {
      /* Error surfaced by store */
    } finally {
      setBusy(false);
    }
  };

  if (!isValidId) {
    return (
      <>
        <Crumb
          path={[
            ["Members", "/community-admin/members"],
            ["Member details", ""],
          ]}
        />
        <Card className="p-6">
          <p className="text-sm text-red-400">
            This member link is invalid. Open the member from the list to view
            their details.
          </p>
          <Btn
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => router.push("/community-admin/members")}
          >
            Back to members
          </Btn>
        </Card>
      </>
    );
  }

  return (
    <>
      <Crumb
        path={[
          ["Members", "/community-admin/members"],
          [memberName, ""],
        ]}
      />

      {isLoading && !member ? (
        <Card className="p-4">Loading member details…</Card>
      ) : null}

      {error ? (
        <Card className="p-4">
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        </Card>
      ) : null}

      {removed && (
        <div className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12.5px] text-red-400 font-semibold">
            {memberName} has been removed from{" "}
            {community?.name ?? "your community"}.
          </span>
          <Btn
            size="sm"
            variant="ghost"
            onClick={() => router.push("/community-admin/members")}
          >
            Back to members
          </Btn>
        </div>
      )}

      {member ? (
        <div className="grid gap-3.5 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-3">
            <Card className="p-4">
              <div className="flex flex-col items-center pb-3.5 border-b border-ca-border mb-3.5">
                <div className="w-[46px] h-[46px] rounded-full bg-ca-active flex items-center justify-center text-[17px] font-extrabold text-ca-accent mb-2.5">
                  {initials}
                </div>
                <div className="font-bold text-[14px] text-ca-text text-center">
                  {memberName}
                </div>
                <div className="mt-1.5">
                  <SBadge status={member.status} />
                </div>
              </div>
              <InfoRow label="Email" value={member.contact} />
              <InfoRow label="Community" value={community?.name ?? "—"} />
              <InfoRow
                label="Status"
                value={<SBadge status={member.status} />}
              />
              <InfoRow label="Joined" value={member.joined} />
            </Card>

            <Card className="p-4">
              <SectionLabel>Admin Actions</SectionLabel>
              <Btn
                variant="danger"
                className="w-full mt-1.5"
                onClick={() => setModal(true)}
                disabled={busy || removed}
              >
                Remove from Community
              </Btn>
            </Card>
          </div>

          <div className="flex flex-col gap-3.5">
            <Card className="p-4">
              <SectionLabel>Request Activity</SectionLabel>
              <p className="text-sm text-ca-muted">
                Request activity is not included in the available member API
                response.
              </p>
            </Card>

            <Card>
              <div className="px-4 py-[11px] border-b border-ca-border">
                <span className="font-bold text-[13px] text-ca-text">
                  Recent Requests
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-ca-side">
                      <TH>Request ID</TH>
                      <TH>Blood</TH>
                      <TH>Status</TH>
                      <TH>Date</TH>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-sm text-ca-muted"
                      >
                        Recent requests are not included in the available API
                        response.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {modal && member && (
        <Modal onClose={() => setModal(false)}>
          <Card className="w-full max-w-[360px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">
              Remove Member?
            </div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-4">
              <strong className="text-ca-text">{memberName}</strong> will be
              removed from{" "}
              <strong className="text-ca-text">
                {community?.name ?? "your community"}
              </strong>
              . They will lose access to community blood requests. This action
              cannot be undone without a new invitation.
            </p>
            <div className="flex gap-2 justify-end">
              <Btn variant="outline" onClick={() => setModal(false)}>
                Cancel
              </Btn>
              <Btn
                variant="danger"
                onClick={() => void handleRevoke()}
                disabled={busy}
              >
                {busy ? "Removing…" : "Remove Member"}
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </>
  );
}