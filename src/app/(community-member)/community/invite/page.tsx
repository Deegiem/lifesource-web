"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { CommunityMemberShell, StateIcon } from "@/components/community-member/shell";
import { useCommunityMemberStore } from "@/stores/community-member.store";

function CommunityInvitationContent() {
  const params = useSearchParams();
  const token = params.get("token") ?? "INV-ALHIKMAH-2026";
  const { invitation, invitationState, isLoading, error, validateInvitation } =
    useCommunityMemberStore();

  useEffect(() => {
    void validateInvitation(token);
  }, [token, validateInvitation]);

  return (
    <CommunityMemberShell title="Community invitation">
      <div className="space-y-6 text-center">
        {isLoading ? (
          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-8">
            <p className="text-sm text-(--color-text-secondary)">Checking invitation…</p>
          </div>
        ) : invitationState === "valid" && invitation ? (
          <>
            <StateIcon type="success" />
            <div>
              <p className="text-sm font-semibold text-(--color-brand-primary)">
                You have been invited
              </p>
              <h1 className="mt-2 text-2xl font-extrabold">Join {invitation.communityName}</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
                Create your community member account to submit the membership request.
              </p>
            </div>

            <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                Invitation details
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-(--color-text-secondary)">Community</span>
                  <span className="font-semibold">{invitation.communityName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-(--color-text-secondary)">Invited by</span>
                  <span className="font-semibold">{invitation.invitedBy}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/community/invite/create-account?token=${encodeURIComponent(token)}`}
              className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover)"
            >
              Continue
            </Link>
          </>
        ) : (
          <>
            <StateIcon type="error" />
            <div>
              <h1 className="text-2xl font-extrabold">
                {invitationState === "expired"
                  ? "Invitation expired"
                  : "Invalid invitation"}
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-(--color-text-secondary)">
                {invitationState === "expired"
                  ? "This invitation has expired. Contact your Community Admin for a new invitation."
                  : error ?? "This invitation link is not valid."}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-card) px-5 text-sm font-semibold"
            >
              Back
            </Link>
          </>
        )}
      </div>
    </CommunityMemberShell>
  );
}

function InvitationFallback() {
  return (
    <CommunityMemberShell title="Community invitation">
      <div className="space-y-6 text-center">
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-8">
          <p className="text-sm text-(--color-text-secondary)">Checking invitation…</p>
        </div>
      </div>
    </CommunityMemberShell>
  );
}

export default function CommunityInvitationPage() {
  return (
    <Suspense fallback={<InvitationFallback />}>
      <CommunityInvitationContent />
    </Suspense>
  );
}