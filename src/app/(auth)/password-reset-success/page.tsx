"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function PasswordResetSuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-(--color-success-soft)">
            <div className="flex size-16 items-center justify-center rounded-full bg-(--color-success)">
              <Check size={34} className="text-(--color-text-inverse)" strokeWidth={2.5}/>
            </div>
          </div>
          <div className="mt-7 space-y-3">
            <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">Password updated</h1>
            <p className="max-w-md text-base leading-relaxed text-(--color-text-secondary)">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>
          <div className="mt-5 rounded-full bg-(--color-success-soft) px-3 py-1.5">
            <span className="text-xs font-semibold text-(--color-success)">Account secured</span>
          </div>
        </div>

        <footer className="pt-8">
          <button type="button" onClick={() => router.push(AUTH_ROUTES.LOGIN)}
            className="h-(--control-height-lg) w-full rounded-(--radius-2xl) bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover)">
            Log in
          </button>
        </footer>
      </div>
    </main>
  );
}
