"use client";

import Link from "next/link";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";

export default function MembershipApprovedPage() {
  return (
    <CommunityMemberShell>
      <div className="space-y-6 text-center">
        <StateIcon type="success" />
        <div>
          <h1 className="text-2xl font-extrabold">Membership approved</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
            You are now an active member of Al-Hikmah Community and can create blood requests.
          </p>
        </div>

        <Link
          href="/community/dashboard"
          className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </CommunityMemberShell>
  );
}
