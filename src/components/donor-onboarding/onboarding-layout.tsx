import type { ReactNode } from "react";

import { OnboardingHeader } from "./onboarding-header";

interface OnboardingLayoutProps {
  step: number;
  children: ReactNode;
}

export function OnboardingLayout({
  step,
  children,
}: OnboardingLayoutProps) {
  return (
    <main className="min-h-screen bg-(--color-surface-page)">
      {/*
        Outer wrapper:
        - Mobile: capped by --container-sm (narrow, form-friendly)
        - Desktop (md+): expands to ~92vw so content has room
      */}
      <div className="mx-auto flex min-h-screen w-full max-w-(--container-sm) flex-col px-(--page-padding-mobile) py-(--space-6) sm:px-(--page-padding-tablet) md:max-w-[92vw] md:px-12 md:py-10 lg:px-16 lg:py-12">
        <OnboardingHeader
          step={step}
          totalSteps={5}
        />

        {/*
          Content wrapper:
          - Capped at max-w-2xl on mobile (via parent)
          - On desktop, capped at max-w-3xl / lg:max-w-4xl so forms
            don't stretch edge-to-edge of the 92vw card.
          - mx-auto keeps it centered inside the wider card.
        */}
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-(--space-8) md:max-w-3xl lg:max-w-4xl">
          {children}
        </div>
      </div>
    </main>
  );
}