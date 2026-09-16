"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Mail, Users } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

const steps = [
  { icon: Users, title: "Join a community", description: "Ask your hospital, church, workplace, or NGO if they have a LIFESOURCE community." },
  { icon: Mail, title: "Get an invite", description: "Your community admin will send you an invitation link to join." },
  { icon: Check, title: "Create a request", description: "Once your membership is active, you can create and manage blood requests." },
];

export default function NeedBloodInfoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        <header>
          <button type="button" onClick={() => router.push(AUTH_ROUTES.ENTRY)} aria-label="Go back"
            className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)">
            <ArrowLeft size={20} />
          </button>
        </header>

        {/* Two-column on desktop */}
        <div className="mx-auto w-full max-w-6xl flex-1 pt-6 sm:pt-10 md:pt-16">
          <div className="md:grid md:grid-cols-2 md:items-start md:gap-16 lg:gap-24">
            {/* LEFT — Intro */}
            <section>
              <div className="flex size-16 items-center justify-center rounded-2xl bg-(--color-blood-soft) md:size-20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="md:size-10">
                  <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-(--color-blood)" />
                </svg>
              </div>

              <div className="mt-6 md:mt-8">
                <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl md:text-4xl xl:text-5xl">Need blood?</h1>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-(--color-text-secondary) md:mt-3 md:text-lg">
                  Blood requests on LIFESOURCE must come from verified community members to prevent abuse and protect donors.
                </p>
              </div>
            </section>

            {/* RIGHT — Steps + trust note */}
            <div>
              <section className="mt-8 space-y-3 md:mt-0 md:space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex items-start gap-4 rounded-2xl bg-(--color-surface-subtle) p-4 sm:p-5 md:p-6">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-(--color-brand-primary) shadow-sm md:size-12">
                        <Icon size={20} strokeWidth={2} className="md:size-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-(--color-text-primary) md:text-base">{step.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-(--color-text-secondary) sm:text-sm md:mt-1 md:text-base">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </section>

              <div className="mt-6 rounded-2xl border border-(--color-border) bg-(--color-surface-card) p-4 md:mt-6 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--color-success-soft)">
                    <Check size={12} strokeWidth={3} className="text-(--color-success)" />
                  </div>
                  <p className="text-xs leading-relaxed text-(--color-text-secondary) md:text-sm">
                    Only verified community members can create blood requests.
                  </p>
                </div>
              </div>

              <footer className="pt-8 md:pt-10">
                <button type="button" onClick={() => router.push(AUTH_ROUTES.LOGIN)}
                  className="flex h-(--control-height-lg) w-full items-center justify-center rounded-2xl border-2 border-(--color-brand-primary) bg-white px-6 text-sm font-semibold text-(--color-brand-primary) transition-colors hover:bg-(--color-brand-primary-soft) focus:outline-none focus:ring-2 focus:ring-(--color-brand-primary) focus:ring-offset-2 md:text-base">
                  Log in to existing account
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}