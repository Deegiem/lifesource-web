"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { MyProfileResponse } from "@/features/api/types";

export default function MembershipPendingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void apiService
      .getMyProfile()
      .then((result) => {
        setProfile(result);
        setLoading(false);

        // Auto-redirect if the status changed
        const status = result.community?.member_status?.toLowerCase();
        if (status === "active") {
          router.replace("/community/membership/approved");
        } else if (status === "rejected") {
          router.replace("/community/membership/rejected");
        }
      })
      .catch((requestError) => {
        setError(
          getApiErrorMessage(
            requestError,
            "Unable to check your membership status.",
          ),
        );
        setLoading(false);
      });
  }, [router]);

  const communityName = profile?.community?.community_name ?? "your community";

  return (
    <CommunityMemberShell>
      <div className="space-y-6 text-center">
        <StateIcon type="pending" />
        <div>
          <h1 className="text-2xl font-extrabold">Membership pending</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
            Your membership request has been submitted to your Community Admin
            for review.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-(--radius-xl) bg-(--color-danger-soft) p-4 text-left text-sm text-(--color-danger)"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
            <p className="text-sm text-(--color-text-muted)">Loading…</p>
          </div>
        ) : profile ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">
              Your request
            </p>
            <p className="mt-2 font-bold">{profile.user.full_name}</p>
            <p className="mt-1 text-sm text-(--color-text-secondary)">
              {communityName}
            </p>
            <p className="mt-3 text-xs text-(--color-text-muted)">
              Submitted{" "}
              {new Date(profile.user.created_at).toLocaleDateString()}
            </p>
          </div>
        ) : null}

        <p className="text-xs text-(--color-text-muted)">
          You&apos;ll be notified when your membership is reviewed.
        </p>

        <Link
          href="/community/dashboard"
          className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-5 text-sm font-semibold"
        >
          Refresh status
        </Link>
      </div>
    </CommunityMemberShell>
  );
}