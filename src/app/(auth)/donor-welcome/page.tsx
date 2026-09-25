"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, MapPin, ShieldCheck } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function DonorWelcomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-(--color-surface-card) rounded-4xl">
      {/* Removed max-w-2xl — layout now controls width. Kept flex-col for mobile stack. */}
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={() => router.push(AUTH_ROUTES.ENTRY)}
          aria-label="Go back"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1">
          {/* Desktop: two-column. Mobile: stacked. */}
          <div className="flex flex-col md:grid md:grid-cols-2 md:items-start md:gap-16 lg:gap-24">
            {/* LEFT — Illustration + heading + description */}
            <div className="flex flex-col">
              <div className="flex justify-center py-8 md:justify-start md:pt-6">
                <div className="flex size-28 items-center justify-center rounded-full bg-(--color-blood-soft) md:size-32">
                  <div className="flex size-20 items-center justify-center rounded-full bg-(--color-blood-border) md:size-24">
                    <svg
                      viewBox="0 0 48 48"
                      className="size-12 text-(--color-blood) md:size-14"
                      fill="none"
                    >
                      <path
                        d="M24 5S11 19.2 11 29.2C11 36.9 16.8 43 24 43s13-6.1 13-13.8C37 19.2 24 5 24 5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary) sm:text-3xl md:text-4xl xl:text-5xl">
                  Become a blood donor
                </h1>
                <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary) md:mt-3 md:text-lg">
                  Register and get notified when someone nearby needs your blood type.
                </p>
              </div>
            </div>

            {/* RIGHT — Benefit cards + free-to-join note */}
            <div className="flex flex-col">
              <div className="space-y-3 pt-8 md:pt-6 md:space-y-4">
                {[
                  [Bell, "Get notified for matching blood requests near you"],
                  [MapPin, "Set your location — we never share your exact address"],
                  [ShieldCheck, "Your contact details are kept private from requesters"],
                ].map(([Icon, text]) => (
                  <div
                    key={text as string}
                    className="flex items-start gap-3 rounded-2xl bg-(--color-surface-subtle) p-4 md:gap-4 md:p-5"
                  >
                    <Icon
                      size={19}
                      className="mt-0.5 shrink-0 text-(--color-brand-primary) md:size-6"
                    />
                    <p className="text-sm font-medium leading-relaxed text-(--color-text-primary) md:text-base">
                      {text as string}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-(--color-success-soft) p-4 text-center md:mt-5 md:p-5 md:text-left">
                <p className="text-xs font-medium text-(--color-success) md:text-sm">
                  Free to join. No hidden requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — mobile: stacked CTA. Desktop: wide button spanning both columns */}
        <footer className="pt-8 md:pt-12">
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.SIGNUP)}
            className="h-(--control-height-lg) w-full rounded-(--radius-2xl) bg-(--color-brand-primary) px-6 text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover) md:text-base"
          >
            Get started
          </button>
          <div className="pt-4 text-center md:pt-5">
            <button
              type="button"
              onClick={() => router.push(AUTH_ROUTES.LOGIN)}
              className="text-sm text-(--color-text-secondary) md:text-base"
            >
              Already have an account?{" "}
              <span className="font-semibold text-(--color-brand-primary)">Log in</span>
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}