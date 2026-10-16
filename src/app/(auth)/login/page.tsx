"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { AUTH_ROUTES } from "@/features/auth/constants";
import { getDashboardRoute } from "@/features/auth/role-routing";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";

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

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const normalizedEmail = email.trim();

    setIsSubmitting(true);
    setError("");

    try {
      const result = await apiService.login({
        email: normalizedEmail,
        password,
      });

      // Super Admin authentication requires OTP.
      if (result.status === "otp_required") {
        if (!result.challenge_id) {
          setError(
            "The server did not provide an OTP challenge. Please try again.",
          );
          return;
        }

        const params = new URLSearchParams({
          challenge_id: result.challenge_id,
          expires_in: String(result.expires_in ?? 0),
          masked_email: result.masked_email ?? normalizedEmail,
        });

        router.replace(`${AUTH_ROUTES.OTP}?${params.toString()}`);
        return;
      }

      const session = await apiService.currentSession();

      if (session.next_step === "complete_profile") {
        router.replace(AUTH_ROUTES.DONOR_PROFILE);
        return;
      }

      let destination: string | null = null;

      if (session.is_super_admin) {
        destination = AUTH_ROUTES.SUPER_ADMIN_DASHBOARD;
      } else if (session.is_donor) {
        destination = getDashboardRoute("donor");
      } else if (session.is_community_admin) {
        destination = getDashboardRoute("community_admin");
      } else if (session.is_member) {
        destination = getDashboardRoute("community_member");
      }

      if (!destination) {
        setError(
          "Your account is authenticated, but its role or next step could not be determined. Please contact support.",
        );
        return;
      }

      router.replace(destination);
    } catch (requestError: unknown) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to log in. Please check your details and try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen rounded-xl bg-(--color-surface-card) md:h-screen md:min-h-0 md:overflow-hidden">
      <style>{`
        @keyframes pulse-draw {
          from { stroke-dashoffset: 620; }
          to { stroke-dashoffset: 0; }
        }
        .pulse-line-path {
          stroke-dasharray: 620;
          animation: pulse-draw 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fade-in 0.5s ease-out backwards; }
        @media (prefers-reduced-motion: reduce) {
          .pulse-line-path, .fade-in { animation: none; }
        }
      `}</style>

      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8 md:h-full md:min-h-0">
        <button
          type="button"
          onClick={() => router.push(AUTH_ROUTES.ENTRY)}
          aria-label="Go back"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex flex-1 flex-col md:items-center md:justify-center md:py-8">
          <div className="flex w-full flex-col md:grid md:grid-cols-2 md:items-center md:gap-16 lg:gap-24">
            {/* LEFT — Branding + live signal */}
            <div className="flex flex-col pt-8 text-center sm:pt-12 md:pt-0 md:text-left">
              {/* Brand mark */}
              <div className="flex justify-center md:justify-start">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-(--color-brand-primary) shadow-lg shadow-(--color-brand-primary)/20 md:size-16">
                  <BloodDropIcon className="size-7 text-white md:size-8" />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl md:text-4xl xl:text-5xl">
                Welcome back
              </h1>

              <p className="mt-2 text-base text-(--color-text-secondary) md:mt-3 md:text-lg">
                Log in to your LIFESOURCE account.
              </p>

              {/* Live signal card — desktop-only flourish */}
              <div className="hidden md:mt-10 md:block">
                <div className="rounded-2xl border border-(--color-border-subtle) bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--color-blood) opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-(--color-blood)" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                      Live across Nigeria
                    </span>
                  </div>

                  <div className="mt-4 text-(--color-blood)">
                    <PulseLine className="w-full" />
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-(--color-text-secondary)">
                    <ShieldCheck
                      size={14}
                      className="shrink-0 text-(--color-brand-primary)"
                    />
                    Requests come from verified communities only
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="flex flex-col">
              <form
                className="fade-in mt-8 space-y-5 md:mt-0"
                onSubmit={handleLogin}
              >
                <Field
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                    setError("");
                  }}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-(--color-text-primary)"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => router.push(AUTH_ROUTES.FORGOT_PASSWORD)}
                      className="text-sm font-semibold text-(--color-brand-primary) hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      required
                      className="h-(--control-height-lg) w-full rounded-lg border border-(--color-border-default) px-4 pr-12 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-(--color-text-muted)"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-(--color-danger)">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!email.trim() || !password || isSubmitting}
                  className="h-(--control-height-lg) w-full rounded-lg bg-(--color-brand-primary) text-sm font-semibold text-(--color-text-inverse) transition-transform hover:bg-(--color-brand-primary-hover) hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                >
                  {isSubmitting ? "Logging in…" : "Log in"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <footer className="shrink-0 pt-8 text-center md:pt-6">
          <button
            type="button"
            onClick={() => router.push(AUTH_ROUTES.DONOR_WELCOME)}
            className="text-sm text-(--color-text-secondary) md:text-base"
          >
            New donor?{" "}
            <span className="font-semibold text-(--color-brand-primary)">
              Sign up here
            </span>
          </button>
        </footer>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-(--color-text-primary)"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={id === "email" ? "email" : "current-password"}
        required
        className="h-(--control-height-lg) w-full rounded-lg border border-(--color-border-default) px-4 text-sm text-(--color-text-primary) outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
      />
    </div>
  );
}