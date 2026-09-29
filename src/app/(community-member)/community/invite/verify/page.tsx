"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { CommunityMemberShell } from "@/components/community-member/shell";
import { useCommunityMemberStore } from "@/stores/community-member.store";

function CommunityVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "INV-ALHIKMAH-2026";
  const { submitMembership } = useCommunityMemberStore();
  const [code, setCode] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.trim() !== "123456") {
      setError("Invalid verification code. Try the placeholder code 123456.");
      return;
    }

    await submitMembership("Amina Yusuf", token);
    router.push("/community/membership/pending");
  };

  return (
    <CommunityMemberShell title="Verify account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-(--color-brand-primary)">Step 2 of 2</p>
          <h1 className="mt-2 text-2xl font-extrabold">Verify your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            Enter the verification code sent to your email.
          </p>
        </div>

        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5">
          <label className="text-sm font-semibold">Verification code</label>
          <input
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-center text-lg font-bold tracking-[0.3em] outline-none focus:border-(--color-brand-primary)"
          />
          <p className="mt-3 text-xs text-(--color-text-muted)">
            Development placeholder: <strong>123456</strong>
          </p>
          {error && <p className="mt-3 text-sm text-(--color-danger)">{error}</p>}
        </div>

        <button
          type="submit"
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-(--color-text-inverse)"
        >
          Verify account
        </button>
      </form>
    </CommunityMemberShell>
  );
}

function VerifyFallback() {
  return (
    <CommunityMemberShell title="Verify account">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-(--color-brand-primary)">Step 2 of 2</p>
          <h1 className="mt-2 text-2xl font-extrabold">Verify your account</h1>
        </div>
        <div className="h-32 w-full animate-pulse rounded-(--radius-xl) bg-(--color-surface-subtle)" />
      </div>
    </CommunityMemberShell>
  );
}

export default function CommunityVerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <CommunityVerifyContent />
    </Suspense>
  );
}