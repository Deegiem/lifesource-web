"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CommunityMemberShell } from "@/components/community-member/shell";
import { useCommunityMemberStore } from "@/stores/community-member.store";

function CommunityCreateAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const { invitation, validateInvitation, submitMembership, isLoading, error } = useCommunityMemberStore();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => { if (token) void validateInvitation(token); }, [token, validateInvitation]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !invitation || phone.trim().length < 7 || password.length < 8) {
      setLocalError("Enter a valid phone number and a password of at least 8 characters.");
      return;
    }
    setLocalError("");
    await submitMembership(invitation.firstName, token, password, phone.trim());
    if (!useCommunityMemberStore.getState().error) router.push("/community/membership/pending");
  };

  return (
    <CommunityMemberShell title="Accept community invitation">
      <div className="space-y-6">
        <div><p className="text-sm font-semibold text-(--color-brand-primary)">Accept invitation</p><h1 className="mt-2 text-2xl font-extrabold">Complete your account</h1><p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">Join {invitation?.communityName ?? "the invited community"}.</p></div>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 md:p-6">
          <label className="block text-sm font-semibold">Full name<input value={invitation ? `${invitation.firstName} ${invitation.lastName}` : ""} readOnly className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-subtle) px-4 text-sm font-normal" /></label>
          <label className="block text-sm font-semibold">Email address<input type="email" value={invitation?.email ?? ""} readOnly className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-(--color-surface-subtle) px-4 text-sm font-normal" /></label>
          <label className="block text-sm font-semibold">Phone number<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required minLength={7} maxLength={32} className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-sm font-normal" /></label>
          <label className="block text-sm font-semibold">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} maxLength={128} className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-sm font-normal" /></label>
          {(localError || error) ? <p role="alert" className="text-sm text-(--color-danger)">{localError || error}</p> : null}
          <button type="submit" disabled={isLoading || !invitation || !token} className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-(--color-text-inverse) disabled:opacity-60">{isLoading ? "Accepting invitation…" : "Accept invitation"}</button>
          <Link href={`/community/invite?token=${encodeURIComponent(token)}`} className="block text-center text-sm font-semibold text-(--color-text-secondary)">Back</Link>
        </form>
      </div>
    </CommunityMemberShell>
  );
}

function CreateAccountFallback() {
  return <CommunityMemberShell title="Accept community invitation"><div className="h-48 animate-pulse rounded-(--radius-xl) bg-(--color-surface-subtle)" /></CommunityMemberShell>;
}

export default function CommunityCreateAccountPage() {
  return <Suspense fallback={<CreateAccountFallback />}><CommunityCreateAccountContent /></Suspense>;
}