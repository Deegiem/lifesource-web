"use client";

import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

export default function LocationPermissionPage() {
  const router = useRouter();

  const { setGpsLocation } =
    useDonorOnboardingStore();

  const [requesting, setRequesting] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleGPS = () => {
    setError("");
    setRequesting(true);

    if (!navigator.geolocation) {
      setRequesting(false);
      setError(
        "Location services are not supported by this browser.",
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation(
          position.coords.latitude,
          position.coords.longitude,
        );

        setRequesting(false);
        router.push("/donor-availability");
      },
      () => {
        setRequesting(false);
        setError(
          "We couldn't access your location. You can set it manually instead.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  return (
    <OnboardingLayout step={3}>
      <div className="flex min-h-[calc(100vh-13rem)] flex-col">
        <div className="flex flex-1 flex-col">
          <div className="flex justify-center py-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--color-brand-primary-soft)">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-surface-card)">
                <MapPin
                  size={34}
                  className="text-(--color-brand-primary)"
                />
              </div>
            </div>
          </div>

          <section className="mt-6 space-y-2 text-center">
            <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
              Help us find requests near you
            </h1>

            <p className="text-base leading-normal text-(--color-text-secondary)">
              Your location helps us prioritise blood requests that are closer to you, so you can respond faster.
            </p>
          </section>

          <section className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-(--color-brand-primary)"
              />

              <p className="text-sm text-(--color-text-secondary)">
                We never share your precise location with requesters.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-(--color-brand-primary)"
              />

              <p className="text-sm text-(--color-text-secondary)">
                Only your state and LGA area are used for matching.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-(--color-brand-primary)"
              />

              <p className="text-sm text-(--color-text-secondary)">
                You can update or clear your location any time.
              </p>
            </div>
          </section>

          {error && (
            <p className="mt-6 rounded-(--radius-lg) bg-(--color-danger-soft) px-4 py-3 text-xs leading-normal text-(--color-danger)">
              {error}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-8">
          <button
            type="button"
            onClick={handleGPS}
            disabled={requesting}
            className="flex h-(--control-height-lg) w-full items-center justify-center gap-2 rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-wait disabled:opacity-70"
          >
            <MapPin size={18} />

            {requesting
              ? "Getting your location..."
              : "Use my current location"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/manual-location")
            }
            disabled={requesting}
            className="h-(--control-height-lg) w-full rounded-(--radius-lg) text-sm font-semibold text-(--color-brand-primary) hover:bg-(--color-surface-brand) disabled:opacity-50"
          >
            Set location manually
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}