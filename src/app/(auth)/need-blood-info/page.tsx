"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Mail, Users } from "lucide-react";

import { AUTH_ROUTES } from "@/features/auth/constants";

const steps = [
  {
    icon: Users,
    title: "Join a community",
    description:
      "Ask your hospital, church, workplace, or NGO if they have a LIFESOURCE community.",
  },
  {
    icon: Mail,
    title: "Get an invite",
    description:
      "Your community admin will send you an invitation link to join.",
  },
  {
    icon: Check,
    title: "Create a request",
    description:
      "Once your membership is active, you can create and manage blood requests.",
  },
];

export default function NeedBloodInfoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        {/* Header */}
        <header>
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.ENTRY)}
            aria-label="Go back"
            className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)"
          >
            <ArrowLeft size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 pt-6 sm:pt-10">
          {/* Intro */}
          <section>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-(--color-blood-soft)">
              <svg
                width="32"
                height="32"
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

            <div className="mt-6">
              <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">
                Need blood?
              </h1>

              <p className="mt-2 max-w-xl text-base leading-relaxed text-(--color-text-secondary)">
                Blood requests on LIFESOURCE must come from verified community
                members to prevent abuse and protect donors.
              </p>
            </div>
          </section>

          {/* Steps */}
          <section className="mt-8 space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="flex items-start gap-4 rounded-2xl bg-(--color-surface-subtle) p-4 sm:p-5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-(--color-brand-primary) shadow-sm">
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--color-text-primary)">
                      {step.title}
                    </p>

                    <p className="mt-0.5 text-xs leading-relaxed text-(--color-text-secondary) sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Trust note */}
          <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-surface-card) p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--color-success-soft)">
                <Check
                  size={12}
                  strokeWidth={3}
                  className="text-(--color-success)"
                />
              </div>

              <p className="text-xs leading-relaxed text-(--color-text-secondary)">
                Only verified community members can create blood requests.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8">
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.LOGIN)}
            className="flex h-(--control-height-lg) w-full items-center justify-center rounded-2xl border-2 border-(--color-brand-primary) bg-white px-6 text-sm font-semibold text-(--color-brand-primary) transition-colors hover:bg-(--color-brand-primary-soft) focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary) focus:ring-offset-2"
          >
            Log in to existing account
          </button>
        </footer>
      </div>
    </main>
  );
}