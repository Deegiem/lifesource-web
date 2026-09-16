"use client";

import { Check, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";

export default function DonorReviewPage() {
  const router = useRouter();

  const {
    fullName,
    genotype,
    bloodType,
    state,
    lga,
    availability,
  } = useDonorOnboardingStore();

  const details = [
    {
      label: "Full name",
      value: fullName || "Not provided",
      route: "/donor-profile",
    },
    {
      label: "Blood type",
      value: bloodType || "Not provided",
      route: "/blood-type",
      emphasis: "blood",
    },
    {
      label: "Location",
      value:
        state && lga
          ? `${state}, ${lga}`
          : "Not provided",
      route: "/location-permission",
    },
    {
      label: "Availability",
      value:
        availability === "available"
          ? "Available to donate"
          : "Not available",
      route: "/donor-availability",
      emphasis:
        availability === "available"
          ? "success"
          : undefined,
    },
    ...(genotype
      ? [
          {
            label: "Genotype",
            value: genotype,
            route: "/donor-profile",
          },
        ]
      : []),
  ];

  const handleConfirm = () => {
    /*
     * Screen 16 only completes the onboarding flow here.
     *
     * Backend integration will persist the donor profile.
     */
    router.push("/donor-success");
  };

  return (
    <OnboardingLayout step={5}>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
            Review your details
          </h1>

          <p className="text-base leading-normal text-(--color-text-secondary)">
            Check that everything looks right before we save your profile.
          </p>
        </section>

        <section className="overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card)">
          {details.map((detail, index) => (
            <div
              key={detail.label}
              className={[
                "flex items-center justify-between gap-4 px-4 py-4",
                index !== details.length - 1
                  ? "border-b border-(--color-border-subtle)"
                  : "",
              ].join(" ")}
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-(--color-text-muted)">
                  {detail.label}
                </p>

                <p
                  className={[
                    "mt-1 break-words text-base font-bold",
                    detail.emphasis === "blood"
                      ? "text-(--color-blood)"
                      : detail.emphasis === "success"
                        ? "text-(--color-success)"
                        : "text-(--color-text-primary)",
                  ].join(" ")}
                >
                  {detail.value}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(detail.route)
                }
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-(--color-brand-primary)"
              >
                <Pencil size={13} />
                Edit
              </button>
            </div>
          ))}
        </section>

        <div className="flex items-start gap-3 rounded-(--radius-lg) bg-(--color-info-soft) px-4 py-3">
          <Check
            size={17}
            className="mt-0.5 shrink-0 text-(--color-info)"
          />

          <p className="text-xs leading-normal text-(--color-text-secondary)">
            Your contact information and exact location are kept private. Only your blood type and general area are used for matching.
          </p>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover)"
        >
          Confirm and save
        </button>
      </div>
    </OnboardingLayout>
  );
}