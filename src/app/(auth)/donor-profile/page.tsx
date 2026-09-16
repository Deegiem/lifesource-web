"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Field } from "@/components/donor-onboarding/field";
import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { TrustNote } from "@/components/donor-onboarding/trust-note";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

export default function DonorProfilePage() {
  const router = useRouter();

  const {
    fullName: savedFullName,
    genotype: savedGenotype,
    setProfile,
  } = useDonorOnboardingStore();

  const [fullName, setFullName] = useState(savedFullName);
  const [genotype, setGenotype] = useState(savedGenotype);
  const [error, setError] = useState("");

  const genotypes = [
    "AA",
    "AS",
    "AC",
    "SS",
    "SC",
  ];

  const handleContinue = () => {
    if (!fullName.trim()) {
      setError("Enter your full name.");
      return;
    }

    setProfile({
      fullName: fullName.trim(),
      genotype,
    });

    router.push("/blood-type");
  };

  return (
    <OnboardingLayout step={1}>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
            About you
          </h1>

          <p className="text-base leading-normal text-(--color-text-secondary)">
            Help us personalise your donor experience.
          </p>
        </section>

        <section className="space-y-6">
          <Field
            label="Full name"
            value={fullName}
            onChange={(value) => {
              setFullName(value);
              setError("");
            }}
            placeholder="Adaeze Okonkwo"
            required
            error={error}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-(--color-text-primary)">
                Genotype
              </label>

              <span className="text-xs text-(--color-text-muted)">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {genotypes.map((item) => {
                const selected = genotype === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setGenotype(
                        selected ? "" : item,
                      )
                    }
                    className={[
                      "h-(--control-height-md) rounded-(--radius-lg) border text-sm font-semibold transition-colors",
                      selected
                        ? "border-(--color-brand-primary) bg-(--color-brand-primary-soft) text-(--color-brand-primary)"
                        : "border-(--color-border-default) bg-(--color-surface-card) text-(--color-text-secondary) hover:border-(--color-border-strong)",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <p className="text-xs leading-normal text-(--color-text-muted)">
              Select your genotype if you know it. This helps us match requests more accurately.
            </p>
          </div>

          <TrustNote>
            Your eligibility to donate is determined automatically based on health guidelines. You do not need to set this manually.
          </TrustNote>
        </section>

        <button
          type="button"
          onClick={handleContinue}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover)"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}