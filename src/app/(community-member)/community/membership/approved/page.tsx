"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";
import { apiService } from "@/services/api.service";
import type { MyProfileResponse } from "@/features/api/types";

export default function MembershipApprovedPage() {
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);

  useEffect(() => {
    void apiService.getMyProfile().then(setProfile).catch(() => {});
  }, []);

  const communityName =
    profile?.community?.community_name ?? "your community";

  return (
    <CommunityMemberShell>
      <div className="space-y-6 text-center">
        <StateIcon type="success" />
        <div>
          <h1 className="text-2xl font-extrabold">Membership approved</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
            You are now an active member of{" "}
            <span className="font-semibold text-(--color-text-primary)">
              {communityName}
            </span>{" "}
            and can create blood requests.
          </p>
        </div>

        {profile?.community?.community_admin ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">
              Your Community Admin
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
          href="/community/dashboard"
          className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </CommunityMemberShell>
  );
}