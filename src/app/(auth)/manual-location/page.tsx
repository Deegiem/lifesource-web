"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  DEFAULT_LGAS,
  LGAS,
  STATES,
} from "@/features/donor/constants";

import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { SelectField } from "@/components/donor-onboarding/select-field";
import { TrustNote } from "@/components/donor-onboarding/trust-note";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

export default function ManualLocationPage() {
  const router = useRouter();

  const {
    state: savedState,
    lga: savedLga,
    setManualLocation,
  } = useDonorOnboardingStore();

  const [state, setState] =
    useState(savedState);

  const [lga, setLga] =
    useState(savedLga);

  const lgaOptions = useMemo(() => {
    if (!state) return [];

    return LGAS[state] ?? DEFAULT_LGAS;
  }, [state]);

  useEffect(() => {
    if (
      lga &&
      !lgaOptions.includes(lga)
    ) {
      setLga("");
    }
  }, [lga, lgaOptions]);

  const handleContinue = () => {
    if (!state || !lga) return;

    setManualLocation(state, lga);

    router.push("/donor-availability");
  };

  return (
    <OnboardingLayout step={3}>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
            Where are you located?
          </h1>

          <p className="text-base leading-normal text-(--color-text-secondary)">
            We use your area to match you with nearby blood requests.
          </p>
        </section>

        <section className="space-y-5">
          <SelectField
            label="State"
            value={state}
            onChange={(value) => {
              setState(value);
              setLga("");
            }}
            options={STATES}
            placeholder="Select your state"
            required
          />

          <SelectField
            label="Local Government Area (LGA)"
            value={lga}
            onChange={setLga}
            options={lgaOptions}
            placeholder={
              state
                ? "Select your LGA"
                : "Select a state first"
            }
            disabled={!state}
            required
          />
        </section>

        <TrustNote>
          Only your state and LGA are used — never your street address.
        </TrustNote>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!state || !lga}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}