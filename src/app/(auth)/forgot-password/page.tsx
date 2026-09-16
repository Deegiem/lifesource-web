"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button type="button" onClick={() => router.push(AUTH_ROUTES.LOGIN)} aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)">
          <ArrowLeft size={20}/>
        </button>

        <div className="flex-1 pt-6 sm:pt-10">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-(--color-brand-primary-soft)">
            <LockKeyhole size={26} className="text-(--color-brand-primary)"/>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">Reset your password</h1>
            <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary)">
              Enter your email address and we will send you a reset code.
            </p>
          </div>

          <div className="mt-7 space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-(--color-text-primary)">Email address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)" required />
          </div>

          <div className="mt-5 rounded-2xl bg-(--color-surface-subtle) p-4">
            <p className="text-xs leading-relaxed text-(--color-text-secondary)">For security, we won't confirm if an account exists for this email.</p>
          </div>
        </div>

        <footer className="pt-8">
          <button type="button" disabled={!email.trim()} onClick={() => router.push(AUTH_ROUTES.RESET_PASSWORD)}
            className="h-(--control-height-lg) w-full rounded-(--radius-2xl) bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50">
            Send reset code
          </button>
          <div className="pt-4 text-center"><button type="button" onClick={() => router.push(AUTH_ROUTES.LOGIN)} className="text-sm text-(--color-text-secondary) hover:text-(--color-brand-primary)">Back to login</button></div>
        </footer>
      </div>
    </main>
  );
}
