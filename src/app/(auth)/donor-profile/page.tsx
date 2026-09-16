import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DonorProfilePage() {
  return (
    <main className="min-h-screen bg-(--color-surface-page)">
      <div className="mx-auto flex min-h-screen w-full max-w-(--container-sm) flex-col px-(--page-padding-mobile) py-(--space-6) sm:px-(--page-padding-tablet) lg:px-(--page-padding-desktop)">
        <header className="flex items-center gap-(--space-4)">
          <Link
            href="/verify"
            aria-label="Go back"
            className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--color-border-default) bg-(--color-surface-card) text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-subtle)"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div className="flex-1">
            <div className="mb-(--space-2) h-1.5 overflow-hidden rounded-(--radius-full) bg-(--color-border-subtle)">
              <div className="h-full w-1/5 rounded-(--radius-full) bg-(--color-brand-primary)" />
            </div>

            <p className="text-xs font-medium text-(--color-text-muted)">
              Step 1 of 5
            </p>
          </div>
        </header>

        {/* Content */}
        <section className="flex-1 py-(--space-8)">
          <div className="space-y-(--space-6)">
            {/* Heading */}
            <div className="space-y-(--space-2)">
              <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary) sm:text-3xl">
                About you
              </h1>

              <p className="text-base leading-normal text-(--color-text-secondary)">
                Help us personalise your donor experience.
              </p>
            </div>

            {/* Full name */}
            <div className="space-y-(--space-2)">
              <label
                htmlFor="full-name"
                className="text-sm font-semibold text-(--color-brand-primary)"
              >
                Full name
                <span className="ml-(--space-1) text-(--color-blood)">*</span>
              </label>

              <Input
                id="full-name"
                name="fullName"
                type="text"
                placeholder="Adaeze Okonkwo"
                autoComplete="name"
              />
            </div>

            {/* Genotype */}
            <div className="space-y-(--space-3)">
              <div className="flex items-center justify-between gap-(--space-4)">
                <label className="text-sm font-semibold text-(--color-brand-primary)">
                  Genotype
                </label>

                <span className="text-xs font-medium text-(--color-text-muted)">
                  Optional
                </span>
              </div>

              <div className="grid grid-cols-2 gap-(--space-2) sm:grid-cols-4">
                {["AA", "AS", "SS", "AC"].map((genotype) => (
                  <button
                    key={genotype}
                    type="button"
                    className="flex h-(--control-height-lg) items-center justify-center rounded-lg border border-(--color-border-default) bg-(--color-surface-card) text-sm font-semibold text-(--color-text-primary) transition-colors hover:border-(--color-brand-primary) hover:bg-(--color-brand-primary-soft)"
                  >
                    {genotype}
                  </button>
                ))}
              </div>

              <p className="text-xs leading-normal text-(--color-text-muted)">
                Select your genotype if you know it — this helps us match
                requests more accurately.
              </p>
            </div>

            {/* Eligibility info */}
            <div className="rounded-lg border border-(--color-border-default) bg-(--color-surface-subtle) p-(--space-4)">
              <div className="flex items-start gap-(--space-3)">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-(--color-brand-primary)" />

                <p className="text-xs leading-relaxed text-(--color-text-secondary)">
                  Your eligibility to donate is determined automatically based
                  on health guidelines. You do not need to set this manually.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-(--space-4)">
          <Button
            type="button"
            className="h-(--control-height-lg) w-full rounded-lg bg-(--color-brand-primary) text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover)"
          >
            Continue
          </Button>
        </footer>
      </div>
    </main>
  );
}
