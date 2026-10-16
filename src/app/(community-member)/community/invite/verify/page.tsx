"use client";

import Link from "next/link";
import { CommunityMemberShell } from "@/components/community-member/shell";

export default function CommunityInviteVerificationPage() {
  return (
    <CommunityMemberShell title="Invitation verification">
      <div className="space-y-4 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-6">
        <h1 className="text-xl font-extrabold">Email verification is not part of this invite flow</h1>
        <p className="text-sm leading-relaxed text-(--color-text-secondary)">Community invitations are accepted securely through the invitation token endpoint. No local or placeholder verification code is used.</p>
        <Link href="/login" className="inline-flex min-h-12 items-center rounded-lg bg-(--color-brand-primary) px-5 text-sm font-semibold text-white">Continue to login</Link>
      </div>
    </CommunityMemberShell>
  );
}
