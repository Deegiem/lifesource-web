"use client";

import {
  Check,
  Info,
  X,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

import type { DonorAvailability } from "@/features/donor/types";

export default function DonorAvailabilityPage() {
  const router = useRouter();

  const savedAvailability =
    useDonorOnboardingStore(
      (state) => state.availability,
    );

  const setAvailability =
    useDonorOnboardingStore(
      (state) => state.setAvailability,
    );

  const [availability, setLocalAvailability] =
    useState<DonorAvailability>(
      savedAvailability,
    );

  const handleContinue = () => {
    if (!availability) return;

    setAvailability(availability);

    router.push("/donor-review");
  };

  return (
    <OnboardingLayout step={4}>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
            Are you available to donate?
          </h1>

          <p className="text-base leading-normal text-(--color-text-secondary)">
            This controls whether you receive notifications for blood requests.
          </p>
        </section>

        <section className="space-y-3">
          <AvailabilityCard
            selected={
              availability === "available"
            }
            onClick={() =>
              setLocalAvailability("available")
            }
            icon={<Check size={22} />}
            title="Available"
            description="You will receive notifications for matching blood requests"
          />

          <AvailabilityCard
            selected={
              availability === "not_available"
            }
            onClick={() =>
              setLocalAvailability("not_available")
            }
            icon={<X size={22} />}
            title="Not available"
            description="You will not receive notifications until you change this"
            muted
          />
        </section>

        <div className="flex items-start gap-2 text-xs text-(--color-text-muted)">
          <Info
            size={14}
            className="mt-0.5 shrink-0"
          />

          <span>
            You can change your availability anytime from your profile.
          </span>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!availability}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}

interface AvailabilityCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  muted?: boolean;
}

function AvailabilityCard({
  selected,
  onClick,
  icon,
  title,
  description,
  muted = false,
}: AvailabilityCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-start gap-4 rounded-(--radius-xl) border-2 p-5 text-left transition-colors",
        selected && !muted
          ? "border-(--color-success) bg-(--color-success-soft)"
          : selected && muted
            ? "border-(--color-border-strong) bg-(--color-surface-subtle)"
            : "border-(--color-border-default) bg-(--color-surface-card) hover:border-(--color-border-strong)",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-(--radius-lg)",
          selected && !muted
            ? "bg-(--color-success) text-(--color-text-inverse)"
            : selected && muted
              ? "bg-(--color-text-muted) text-(--color-text-inverse)"
              : "bg-(--color-surface-subtle) text-(--color-text-muted)",
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "font-bold text-base",
            selected && !muted
              ? "text-(--color-success)"
              : "text-(--color-text-primary)",
          ].join(" ")}
        >
          {title}
        </p>

        <p className="mt-1 text-sm leading-normal text-(--color-text-secondary)">
          {description}
        </p>
      </div>

      <div
        className={[
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected && !muted
            ? "border-(--color-success) bg-(--color-success)"
            : selected && muted
              ? "border-(--color-text-muted) bg-(--color-text-muted)"
              : "border-(--color-border-default)",
        ].join(" ")}
      >
        {selected && (
          <span className="h-2 w-2 rounded-full bg-(--color-text-inverse)" />
        )}
      </div>
    </button>
  );
}