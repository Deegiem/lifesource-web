"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import { useAuthSessionStore } from "@/stores/auth-session.store";

export default function AdminOnboardingSuccess() {
  const router = useRouter();

  // Best-effort: try to read the current user from the session store.
  // If it hasn't been loaded yet, fall back to generic text.
  const session = useAuthSessionStore((s) => s.session);
  const loadSession = useAuthSessionStore((s) => s.loadSession);

  // The community name will eventually come from the store or the accept response.
  // For now, this is a placeholder until we thread it through the invite-accept flow.
  const communityName = "your community";

  const firstName = session?.first_name || "there";

  // Lazy-load the session if we don't have it yet
  if (typeof window !== "undefined" && !session) {
    void loadSession();
  }

  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-8 sm:px-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
        {/* Two-column grid on desktop, stacked on mobile */}
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center md:max-w-6xl md:grid md:grid-cols-2 md:items-center md:gap-16 lg:gap-24 xl:gap-32">
          {/* LEFT COLUMN — success icon + heading + description */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Success icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--color-brand-primary-soft) md:h-28 md:w-28">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-brand-primary) md:h-20 md:w-20">
                <CheckCircle2
                  size={34}
                  className="text-(--color-text-inverse) md:hidden"
                />
                <CheckCircle2
                  size={42}
                  className="hidden text-(--color-text-inverse) md:block"
                />
              </div>
            </div>

            {/* Heading + description */}
            <section className="mt-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-(--color-brand-primary)">
                Community Admin
              </p>
              <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary) md:text-3xl lg:text-4xl">
                Your community is ready, {firstName}.
              </h1>
              <p className="text-base leading-normal text-(--color-text-secondary) md:text-lg">
                <span className="font-semibold text-(--color-brand-primary)">
                  {communityName}
                </span>{" "}
                is now live on LIFESOURCE.
              </p>
            </section>

            {/* Role badge */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-(--radius-xl) bg-(--color-surface-brand) px-4 py-3 md:mt-10 md:px-5 md:py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-(--radius-md) bg-(--color-brand-primary) md:h-10 md:w-10">
                <ShieldCheck
                  size={18}
                  className="text-(--color-text-inverse) md:size-5"
                />
              </div>
              <div className="text-left">
                <p className="text-xs text-(--color-text-secondary) md:text-sm">
                  Account type
                </p>
                <p className="text-sm font-bold text-(--color-brand-primary) md:text-base">
                  Community Admin
                </p>
              </div>
              <span className="ml-2 rounded-(--radius-full) bg-(--color-success-soft) px-2.5 py-1 text-xs font-semibold text-(--color-success) md:text-sm">
                Active
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN — next steps + CTA */}
          <div className="mt-10 flex w-full flex-col md:mt-0">
            <section className="w-full space-y-4 text-left md:space-y-5">
              <p className="text-xs font-semibold uppercase text-(--color-text-muted) md:text-sm">
                Your next steps
              </p>

              <NextStep
                icon={<UserPlus size={16} />}
                text="Invite members to join your community."
              />
              <NextStep
                icon={<CheckCircle2 size={16} />}
                text="Approve membership requests from the dashboard."
              />
              <NextStep
                icon={<ClipboardList size={16} />}
                text="Monitor and manage blood requests from your community."
              />
            </section>

            <div className="w-full space-y-3 pt-8 md:pt-10">
              <button
                type="button"
                onClick={() => router.push("/community-admin/dashboard")}
                className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) md:text-base"
              >
                Go to Community Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NextStep({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="mt-0.5 shrink-0 text-(--color-brand-primary) md:mt-1 [&>svg]:md:h-5 [&>svg]:md:w-5">
        {icon}
      </div>
      <p className="text-sm leading-normal text-(--color-text-secondary) md:text-base">
        {text}
      </p>
    </div>
  );
}