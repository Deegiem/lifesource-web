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
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button type="button" onClick={() => router.push(AUTH_ROUTES.SIGNUP)} aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)">
          <ArrowLeft size={20}/>
        </button>

        {/* Two-column on desktop: illustration/heading left, content right */}
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-6 sm:pt-10 md:grid md:grid-cols-2 md:items-start md:gap-16 md:pt-16 lg:gap-24">
          {/* Left column */}
          <div>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-(--color-brand-primary-soft) md:size-20">
              <Mail size={28} className="text-(--color-brand-primary) md:size-9"/>
            </div>
            <div className="mt-7 md:mt-8">
              <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl md:text-4xl">Check your inbox</h1>
              <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary) md:mt-3 md:text-lg">
                We sent a verification link to <span className="font-semibold text-(--color-text-primary)">your email address</span>.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="mt-7 rounded-2xl bg-(--color-surface-subtle) p-4 md:mt-0 md:p-6">
              <p className="text-sm leading-relaxed text-(--color-text-secondary) md:text-base">Click the link in the email to verify your account. It will expire in 30 minutes.</p>
              <p className="mt-2 text-xs text-(--color-text-muted) md:text-sm">Check your spam folder if you do not see it.</p>
            </div>

            {resent && (
              <div className="mt-4 rounded-xl border border-(--color-success) bg-(--color-success-soft) p-3 md:p-4">
                <p className="text-sm font-medium text-(--color-success)">Verification email resent successfully.</p>
              </div>
            )}

            <div className="mt-7 text-center md:mt-8 md:text-left">
              <button type="button" onClick={() => setResent(true)} className="text-sm font-semibold text-(--color-brand-primary) hover:underline md:text-base">
                Resend verification email
              </button>
            </div>

            <footer className="pt-8 md:pt-10">
              <button type="button" onClick={() => router.push(AUTH_ROUTES.DONOR_PROFILE)}
                className="h-(--control-height-lg) w-full rounded-(--radius-2xl) border-2 border-(--color-brand-primary) bg-(--color-surface-card) text-sm font-semibold text-(--color-brand-primary) hover:bg-(--color-brand-primary-soft) md:text-base">
                I have verified my email
              </button>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}