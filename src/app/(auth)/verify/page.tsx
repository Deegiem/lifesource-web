"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function VerifyPage() {
  const router = useRouter();
  const [resent, setResent] = useState(false);

  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button type="button" onClick={() => router.push(AUTH_ROUTES.SIGNUP)} aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)">
          <ArrowLeft size={20}/>
        </button>

        <div className="flex-1 pt-6 sm:pt-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-(--color-brand-primary-soft)">
            <Mail size={28} className="text-(--color-brand-primary)"/>
          </div>
          <div className="mt-7">
            <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">Check your inbox</h1>
            <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary)">
              We sent a verification link to <span className="font-semibold text-(--color-text-primary)">your email address</span>.
            </p>
          </div>

          <div className="mt-7 rounded-2xl bg-(--color-surface-subtle) p-4">
            <p className="text-sm leading-relaxed text-(--color-text-secondary)">Click the link in the email to verify your account. It will expire in 30 minutes.</p>
            <p className="mt-2 text-xs text-(--color-text-muted)">Check your spam folder if you do not see it.</p>
          </div>

          {resent && <div className="mt-4 rounded-xl border border-(--color-success) bg-(--color-success-soft) p-3"><p className="text-sm font-medium text-(--color-success)">Verification email resent successfully.</p></div>}

          <div className="mt-7 text-center">
            <button type="button" onClick={() => setResent(true)} className="text-sm font-semibold text-(--color-brand-primary) hover:underline">
              Resend verification email
            </button>
          </div>
        </div>

        <footer className="pt-8">
          <button type="button" onClick={() => router.push(AUTH_ROUTES.DONOR_PROFILE)}
            className="h-(--control-height-lg) w-full rounded-(--radius-2xl) border-2 border-(--color-brand-primary) bg-(--color-surface-card) text-sm font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-soft)">
            I have verified my email
          </button>
        </footer>
      </div>
    </main>
  );
}
