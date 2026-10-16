"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";
import { apiService } from "@/services/api.service";
import type { MyProfileResponse } from "@/features/api/types";

export default function MembershipRejectedPage() {
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);

  useEffect(() => {
    void apiService.getMyProfile().then(setProfile).catch(() => {});
  }, []);

  const communityName =
    profile?.community?.community_name ?? "the community";

  return (
    <CommunityMemberShell>
      <div className="space-y-6 text-center">
        <StateIcon type="error" />
        <div>
          <h1 className="text-2xl font-extrabold">Membership not approved</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
            Your request to join{" "}
            <span className="font-semibold text-(--color-text-primary)">
              {communityName}
            </span>{" "}
            was not approved. Contact the Community Admin if you need
            clarification.
          </p>
        </div>

        {profile?.community?.community_admin ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">
              Contact
            </p>
            <p className="mt-2 font-bold">
              {profile.community.community_admin.full_name}
            </p>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {profile.community.community_admin.email}
            </p>
          </div>
        ) : null}

        <Link
          href="/"
          className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-5 text-sm font-semibold"
        >
          Back to home
        </Link>
      </div>
    </CommunityMemberShell>
  );
}