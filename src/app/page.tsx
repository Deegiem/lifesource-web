"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Heart,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AUTH_ROUTES } from "@/features/auth/constants";
import Link from "next/link";

/**
 * Stock photography (placeholders — swap for your own donor/community shots
 * before shipping to production):
 *  - Hero / CTA background: photo by LuAnn Hunt on Unsplash, Unsplash License
 *  - "Why us" panel:        photo by CDC on Unsplash, Unsplash License
 */
const IMG_DONATION =
  "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=1800&q=80";
const IMG_CARE =
  "https://images.unsplash.com/photo-1631815584191-0ed1723f0ead?auto=format&fit=crop&w=1200&q=80";

function BloodDropIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 5S11 19.2 11 29.2C11 36.9 16.8 43 24 43s13-6.1 13-13.8C37 19.2 24 5 24 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A single ECG-style pulse line — the page's recurring visual thread. */
function PulseLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 80" className={className} fill="none" aria-hidden="true">
      <path
        className="pulse-line-path"
        d="M0 40 H180 L205 40 L220 12 L242 68 L260 40 L280 40 L300 24 L316 40 H600"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BLOOD_TYPES: Array<{ type: string; note: string; tag?: string }> = [
  { type: "O−", note: "Can give to every blood type", tag: "Universal donor" },
  { type: "O+", note: "Gives to O+, A+, B+, AB+" },
  { type: "A−", note: "Gives to A−, A+, AB−, AB+" },
  { type: "A+", note: "Gives to A+, AB+" },
  { type: "B−", note: "Gives to B−, B+, AB−, AB+" },
  { type: "B+", note: "Gives to B+, AB+" },
  { type: "AB−", note: "Gives to AB−, AB+" },
  { type: "AB+", note: "Can receive from every blood type", tag: "Universal recipient" },
];

const STEPS = [
  {
    icon: Users,
    title: "Register as a donor",
    description: "Tell us your blood type and general area. It takes about ten minutes.",
  },
  {
    icon: Bell,
    title: "Get matched nearby",
    description: "When someone close to you needs your type, you're notified right away.",
  },
  {
    icon: Heart,
    title: "Donate and see the impact",
    description: "Respond, give blood at a verified location, and track the life you helped save.",
  },
];

