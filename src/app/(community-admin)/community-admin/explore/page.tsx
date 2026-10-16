"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

function BloodDropIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 5C24 5 11 19.2 11 29.2C11 36.9 16.8 43 24 43C31.2 43 37 36.9 37 29.2C37 19.2 24 5 24 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const RESPONSIBILITIES = [
  {
    icon: ShieldCheck,
    title: "Verify blood requests",
    description:
      "Confirm that requests coming through your organization are genuine before they reach donors.",
  },
  {
    icon: Users,
    title: "Manage your donor list",
    description:
      "See who in your community has registered and keep their information up to date.",
  },
  {
    icon: Bell,
    title: "Coordinate urgent matches",
    description:
      "Step in when a request needs a faster response and help connect the right donors.",
  },
  {
    icon: ClipboardCheck,
    title: "Keep records straight",
    description:
      "Track past requests and donations for your hospital, church, NGO, or workplace.",
  },
];

const REQUIREMENTS = [
  "You represent a hospital, church, NGO, workplace, or other established community organization.",
  "You can commit to reviewing requests from your organization in a timely manner.",
  "You&apos;re able to verify the identity of people making requests through you.",
];

export default function CommunityAdminExplorePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* decorative glow — navy leads here, this is the institutional/admin path */}
      <div className="pointer-events-none absolute -top-24 left-[-10%] size-[420px] rounded-full bg-(--color-brand-primary-soft) blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] size-[360px] rounded-full bg-(--color-blood-soft) blur-3xl" />

      {/* ============ NAV ============ */}
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 pt-6 sm:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-(--color-blood) to-(--color-blood-hover)">
            <BloodDropIcon className="size-3.5 text-white" />
          </div>
          <span className="font-(--font-heading) text-sm font-extrabold tracking-tight text-(--color-brand-primary)">
            LIFESOURCE
          </span>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative mx-auto max-w-3xl px-5 pb-4 pt-12 text-center sm:px-8 sm:pt-16">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) shadow-lg shadow-(--color-brand-primary)/25">
          <Building2 size={28} className="text-white" />
        </div>

        <h1 className="mt-6 font-(--font-heading) text-3xl font-extrabold leading-tight tracking-tight text-(--color-text-primary) sm:text-4xl lg:text-5xl">
          Bring LIFESOURCE to your community
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-(--color-text-secondary) sm:text-lg">
          Community admins are the trusted link between LIFESOURCE and the
          hospitals, churches, NGOs, and workplaces that request blood. Here&apos;s
          what the role involves.
        </p>
      </section>

      {/* ============ RESPONSIBILITIES ============ */}
      <section className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-(--color-brand-primary)">
          What you&apos;ll do
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {RESPONSIBILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-(--color-border-subtle) transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) text-white shadow-sm shadow-(--color-brand-primary)/25 transition-transform group-hover:scale-105">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-(--color-text-primary)">{item.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-(--color-text-secondary)">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ REQUIREMENTS ============ */}
      <section className="relative mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <div className="rounded-3xl border border-(--color-border-subtle) bg-(--color-surface-page) p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-brand-primary)">
            What you&apos;ll need
          </h2>
          <ul className="mt-5 space-y-3">
            {REQUIREMENTS.map((requirement) => (
              <li key={requirement} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-(--color-success)" />
                <span className="text-sm leading-relaxed text-(--color-text-secondary) sm:text-base">
                  {requirement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative mx-auto max-w-3xl px-5 pb-16 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) px-8 py-12 text-center">
          <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/10 blur-2xl" />

          <h2 className="relative font-(--font-heading) text-2xl font-extrabold text-white sm:text-3xl">
            Ready to represent your organization?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            Applications are reviewed by our team before your account is
            activated.
          </p>

          <button
            type="button"
            onClick={() => router.push("/community-admin/apply")}
            className="relative mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-bold text-(--color-brand-primary) shadow-lg shadow-black/10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply to become a community admin
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-(--color-text-secondary)">
          Already an approved community admin?{" "}
          <button
            type="button"
            onClick={() => router.push("/community-admin/verify")}
            className="font-semibold text-(--color-brand-primary) hover:underline"
          >
            Sign in here
          </button>
        </p>
      </section>
    </div>
  );
}