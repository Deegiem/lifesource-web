"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { PageHeader, PageShell } from "@/components/community-member/ui";
import { useRequestStore } from "@/stores/request.store";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { MyProfileResponse } from "@/features/api/types";

export default function CommunityMemberDashboard() {
  const {
    requester,
    requests,
    loadRequesterContext,
    loadMyRequests,
    isLoading,
  } = useRequestStore();

  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    void apiService
      .getMyProfile()
      .then(setProfile)
      .catch((requestError: unknown) =>
        setProfileError(
          getApiErrorMessage(requestError, "Unable to load your profile."),
        ),
      );
    void loadRequesterContext();
    void loadMyRequests();
  }, [loadRequesterContext, loadMyRequests]);

  const canCreate = requester?.membershipStatus === "Active";
  const fullName = profile?.user.full_name ?? "Community member";
  const communityName = profile?.community?.community_name ?? "No community";

  return (
    <PageShell>
      <PageHeader
        eyebrow="Community Member"
        title={`Welcome back, ${fullName}`}
        description="Your community membership and request access are managed by LIFESOURCE."
      />

      {profileError ? (
        <div
          role="alert"
          className="mb-5 rounded-(--radius-lg) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)"
        >
          {profileError}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
            Membership
          </p>
          <p className="mt-2 text-lg font-bold">
            {requester?.membershipStatus ?? "Loading…"}
          </p>
        </div>
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
            Community
          </p>
          <p className="mt-2 text-lg font-bold">{communityName}</p>
        </div>
      </div>

      {canCreate ? (
        <Link
          href="/community/requests/new"
          className="mb-6 flex items-center justify-between rounded-(--radius-xl) bg-(--color-brand-primary) p-5 text-white shadow-(--shadow-md) hover:bg-(--color-brand-primary-hover)"
        >
          <div>
            <p className="text-sm font-bold">Create Blood Request</p>
            <p className="mt-1 text-xs text-white/75">
              Request eligibility is verified by the API.
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
            <Plus className="size-5" />
          </span>
        </Link>
      ) : null}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-(--color-text-secondary)">
            My Blood Requests
          </h2>
          <Link
            href="/community/requests"
            className="text-xs font-semibold text-(--color-brand-primary) hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading && requests.length === 0 ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center text-sm text-(--color-text-muted)">
            Loading requests…
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center">
            <p className="text-sm text-(--color-text-secondary)">
              You haven&apos;t created any blood requests yet.
            </p>
            {canCreate ? (
              <Link
                href="/community/requests/new"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-(--color-brand-primary) hover:underline"
              >
                Create your first request
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            {requests.slice(0, 3).map((request) => (
              <Link
                key={request.id}
                href={`/community/requests/${request.id}`}
                className="flex items-center justify-between rounded-(--radius-xl) border border-(--color-border-default) bg-white p-4 hover:border-(--color-brand-primary)"
              >
                <div>
                  <p className="font-bold">
                    {request.bloodType} blood · {request.referenceCode}
                  </p>
                  <p className="mt-1 text-xs text-(--color-text-muted)">
                    {request.confirmedDonors}/{request.donorsNeeded} confirmed ·{" "}
                    {request.status}
                  </p>
                </div>
                <span className="text-xs text-(--color-text-muted)">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}