"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function SignupPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const valid = !!form.fullName && !!form.email && !!form.phone && form.password.length >= 8 &&
    /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) &&
    form.password === form.confirmPassword && agreed;

  return (
    // Mobile: grows naturally. Desktop: locked to viewport, no scroll.
    <main className="min-h-screen bg-(--color-surface-card) rounded-4xl md:h-screen md:min-h-0 md:overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8 md:h-full md:min-h-0">
        <button
          type="button"
          onClick={() => router.push(AUTH_ROUTES.DONOR_WELCOME)}
          aria-label="Go back"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Vertically centered on desktop, natural flow on mobile */}
        <div className="flex flex-1 flex-col md:items-center md:justify-center md:py-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col pt-6 sm:pt-8 md:pt-0 md:max-w-5xl">
            <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl md:text-4xl">
              Create your account
            </h1>
            <p className="mt-1 text-base text-(--color-text-secondary) md:text-lg">
              Tell us a bit about yourself to get started.
            </p>

            <form
              className="mt-7 md:mt-8"
              onSubmit={(e) => { e.preventDefault(); if (valid) router.push(AUTH_ROUTES.VERIFY); }}
            >
              {/* Two columns on desktop, single column on mobile */}
              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
                {/* LEFT COLUMN — identity fields */}
                <div className="space-y-4 md:space-y-5">
                  {[
                    ["fullName", "Full name", "text", "Adaeze Okonkwo"],
                    ["email", "Email address", "email", "adaeze@example.com"],
                    ["phone", "Phone number", "tel", "0801 234 5678"],
                  ].map(([key, label, type, placeholder]) => (
                    <Field
                      key={key}
                      id={key}
                      label={label}
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(v) => update(key as keyof typeof form, v)}
                    />
                  ))}
                </div>

                {/* RIGHT COLUMN — password fields */}
                <div className="space-y-4 md:space-y-5">
                  <PasswordField
                    id="password"
                    label="Password"
                    value={form.password}
                    show={show}
                    toggle={() => setShow(!show)}
                    onChange={(v) => update("password", v)}
                  />

                  {form.password && (
                    <div className="space-y-2">
                      {[
                        ["At least 8 characters", form.password.length >= 8],
                        ["One uppercase letter", /[A-Z]/.test(form.password)],
                        ["One number", /[0-9]/.test(form.password)],
                      ].map(([label, met]) => (
                        <p
                          key={label as string}
                          className={`text-xs ${met ? "text-(--color-success)" : "text-(--color-text-muted)"}`}
                        >
                          {met ? "✓" : "○"} {label as string}
                        </p>
                      ))}
                    </div>
                  )}

                  <PasswordField
                    id="confirmPassword"
                    label="Confirm password"
                    value={form.confirmPassword}
                    show={confirmShow}
                    toggle={() => setConfirmShow(!confirmShow)}
                    onChange={(v) => update("confirmPassword", v)}
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              {/* Terms + Submit — spans both columns */}
              <div className="mt-6 md:mt-8">
                <label className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-4 accent-(--color-brand-primary)"
                  />
                  <span className="text-xs leading-relaxed text-(--color-text-secondary)">
                    I agree to the{" "}
                    <span className="font-semibold text-(--color-brand-primary) underline">Terms of Service</span>{" "}
                    and{" "}
                    <span className="font-semibold text-(--color-brand-primary) underline">Privacy Policy</span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!valid}
                  className="mt-4 h-(--control-height-lg) w-full rounded-(--radius-2xl) bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse) hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50 md:mt-5 md:text-base"
                >
                  Create account
                </button>
              </div>
            </form>

            <footer className="shrink-0 pt-6 text-center md:pt-5">
              <p className="text-xs text-(--color-text-muted) md:text-sm">
                Your information is encrypted and kept private.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ id, label, type, placeholder, value, onChange }: { id: string; label: string; type: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-(--color-text-primary)">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
        required
      />
    </div>
  );
}

function PasswordField({ id, label, value, show, toggle, onChange, placeholder = "Enter your password" }: { id: string; label: string; value: string; show: boolean; toggle: () => void; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-(--color-text-primary)">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 pr-12 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
          required
        />
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle password visibility"
          className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-(--color-text-muted)"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}