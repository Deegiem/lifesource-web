"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProgressBar } from "./progress-bar";

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
}

export function OnboardingHeader({
  step,
  totalSteps,
}: OnboardingHeaderProps) {
  const router = useRouter();

  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-(--control-height-md) w-(--control-height-md) items-center justify-center rounded-(--radius-lg) text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)"
          aria-label="Go back"
        >
          <ArrowLeft size={19} />
        </button>

        <p className="text-xs font-semibold text-(--color-text-muted)">
          {step} of {totalSteps}
        </p>
      </div>

      <ProgressBar
        step={step}
        totalSteps={totalSteps}
      />
    </header>
  );
}