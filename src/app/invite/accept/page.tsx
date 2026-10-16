"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
} from "lucide-react";

import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type {
  CommunityType,
  InviteDetailsResponse,
  LgaResponse,
  StateResponse,
} from "@/features/api/types";

const COMMUNITY_TYPES: { value: CommunityType; label: string }[] = [
  { value: "hospital", label: "Hospital / Medical Centre" },
  { value: "university", label: "University / Polytechnic" },
  { value: "workplace", label: "Workplace / Company" },
  { value: "ngo", label: "NGO / Non-profit" },
  { value: "religious", label: "Religious Organisation" },
  { value: "government", label: "Government Agency" },
  { value: "cooperative", label: "Cooperative / Association" },
  { value: "other", label: "Other" },
];

function InviteAcceptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [invite, setInvite] = useState<InviteDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [communityType, setCommunityType] = useState<CommunityType>("hospital");
  const [stateId, setStateId] = useState("");
  const [lgaId, setLgaId] = useState("");

  const [states, setStates] = useState<StateResponse[]>([]);
  const [lgas, setLgas] = useState<LgaResponse[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoadError("No invitation token was provided.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError("");

    apiService
      .getAdminInvite(token)
      .then((result) => {
        if (!cancelled) {
          setInvite(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            getApiErrorMessage(err, "This invitation is invalid or expired."),
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    void apiService.listStates().then(setStates).catch(() => setStates([]));
  }, []);

  useEffect(() => {
    if (!stateId) {
      setLgas([]);
      return;
    }
    void apiService.listLgas(stateId).then(setLgas).catch(() => setLgas([]));
  }, [stateId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!stateId || !lgaId) {
      setFormError("Please select your state and LGA.");
      return;
    }

    setSubmitting(true);
    try {
      await apiService.acceptAdminInvite(token, {
        password,
        phone: phone.trim() || null,
        community_type: communityType,
        state_id: stateId,
        lga_id: lgaId,
      });
      router.push("/community-admin/success");
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, "We couldn't accept the invitation."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <main className="min-h-screen bg-(--color-surface-card)">
        <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-8 sm:px-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center md:max-w-6xl md:grid md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
            <div className="flex flex-col items-center md:items-start">
              <div className="size-24 animate-pulse rounded-full bg-(--color-brand-primary-soft) md:size-28" />
              <div className="mt-8 h-8 w-48 animate-pulse rounded bg-(--color-surface-subtle)" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded bg-(--color-surface-subtle)" />
            </div>
            <div className="mt-10 h-96 w-full animate-pulse rounded-2xl bg-(--color-surface-subtle) md:mt-0" />
          </div>
        </div>
      </main>
    );
  }

  // --- Error ---
  if (loadError || !invite) {
    return (
      <main className="min-h-screen bg-(--color-surface-card)">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-danger-soft)">
            <span className="text-3xl">!</span>
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-(--color-text-primary)">
            Invalid invitation
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            {loadError || "This invitation could not be found."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 h-12 w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse)"
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  // --- Expired / used ---
  if (invite.is_expired || invite.is_used) {
    return (
      <main className="min-h-screen bg-(--color-surface-card)">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-danger-soft)">
            <span className="text-3xl">⏱</span>
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-(--color-text-primary)">
            {invite.is_expired ? "Invitation expired" : "Invitation already used"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            {invite.is_expired
              ? "This invitation has expired. Contact your super admin for a new one."
              : "This invitation has already been accepted."}
          </p>
        </div>
      </main>
    );
  }

  // --- Form ---
  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-8 sm:px-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center md:max-w-6xl md:grid md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16 lg:gap-24 xl:gap-32">
          {/* LEFT COLUMN — invite context */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--color-brand-primary-soft) md:h-28 md:w-28">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-brand-primary) md:h-20 md:w-20">
                <ShieldCheck
                  size={34}
                  className="text-(--color-text-inverse) md:hidden"
                />
                <ShieldCheck
                  size={42}
                  className="hidden text-(--color-text-inverse) md:block"
                />
              </div>
            </div>

            <section className="mt-8 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-(--color-brand-primary)">
                Admin invitation
              </p>
              <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary) md:text-3xl lg:text-4xl">
                You&apos;ve been invited to admin {invite.community_name}.
              </h1>
              <p className="text-base leading-normal text-(--color-text-secondary) md:text-lg">
                Complete the form to set up your community admin account.
                You were invited by{" "}
                <span className="font-semibold text-(--color-text-primary)">
                  {invite.invited_by_name}
                </span>
                .
              </p>
            </section>

            <div className="mt-8 w-full space-y-4 text-left md:mt-10">
              <p className="text-xs font-semibold uppercase text-(--color-text-muted)">
                What you&apos;ll be able to do
              </p>

              <PerkItem
                icon={<Users size={16} />}
                text="Invite and manage community members"
              />
              <PerkItem
                icon={<CheckCircle2 size={16} />}
                text="Approve or reject membership requests"
              />
              <PerkItem
                icon={<ShieldCheck size={16} />}
                text="Oversee blood requests from your community"
              />
            </div>
          </div>

          {/* RIGHT COLUMN — form */}
          <div className="mt-10 flex w-full flex-col md:mt-0">
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-4 rounded-2xl border border-(--color-border-default) bg-white p-5 sm:p-6 md:p-8"
            >
              <div>
                <p className="text-xs font-semibold uppercase text-(--color-text-muted)">
                  Account
                </p>
                <h2 className="mt-1 text-lg font-bold text-(--color-text-primary)">
                  Set up your admin account
                </h2>
              </div>

              <Field
                label="Email"
                value={invite.email}
                onChange={() => { }}
                disabled
                hint="Confirmed by the invitation"
              />

              <Field
                label="Phone number"
                value={phone}
                onChange={setPhone}
                placeholder="0801 234 5678"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  toggle={() => setShowPassword((v) => !v)}
                  required
                />
                <PasswordField
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showPassword}
                  toggle={() => setShowPassword((v) => !v)}
                  required
                />
              </div>

              <div className="border-t border-(--color-border-subtle) pt-4">
                <p className="text-xs font-semibold uppercase text-(--color-text-muted)">
                  Community
                </p>
                <h2 className="mt-1 text-lg font-bold text-(--color-text-primary)">
                  Where is your community located?
                </h2>
              </div>

              <SelectField
                label="Community type"
                value={communityType}
                onChange={(v) => setCommunityType(v as CommunityType)}
                options={COMMUNITY_TYPES}
                placeholder="Select community type"
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="State"
                  value={stateId}
                  onChange={(v) => {
                    setStateId(v);
                    setLgaId("");
                  }}
                  options={states.map((s) => ({ value: s.id, label: s.name }))}
                  placeholder="Select your state"
                  required
                />
                <SelectField
                  label="Local Government Area"
                  value={lgaId}
                  onChange={setLgaId}
                  options={lgas.map((l) => ({ value: l.id, label: l.name }))}
                  placeholder={stateId ? "Select LGA" : "Select state first"}
                  disabled={!stateId || lgas.length === 0}
                  required
                />
              </div>

              {formError && (
                <p className="rounded-(--radius-lg) bg-(--color-danger-soft) p-3 text-sm text-(--color-danger)">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:opacity-50 md:text-base"
              >
                {submitting ? "Setting up…" : "Accept invitation"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function InviteAcceptFallback() {
  return (
    <main className="min-h-screen bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen items-center justify-center px-5">
        <p className="text-sm text-(--color-text-secondary)">Loading…</p>
      </div>
    </main>
  );
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<InviteAcceptFallback />}>
      <InviteAcceptContent />
    </Suspense>
  );
}

// ---------- helper components ----------

function PerkItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="mt-0.5 shrink-0 text-(--color-brand-primary) [&>svg]:md:h-5 [&>svg]:md:w-5">
        {icon}
      </div>
      <p className="text-sm leading-normal text-(--color-text-secondary) md:text-base">
        {text}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-(--color-text-primary)">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft) disabled:bg-(--color-surface-subtle) disabled:text-(--color-text-secondary)"
      />
      {hint && (
        <span className="text-xs text-(--color-text-muted)">{hint}</span>
      )}
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggle,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggle: () => void;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-(--color-text-primary)">
        {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 pr-12 text-sm outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle password visibility"
          className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-(--color-text-muted)"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-(--color-text-primary)">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm outline-none focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft) disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}