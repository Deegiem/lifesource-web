"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Field } from "@/components/donor-onboarding/field";
import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { TrustNote } from "@/components/donor-onboarding/trust-note";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";
import { useAuthSessionStore } from "@/stores/auth-session.store";

export default function DonorProfilePage() {
  const router = useRouter();

  const {
    fullName: savedFullName,
    genotype: savedGenotype,
    setProfile,
  } = useDonorOnboardingStore();

  const { session, loadSession } = useAuthSessionStore();

  const [fullName, setFullName] = useState(savedFullName);
  const [genotype, setGenotype] = useState(savedGenotype);
  const [error, setError] = useState("");

  const genotypes = ["AA", "AS", "AC", "SS", "SC"];

  // Load the auth session once, only if we don't already have a saved name.
  // This avoids an unnecessary network call if the user is coming back.
  useEffect(() => {
    if (!savedFullName) {
      void loadSession();
    }
  }, [savedFullName, loadSession]);

  // When the session arrives, prefill the name field — but only if the user
  // hasn't already typed something or previously saved a name.
  useEffect(() => {
    if (savedFullName || fullName || !session) return;

    const name = [session.first_name, session.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (name) setFullName(name);
  }, [session, savedFullName, fullName]);

  const handleContinue = () => {
    if (!fullName.trim()) {
      setError("Enter your full name.");
      return;
    }
    if (!genotype) {
      setError("Select your genotype to continue.");
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
                Required
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {genotypes.map((item) => {
                const selected = genotype === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGenotype(selected ? "" : item)}
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
              Select your genotype to complete your donor profile and support safe matching.
            </p>
          </div>

          <TrustNote>
            Your eligibility to donate is determined automatically based on health guidelines. You do not need to set this manually.
          </TrustNote>
        </section>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!genotype}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}