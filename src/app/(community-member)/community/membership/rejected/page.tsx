"use client";

import Link from "next/link";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";

export default function MembershipRejectedPage() {
  return (
    <CommunityMemberShell>
      <div className="space-y-6 text-center">
        <StateIcon type="error" />
        <div>
          <h1 className="text-2xl font-extrabold">Membership not approved</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
            Your request to join Al-Hikmah Community was not approved. Contact the Community Admin if you need clarification.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-5 text-sm font-semibold"
        >
          Back
        </Link>
      </div>
    </CommunityMemberShell>
  );
}
