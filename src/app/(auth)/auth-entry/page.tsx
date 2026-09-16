"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AUTH_ROUTES } from "@/features/auth/constants";

function BloodDropIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
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
    <main className="min-h-screen bg-white rounded-xl">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8 sm:px-8 sm:py-10 lg:max-w-3xl lg:px-10">
        {/* Hero */}
        <div className="flex-1">
          {/* Logo + tagline */}
          <section className="flex flex-col items-center pt-4 text-center sm:pt-8">
            <div className="mb-5 flex size-20 items-center justify-center rounded-3xl bg-(--color-brand-primary) shadow-lg sm:size-[88px]">
              <BloodDropIcon className="size-10 text-white sm:size-11" />
            </div>

            <div className="font-(--font-heading) text-2xl font-extrabold tracking-tight text-(--color-brand-primary) sm:text-3xl">
              LIFESOURCE
            </div>

            <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-(--color-text-secondary) sm:text-base">
              Connecting verified blood requests with willing donors across
              Nigeria.
            </p>
          </section>

          {/* Hero headline */}
          <section className="mb-8 mt-8 text-center sm:mt-10">
            <h1 className="font-(--font-heading) text-3xl font-extrabold leading-tight tracking-tight text-(--color-text-primary) sm:text-4xl">
              Give blood.
              <br />
              <span className="text-(--color-blood-red)">
                Save a life.
              </span>
            </h1>
          </section>

          {/* Action cards */}
          <section className="space-y-3">
            {/* Donate */}
            <button
              type="button"
              onClick={() => router.push("/donor-welcome")}
              className="flex w-full items-center gap-4 rounded-2xl bg-(--color-brand-primary) p-4 text-left text-white transition-all hover:bg-(--color-brand-primary-hover) active:scale-[0.99] sm:p-5"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <BloodDropIcon className="size-6 text-white" />
              </div>

              <div className="min-w-0">
                <p className="text-base font-bold">
                  I want to donate blood
                </p>

                <p className="mt-0.5 text-sm text-white/70">
                  Register as a donor — open to everyone
                </p>
              </div>
            </button>

            {/* Need blood */}
            <button
              type="button"
              onClick={() => router.push("/need-blood-info")}
              className="flex w-full items-center gap-4 rounded-2xl border-2 border-[#FECACA] bg-(--color-blood-soft) p-4 text-left transition-all hover:bg-[#FEE2E2] active:scale-[0.99] sm:p-5"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-(--color-blood-red)/10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 4v16M4 12h16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-(--color-blood)"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-base font-bold text-(--color-text-primary)">
                  I need blood
                </p>

                <p className="mt-0.5 text-sm text-(--color-text-secondary)">
                  Requires an approved community invite
                </p>
              </div>
            </button>
          </section>

          {/* Community trust note */}
          <div className="mt-6 rounded-2xl border border-(--color-info-border) bg-(--color-info-soft) p-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-(--color-brand-primary)"
              />

              <div>
                <p className="text-sm font-semibold text-(--color-text-primary)">
                  Why community approval?
                </p>

                <p className="mt-0.5 text-xs leading-relaxed text-(--color-text-secondary)">
                  Blood requests must come from verified community members to
                  prevent abuse and protect donors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 text-center">
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.LOGIN)}
            className="text-sm font-semibold text-(--color-brand-primary) hover:underline"
          >
            Already have an account?{" "}
            <span className="text-(--color-blood-red)">Log in</span>
          </button>
        </footer>
      </div>
    </main>
  );
}