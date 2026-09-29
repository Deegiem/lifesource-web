"use client";

import { useEffect } from "react";
import Link from "next/link";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";
import { useCommunityMemberStore } from "@/stores/community-member.store";

export default function MembershipPendingPage() {
  const { membership, loadMembership } = useCommunityMemberStore();

  useEffect(() => {
    void loadMembership();
  }, [loadMembership]);

  return (
    <CommunityMemberShell>
      <div className="space-y-6 text-center">
        <StateIcon type="pending" />
        <div>
          <h1 className="text-2xl font-extrabold">Membership pending</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
            Your membership request has been submitted to your Community Admin for review.
          </p>
        </div>

        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
          <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">Request</p>
          <p className="mt-2 font-bold">{membership?.id ?? "MEM-0007"}</p>
          <p className="mt-1 text-sm text-(--color-text-secondary)">
            {membership?.communityName ?? "Al-Hikmah Community"}
          </p>
        </div>

        <Link
          href="/community/membership/approved"
          className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-5 text-sm font-semibold"
        >
          Development: View approved state
        </Link>
      </div>
    </CommunityMemberShell>
  );
}
