"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
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

const ORG_TYPES = ["Hospital", "Church", "NGO", "Workplace", "Other"] as const;

const COMMUNITY_SIZES = [
  "Fewer than 50 people",
  "50–200 people",
  "200–1,000 people",
  "More than 1,000 people",
] as const;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "Federal Capital Territory (Abuja)",
];

type FormState = {
  organizationName: string;
  organizationType: (typeof ORG_TYPES)[number] | "";
  state: string;
  lga: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  communitySize: (typeof COMMUNITY_SIZES)[number] | "";
  reason: string;
};

const INITIAL_STATE: FormState = {
  organizationName: "",
  organizationType: "",
  state: "",
  lga: "",
  contactName: "",
  contactRole: "",
  email: "",
  phone: "",
  communitySize: "",
  reason: "",
};

const REQUIRED_FIELDS: Array<keyof FormState> = [
  "organizationName",
  "organizationType",
  "state",
  "lga",
  "contactName",
  "email",
  "phone",
  "reason",
];

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-(--color-text-primary)",
    "placeholder:text-(--color-text-muted) focus:outline-none",
    hasError
      ? "border-(--color-danger) focus:border-(--color-danger)"
      : "border-(--color-border-default)",
  ].join(" ");
}

export default function CommunityAdminApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof FormState, boolean>> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!form[field].trim()) nextErrors[field] = true;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = true;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    try {
      // TODO: point this at your real endpoint once it exists.
      const response = await fetch("/api/community-admin/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }

  if (status === "submitted") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5">
        <div className="pointer-events-none absolute -top-24 left-[-10%] size-[420px] rounded-full bg-(--color-brand-primary-soft) blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] size-[360px] rounded-full bg-(--color-blood-soft) blur-3xl" />

        <div className="relative max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-success) to-(--color-success) shadow-lg">
            <CheckCircle2 size={28} className="text-white" />
          </div>
          <h1 className="mt-6 font-(--font-heading) text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl">
            Application received
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-(--color-text-secondary) sm:text-base">
            Thanks, {form.contactName.split(" ")[0] || "there"}. Our team will
            review the details for {form.organizationName} and reach out at{" "}
            <span className="font-medium text-(--color-text-primary)">{form.email}</span>{" "}
            with next steps.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-(--color-brand-primary) px-6 text-sm font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover)"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-24 left-[-10%] size-[420px] rounded-full bg-(--color-brand-primary-soft) blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] size-[360px] rounded-full bg-(--color-blood-soft) blur-3xl" />

      {/* ============ NAV ============ */}
      <header className="relative mx-auto flex max-w-3xl items-center justify-between px-5 pt-6 sm:px-8">
        <button
          type="button"
          onClick={() => router.push("/community-admin/explore")}
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
      <section className="relative mx-auto max-w-2xl px-5 pb-4 pt-10 text-center sm:px-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) shadow-lg shadow-(--color-brand-primary)/25">
          <Building2 size={24} className="text-white" />
        </div>
        <h1 className="mt-5 font-(--font-heading) text-2xl font-extrabold tracking-tight text-(--color-text-primary) sm:text-3xl">
          Apply to become a community admin
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-(--color-text-secondary) sm:text-base">
          Tell us about your organization. This takes about five minutes, and
          our team will follow up by email.
        </p>
      </section>

      {/* ============ FORM ============ */}
      <section className="relative mx-auto max-w-2xl px-5 pb-20 pt-8 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-(--color-border-subtle) bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Organization */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-brand-primary)">
              Organization
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Organization name
                </label>
                <input
                  value={form.organizationName}
                  onChange={(e) => update("organizationName", e.target.value)}
                  placeholder="e.g. Lagos University Teaching Hospital"
                  className={inputClass(!!errors.organizationName)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Organization type
                </label>
                <select
                  value={form.organizationType}
                  onChange={(e) =>
                    update("organizationType", e.target.value as FormState["organizationType"])
                  }
                  className={inputClass(!!errors.organizationType)}
                >
                  <option value="">Select type</option>
                  {ORG_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Estimated community size
                </label>
                <select
                  value={form.communitySize}
                  onChange={(e) =>
                    update("communitySize", e.target.value as FormState["communitySize"])
                  }
                  className={inputClass(false)}
                >
                  <option value="">Select a range</option>
                  {COMMUNITY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  State
                </label>
                <select
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className={inputClass(!!errors.state)}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Local government area
                </label>
                <input
                  value={form.lga}
                  onChange={(e) => update("lga", e.target.value)}
                  placeholder="e.g. Ikeja"
                  className={inputClass(!!errors.lga)}
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-brand-primary)">
              Contact person
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Full name
                </label>
                <input
                  value={form.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                  placeholder="e.g. Adaeze Okonkwo"
                  className={inputClass(!!errors.contactName)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Role at organization
                </label>
                <input
                  value={form.contactRole}
                  onChange={(e) => update("contactRole", e.target.value)}
                  placeholder="e.g. Head nurse, Pastor, HR lead"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Email address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@organization.org"
                  className={inputClass(!!errors.email)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g. 080X XXX XXXX"
                  className={inputClass(!!errors.phone)}
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-(--color-brand-primary)">
              A bit more detail
            </h2>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-(--color-text-primary)">
                Why do you want to become a community admin?
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                rows={4}
                placeholder="Tell us a little about your organization and the community you'd be managing requests for."
                className={inputClass(!!errors.reason)}
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl bg-(--color-brand-primary-soft) p-4">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-(--color-brand-primary)" />
            <p className="text-xs leading-relaxed text-(--color-text-secondary)">
              We verify every organization before granting admin access. This
              protects donors and keeps requests trustworthy.
            </p>
          </div>

          {status === "error" && (
            <p className="text-sm font-medium text-(--color-danger)">
              Something went wrong sending your application. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-(--color-brand-primary) to-(--color-brand-primary-hover) text-base font-semibold text-white shadow-md shadow-(--color-brand-primary)/25 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}