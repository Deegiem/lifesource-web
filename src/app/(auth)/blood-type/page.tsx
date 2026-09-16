"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { BLOOD_TYPES } from "@/features/donor/constants";
import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { TrustNote } from "@/components/donor-onboarding/trust-note";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

export default function BloodTypePage() {
  const router = useRouter();

  const {
    bloodType: savedBloodType,
    setBloodType,
  } = useDonorOnboardingStore();

  const [bloodType, setLocalBloodType] =
    useState(savedBloodType);

  const [showHelp, setShowHelp] =
    useState(false);

  const handleContinue = () => {
    if (!bloodType) return;

    setBloodType(bloodType);
    router.push("/location-permission");
  };

  return (
    <OnboardingLayout step={2}>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
            What is your blood type?
          </h1>

          <p className="text-base leading-normal text-(--color-text-secondary)">
            We use this to match you with compatible blood requests.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BLOOD_TYPES.map((type) => {
            const selected = bloodType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setLocalBloodType(type)
                }
                className={[
                  "h-20 rounded-(--radius-xl) border text-xl font-extrabold transition-colors",
                  selected
                    ? "border-(--color-blood) bg-(--color-blood-soft) text-(--color-blood)"
                    : "border-(--color-border-default) bg-(--color-surface-card) text-(--color-text-primary) hover:border-(--color-border-strong)",
                ].join(" ")}
              >
                {type}
              </button>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default)">
          <button
            type="button"
            onClick={() =>
              setShowHelp((current) => !current)
            }
            className="flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <span className="text-sm font-semibold text-(--color-brand-primary)">
              I don't know my blood type
            </span>

            <ChevronRight
              size={17}
              className={[
                "text-(--color-text-muted) transition-transform",
                showHelp ? "rotate-90" : "",
              ].join(" ")}
            />
          </button>

          {showHelp && (
            <div className="border-t border-(--color-border-subtle) px-4 py-4">
              <div className="space-y-3 text-sm text-(--color-text-secondary)">
                <p>
                  You can find your blood type on:
                </p>

                <ul className="list-disc space-y-1 pl-5 text-xs">
                  <li>
                    A previous blood test or hospital result
                  </li>
                  <li>
                    Your National ID, driver's licence, or health card
                  </li>
                  <li>
                    A blood group test at any hospital or clinic
                  </li>
                </ul>

                <p className="text-xs text-(--color-text-muted)">
                  You can update your blood type later from your profile.
                </p>
              </div>
            </div>
          )}
        </section>

        <TrustNote>
          Your blood type is only shared when a compatible request needs your help.
        </TrustNote>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!bloodType}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}