const WHY_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified communities only",
    description: "Requests come from hospitals, churches, NGOs, and workplaces we've approved.",
  },
  {
    icon: MapPin,
    title: "Your location stays private",
    description: "We match by state and local government area. Requesters never see your exact address.",
  },
  {
    icon: Bell,
    title: "You control your notifications",
    description: "Pause, resume, or update your availability any time from your profile.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const goToAuth = () => router.push(AUTH_ROUTES.ENTRY);

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @keyframes pulse-draw {
          from { stroke-dashoffset: 620; }
          to { stroke-dashoffset: 0; }
        }
        .pulse-line-path {
          stroke-dasharray: 620;
          animation: pulse-draw 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-line-path { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      {/* ============ NAVBAR ============ */}
      <header className="sticky top-0 z-40 w-full border-b border-(--color-border-subtle) bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-blood-red) shadow-sm shadow-(--color-blood)/30">
              <BloodDropIcon className="size-5 text-white" />
            </div>
            <span className="font-(--font-heading) text-lg font-extrabold tracking-tight text-(--color-brand-primary)">
              LIFESOURCE
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how" className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)">
              How it works
            </a>
            <a href="#types" className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)">
              Blood types
            </a>
            <a href="#why" className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)">
              Why us
            </a>
            <a href="/login" className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-text-primary)">
              Log in
            </a>
          </nav>

          <button
            type="button"
            onClick={goToAuth}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-(--color-blood) px-4 text-sm font-semibold text-(--color-text-inverse) shadow-sm shadow-(--color-blood)/30 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Get started
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <img
          src={IMG_DONATION}
          alt="A donor giving blood at a community blood drive"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-(--color-brand-primary) via-(--color-brand-primary)/92 to-(--color-blood)/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

        {/* soft glow blobs, red family only */}
        <div className="pointer-events-none absolute -top-24 right-0 size-[420px] rounded-full bg-(--color-blood-red)/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-[380px] rounded-full bg-(--color-blood)/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm ring-1 ring-white/20">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              Active in communities across Nigeria
            </div>

            <h1 className="mt-5 font-(--font-heading) text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your blood type could be the{" "}
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                one someone&rsquo;s waiting for.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
              LIFESOURCE matches verified requests from hospitals and
              community groups with donors nearby. Fast to join, private by
              default, and free for everyone.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToAuth}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-bold text-(--color-brand-primary) shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Become a donor
                <ArrowRight size={18} />
              </button>

              <a
                href="#how"
                className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-white/40 px-6 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
              >
                See how matching works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
              <span>Free forever, no hidden requirements</span>
              <span>Your exact address is never shared</span>
            </div>
          </div>

          {/* Right — live-signal card */}
          <div className="relative rounded-3xl bg-white/10 p-6 backdrop-blur-md ring-1 ring-white/20 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
              Live signal · Ikeja community
            </p>

            <div className="mt-5 text-white">
              <PulseLine className="w-full" />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-(--color-brand-secondary-soft)">
                  <BloodDropIcon className="size-5 text-(--color-blood)" />
                </div>
                <div>
                  <p className="text-sm font-bold text-(--color-text-primary)">
                    Urgent request · O+
                  </p>
                  <p className="text-xs text-(--color-text-muted)">
                    Lagos University Teaching Hospital
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-(--color-success-soft) px-2.5 py-1 text-xs font-semibold text-(--color-success)">
                3 matches
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BLOOD TYPES ============ */}
      <section id="types" className="relative overflow-hidden border-b border-(--color-border-subtle)">
        <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-(--color-blood-soft) blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-(--font-heading) text-3xl font-extrabold leading-tight text-(--color-blood-hover) sm:text-4xl">
              Know your type, know your reach
            </h2>
            <p className="mt-3 text-base leading-relaxed text-(--color-text-secondary) sm:text-lg">
              Every donor helps more people than they realize. Here&rsquo;s who
              your blood type can support.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BLOOD_TYPES.map((item) => (
              <div
                key={item.type}
                className={
                  item.tag
                    ? "rounded-2xl bg-gradient-to-br from-(--color-blood-hover) to-(--color-blood) p-5 text-white shadow-lg shadow-(--color-blood)/25"
                    : "rounded-2xl border border-(--color-border-subtle) bg-white p-5"
                }
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={
                      item.tag
                        ? "font-(--font-heading) text-2xl font-extrabold text-white"
                        : "font-(--font-heading) text-2xl font-extrabold text-(--color-blood)"
                    }
                  >
                    {item.type}
                  </span>
                  {item.tag && (
                    <span className="text-[11px] font-semibold text-white/85">
                      {item.tag}
                    </span>
                  )}
                </div>
                <p
                  className={
                    item.tag
                      ? "mt-2 text-sm leading-relaxed text-white/85"
                      : "mt-2 text-sm leading-relaxed text-(--color-text-secondary)"
                  }
                >
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl">
          <h2 className="font-(--font-heading) text-3xl font-extrabold leading-tight text-(--color-text-primary) sm:text-4xl lg:text-5xl">
            Three steps to save a life
          </h2>
          <p className="mt-3 text-base leading-relaxed text-(--color-text-secondary) sm:text-lg">
            Whether you&rsquo;re donating or requesting, the process is fast,
            safe, and built on trust.
          </p>
        </div>

        <div className="relative mt-14">
          {/* connecting thread — this really is a sequence, so the line + numbers earn their keep */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-(--color-brand-primary)/0 via-(--color-blood) to-(--color-blood-red)/0 md:block" />

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group relative rounded-3xl border border-(--color-border-subtle) bg-white p-7 transition-all hover:-translate-y-1.5 hover:border-(--color-blood-border) hover:shadow-xl hover:shadow-(--color-blood)/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-blood) to-(--color-blood) text-white shadow-md shadow-(--color-blood)/30 transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <Icon size={24} />
                    </div>
                    <span className="font-(--font-heading) text-sm font-bold text-(--color-blood)">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-(--color-text-primary) lg:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary) lg:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section id="why" className="relative overflow-hidden bg-(--color-surface-page)">
        <div className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-(--color-blood-soft) blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-28">
          {/* Left — content */}
          <div>
            <h2 className="font-(--font-heading) text-3xl font-extrabold leading-tight text-(--color-text-primary) sm:text-4xl lg:text-5xl">
              Built on community trust, not cold algorithms
            </h2>
            <p className="mt-4 text-base leading-relaxed text-(--color-text-secondary) sm:text-lg">
              Every blood request comes from a verified community member.
              Every donor is protected. No spam, no scams, no middlemen.
            </p>

            <div className="mt-10 space-y-3">
              {WHY_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-(--color-border-subtle) transition-all hover:translate-x-0.5 hover:shadow-md hover:shadow-(--color-blood)/10 hover:ring-(--color-brand-primary-hover)"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) text-white shadow-sm shadow-(--color-blood)/30 transition-transform group-hover:scale-105">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-(--color-text-primary)">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-(--color-text-secondary)">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — photo with a floating request card */}
          <div className="relative mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src={IMG_CARE}
                alt="A health worker checking a patient's vitals"
                className="h-80 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-(--color-brand-primary)/70 via-(--color-brand-primary)/10 to-transparent" />
            </div>

            <div className="relative -mt-16 ml-6 mr-6 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-(--color-border-subtle) lg:p-7">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-(--color-blood-soft) to-(--color-blood-soft)">
                  <BloodDropIcon className="size-6 text-(--color-blood)" />
                </div>
                <div>
                  <p className="text-sm font-bold text-(--color-text-primary)">
                    Urgent request · O+
                  </p>
                  <p className="text-xs text-(--color-text-muted)">Ikeja, Lagos</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-(--color-text-secondary)">
                  <CheckCircle2 size={16} className="text-(--color-success)" />
                  Verified by Lagos University Teaching Hospital
                </div>
                <div className="flex items-center gap-2 text-sm text-(--color-text-secondary)">
                  <CheckCircle2 size={16} className="text-(--color-success)" />
                  Three matching donors nearby
                </div>
              </div>

              <button
                type="button"
                onClick={goToAuth}
                className="mt-6 w-full rounded-2xl bg-linear-to-br from-(--color-blood-hover) to-(--color-blood) py-3 text-sm font-semibold text-(--color-text-inverse) shadow-sm shadow-(--color-blood)/30 transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Respond to a request
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center lg:px-16 lg:py-24">
          <img
            src={IMG_DONATION}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-(--color-brand-primary) via-(--color-brand-primary)/95 to-(--color-blood-red)/85" />
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-(--color-blood-red)/40 blur-3xl" />

          <div className="relative">
            <PulseLine className="mx-auto w-40 text-white/70" />

            <h2 className="mx-auto mt-4 max-w-3xl font-(--font-heading) text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              Someone out there needs you right now.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Join thousands of Nigerians who&rsquo;ve chosen to make a
              difference. Registration is free and takes less than ten
              minutes.
            </p>

            <button
              type="button"
              onClick={goToAuth}
              className="mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-(--color-brand-primary) shadow-xl shadow-black/20 transition-transform hover:scale-[1.06] active:scale-[0.98]"
            >
              Get started now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ ACCESS PORTALS ============ */}
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="flex flex-col divide-y divide-(--color-border-subtle) rounded-3xl border border-(--color-border-subtle) sm:flex-row sm:divide-x sm:divide-y-0">
          <Link
            href="/community-admin/verify"
            className="group flex flex-1 items-center gap-4 p-6 transition-colors hover:bg-(--color-surface-page)"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-primary-soft) text-(--color-brand-primary)">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-(--color-text-primary)">Community admin</p>
              <p className="text-sm text-(--color-text-secondary)">
                Manage donors, requests, and members in your community.
              </p>
            </div>
            <span className="hidden text-sm font-semibold text-(--color-brand-primary) group-hover:underline sm:inline">
              Sign in
            </span>
          </Link>

          <Link
            href="/super-admin/login"
            className="group flex flex-1 items-center gap-4 p-6 transition-colors hover:bg-(--color-surface-page)"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-secondary-soft) text-(--color-blood)">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-(--color-text-primary)">Super admin</p>
              <p className="text-sm text-(--color-text-secondary)">
                Oversee communities, hospitals, and platform operations.
              </p>
            </div>
            <span className="hidden text-sm font-semibold text-(--color-brand-primary) group-hover:underline sm:inline">
              Sign in
            </span>
          </Link>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-(--color-border-subtle) bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-(--color-brand-primary) to-(--color-blood-red)">
              <BloodDropIcon className="size-4 text-white" />
            </div>
            <span className="font-(--font-heading) text-sm font-extrabold tracking-tight text-(--color-brand-primary)">
              LIFESOURCE
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <Link
              href="/super-admin/login"
              className="font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
            >
              Super admin
            </Link>
            <Link
              href="/community-admin/verify"
              className="font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
            >
              Community admin
            </Link>
            <button
              type="button"
              onClick={goToAuth}
              className="font-semibold text-(--color-brand-primary) hover:underline"
            >
              Donor sign in
            </button>
          </nav>

          <p className="text-xs text-(--color-text-muted)">
            © {new Date().getFullYear()} LIFESOURCE. Built for Nigeria.
          </p>
        </div>
      </footer>
    </main>
  );
}