"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { CommunityMemberShell } from "@/components/community-member/shell";
import { useCommunityMemberStore } from "@/stores/community-member.store";

function CommunityCreateAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "INV-ALHIKMAH-2026";
  const { invitation, validateInvitation, submitMembership, isLoading, error } =
    useCommunityMemberStore();
  const [name, setName] = useState("Amina Yusuf");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    void validateInvitation(token);
  }, [token, validateInvitation]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setLocalError("Enter your full name.");
      return;
    }

    setLocalError("");
    await submitMembership(name, token);
    router.push(`/community/invite/verify?token=${encodeURIComponent(token)}`);
  };

  return (
    <CommunityMemberShell title="Create member account">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-(--color-brand-primary)">
            Step 1 of 2
          </p>
          <h1 className="mt-2 text-2xl font-extrabold">Create your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            You are joining {invitation?.communityName ?? "your community"} as a community member.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 md:p-6"
        >
          <div>
            <label className="text-sm font-semibold">Full name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-sm outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email address</label>
            <input
              value="amina@example.com"
              readOnly
              className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-subtle) px-4 text-sm text-(--color-text-secondary)"
            />
            <p className="mt-2 text-xs text-(--color-text-muted)">
              This placeholder represents the verified email from the authentication flow.
            </p>
          </div>

          {(localError || error) && (
            <p className="text-sm text-(--color-danger)">{localError || error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-(--color-text-inverse) disabled:opacity-60"
          >
            {isLoading ? "Submitting…" : "Continue"}
          </button>

          <Link
            href={`/community/invite?token=${encodeURIComponent(token)}`}
            className="block text-center text-sm font-semibold text-(--color-text-secondary)"
          >
            Back
          </Link>
        </form>
      </div>
    </CommunityMemberShell>
  );
}

function CreateAccountFallback() {
  return (
    <CommunityMemberShell title="Create member account">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-(--color-brand-primary)">
            Step 1 of 2
          </p>
          <h1 className="mt-2 text-2xl font-extrabold">Create your account</h1>
        </div>
        <div className="h-(--control-height-lg) w-full animate-pulse rounded-(--radius-lg) bg-(--color-surface-subtle)" />
      </div>
    </CommunityMemberShell>
  );
}

export default function CommunityCreateAccountPage() {
  return (
    <Suspense fallback={<CreateAccountFallback />}>
      <CommunityCreateAccountContent />
    </Suspense>
  );
}