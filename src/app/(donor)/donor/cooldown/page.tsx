"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Clock3, ShieldCheck } from "lucide-react";

import { PageHeader, PageShell } from "@/components/community-member/ui";
import { useRequestStore } from "@/stores/request.store";

export default function DonorCooldownPage() {
  const { donor, loadDonorProfile, error } = useRequestStore();

  useEffect(() => {
    void loadDonorProfile();
  }, [loadDonorProfile]);

  const inCooldown = donor ? !donor.isEligible : false;
  const ready = donor && !inCooldown;

  return (
    <PageShell>
      <PageHeader
        title="Cooldown Status"
        description="Eligibility is derived by the platform from confirmed donation history and the configured cooldown period."
      />

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)"
        >
          {error}
        </p>
      ) : null}

      {/* Hero status card with red-accented ring */}
      <div
        className={`relative overflow-hidden rounded-(--radius-xl) border-2 p-6 ${
          ready
            ? "border-(--color-success)/30 bg-(--color-success-soft)"
            : inCooldown
              ? "border-(--color-blood-border)/30 bg-(--color-blood-soft)"
              : "border-(--color-border-default) bg-white"
        }`}
      >
        {/* Ambient corner accent — the "touch of red" */}
        <div
          className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl ${
            ready
              ? "bg-(--color-success)/20"
              : inCooldown
                ? "bg-(--color-blood)/25"
                : "bg-(--color-brand-primary-soft)"
          }`}
        />

        <div className="relative flex items-start gap-4">
          <div
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
              ready
                ? "bg-(--color-success) text-white"
                : inCooldown
                  ? "bg-(--color-blood) text-white"
                  : "bg-(--color-brand-primary-soft) text-(--color-brand-primary)"
            }`}
          >
            {ready ? (
              <ShieldCheck className="size-7" />
            ) : (
              <Clock3 className="size-7" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xl font-extrabold text-(--color-text-primary)">
              {donor
                ? ready
                  ? "Eligible to donate"
                  : "Currently in cooldown"
                : "Loading eligibility…"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
              {inCooldown && donor?.cooldownUntil
                ? `You'll be eligible again on ${new Date(donor.cooldownUntil).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
                : ready
                  ? "Your profile currently reports eligibility. You can accept blood requests right away."
                  : "Eligibility is checked from your donor profile."}
            </p>
          </div>
        </div>

        {/* Subtle divider — red accent line */}
        <div className="relative mt-5 h-px w-full bg-gradient-to-r from-(--color-blood)/40 via-(--color-border-subtle) to-transparent" />
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/donor/requests"
          className="inline-flex min-h-(--control-height-md) flex-1 items-center justify-center rounded-(--radius-lg) bg-(--color-brand-primary) px-4 text-sm font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover)"
        >
          Browse open requests
        </Link>
        <Link
          href="/donor/dashboard"
          className="inline-flex min-h-(--control-height-md) flex-1 items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-surface-subtle)"
        >
          Back to dashboard
        </Link>
      </div>
    </PageShell>
  );
}