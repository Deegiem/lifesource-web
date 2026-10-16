"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Droplet, Heart } from "lucide-react";

import { AUTH_ROUTES } from "@/features/auth/constants";

function BloodDropIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 5C24 5 11 19.2 11 29.2C11 36.9 16.8 43 24 43C31.2 43 37 36.9 37 29.2C37 19.2 24 5 24 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AuthEntryPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-(--color-surface-card) rounded-xl">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        {/* Two-column on desktop, single column on mobile */}
        <div className="flex flex-1 flex-col md:grid md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16 lg:gap-24 xl:gap-32">
          {/* LEFT — Branding + headline */}
          <div className="flex flex-col">
            <section className="flex flex-col items-center pt-4 text-center sm:pt-8 md:items-start md:pt-0 md:text-left">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-(--color-brand-primary) shadow-lg sm:size-[88px] md:size-16 md:rounded-2xl">
                <BloodDropIcon className="size-10 text-white sm:size-11 md:size-8" />
              </div>

              <div className="mt-5 font-(--font-heading) text-2xl font-extrabold tracking-tight text-(--color-brand-primary) sm:text-3xl md:text-2xl">
                LIFESOURCE
              </div>

              <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-(--color-text-secondary) sm:text-base md:max-w-sm md:text-sm">
                Connecting verified blood requests with willing donors across
                Nigeria.
              </p>
            </section>

            <section className="mb-8 mt-8 text-center sm:mt-10 md:mb-0 md:mt-8 md:text-left">
              <h1 className="font-(--font-heading) text-3xl font-extrabold leading-tight tracking-tight text-(--color-text-primary) sm:text-4xl md:text-5xl xl:text-6xl">
                Give blood.
                <br />
                <span className="text-(--color-blood-red)">
                  Save a life.
                </span>
              </h1>
            </section>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex w-full flex-col">
            <section className="w-full space-y-3 md:space-y-4">
              {/* Donate */}
              <button
                type="button"
                onClick={() => router.push("/donor-welcome")}
                className="group flex w-full items-center gap-4 rounded-2xl bg-(--color-brand-primary) p-4 text-left text-white transition-colors hover:bg-(--color-brand-primary-hover) sm:p-5 md:gap-5 md:p-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Heart className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold md:whitespace-nowrap">
                    I want to donate blood
                  </p>
                  <p className="mt-0.5 text-sm text-white/70 md:whitespace-nowrap">
                    Register as a donor — open to everyone
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </button>

              {/* Need blood */}
              <button
                type="button"
                onClick={() => router.push("/need-blood-info")}
                className="group flex w-full items-center gap-4 rounded-2xl border-2 border-(--color-blood-border)/25 bg-(--color-blood-soft) p-4 text-left transition-colors hover:border-(--color-blood-border)/45 sm:p-5 md:gap-5 md:p-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-(--color-blood)">
                  <Droplet className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-(--color-text-primary) md:whitespace-nowrap">
                    I need blood
                  </p>
                  <p className="mt-0.5 text-sm text-(--color-text-secondary) md:whitespace-nowrap">
                    Requires an approved community invite
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 -translate-x-1 text-(--color-blood) opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </button>

              {/* Community admin — small, secondary */}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-(--color-border-default) p-4 text-left transition-colors hover:border-(--color-brand-primary)/40 hover:bg-(--color-surface-subtle)"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-brand-primary-soft) text-(--color-brand-primary)">
                  <Building2 className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-(--color-text-primary)">
                    Community admin
                  </p>
                  <p className="text-xs text-(--color-text-secondary)">
                    Sign in to manage your community
                  </p>
                </div>
                <ArrowRight
                  size={15}
                  className="shrink-0 text-(--color-text-muted)"
                />
              </button>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 text-center md:pt-12">
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.LOGIN)}
            className="text-sm font-semibold text-(--color-brand-primary) hover:underline"
          >
            Already have an account?{" "}
            <span className="text-(--color-blood)">Log in</span>
          </button>
        </footer>
      </div>
    </main>
  );
}