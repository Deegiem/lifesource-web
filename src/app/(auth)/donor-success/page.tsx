"use client";

import {
  Bell,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

export default function DonorSuccessPage() {
  const router = useRouter();

  const { fullName, bloodType } = useDonorOnboardingStore();

  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <main className="min-h-screen bg-(--color-surface-card) rounded-4xl">
      <div className="mx-auto flex min-h-screen w-full flex-col px-(--page-padding-mobile) py-(--space-8) sm:px-(--page-padding-tablet) md:px-12 md:py-12 lg:px-16 lg:py-16">
        {/* Two-column grid on desktop, stacked on mobile */}
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center md:max-w-6xl md:grid md:grid-cols-2 md:items-center md:gap-16 lg:gap-24 xl:gap-32">
          {/* LEFT COLUMN — icon + heading + description + status badge */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Success icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--color-success-soft) md:h-28 md:w-28">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-success) md:h-20 md:w-20">
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
              <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary) md:text-3xl lg:text-4xl">
                You're ready to save a life, {firstName}.
              </h1>

              <p className="text-base leading-normal text-(--color-text-secondary) md:text-lg">
                We'll notify you when a blood request matches your{" "}
                <span className="font-semibold text-(--color-blood)">
                  {bloodType || "blood type"}
                </span>{" "}
                blood type and location.
              </p>
            </section>

            {/* Status badge — sits below the heading in the LEFT column */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-(--radius-xl) bg-(--color-surface-brand) px-4 py-3 md:mt-10 md:px-5 md:py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-(--radius-md) bg-(--color-brand-primary) md:h-10 md:w-10">
                <CheckCircle2
                  size={18}
                  className="text-(--color-text-inverse) md:size-5"
                />
              </div>

              <div className="text-left">
                <p className="text-xs text-(--color-text-secondary) md:text-sm">
                  Donor status
                </p>
                <p className="text-sm font-bold text-(--color-brand-primary) md:text-base">
                  Registered Donor
                </p>
              </div>

              <span className="ml-2 rounded-(--radius-full) bg-(--color-success-soft) px-2.5 py-1 text-xs font-semibold text-(--color-success) md:text-sm">
                Active
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN — what happens next + both action buttons */}
          <div className="mt-10 flex w-full flex-col md:mt-0">
            {/* What happens next */}
            <section className="w-full space-y-4 text-left md:space-y-5">
              <p className="text-xs font-semibold uppercase text-(--color-text-muted) md:text-sm">
                What happens next
              </p>

              <NextStep
                icon={<Bell size={16} />}
                text="You get notified when someone nearby needs your blood type."
              />

              <NextStep
                icon={<ShieldCheck size={16} />}
                text="Requesters never see your contact details directly."
              />

              <NextStep
                icon={<MapPin size={16} />}
                text="You can pause notifications from your profile anytime."
              />
            </section>

            {/* Actions — stacked, full width of right column */}
            <div className="w-full space-y-3 pt-8 md:pt-10">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) md:text-base"
              >
                View blood requests
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="h-(--control-height-lg) w-full rounded-(--radius-lg) text-sm font-semibold text-(--color-brand-primary) hover:bg-(--color-surface-brand) md:text-base"
              >
                Go to dashboard
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