"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, CheckCircle2, XCircle } from "lucide-react";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";

type VerificationStatus = "verifying" | "success" | "error";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token")?.trim() ?? "";
  const [maskedEmail, setMaskedEmail] = useState("your email address");
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [error, setError] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    setMaskedEmail(
      window.sessionStorage.getItem("lifesource.signup.email") ??
        "your email address",
    );
  }, []);

  useEffect(() => {
    if (hasVerified.current) return;

    if (!token || token.length < 10) {
      setStatus("error");
      setError(
        "This verification link is invalid or incomplete. Please request a new verification email.",
      );
      return;
    }

    hasVerified.current = true;

    const verifyEmail = async () => {
      setStatus("verifying");
      setError("");

      try {
        await apiService.verifyEmail({ token });

        window.sessionStorage.removeItem("lifesource.signup.email");
        setStatus("success");

        router.replace(AUTH_ROUTES.DONOR_PROFILE);
      } catch (requestError) {
        setStatus("error");
        setError(
          getApiErrorMessage(
            requestError,
            "We couldn't verify your email. The link may have expired or already been used.",
          ),
        );
      }
    };

    void verifyEmail();
  }, [token, router]);

  return (
    <main className="min-h-screen rounded-4xl bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 py-6 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={() => router.push(AUTH_ROUTES.SIGNUP)}
          aria-label="Go back to signup"
          className="flex size-10 items-center justify-center rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-subtle)"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-6 sm:pt-10 md:grid md:grid-cols-2 md:items-start md:gap-16 md:pt-16 lg:gap-24">
          <div>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-(--color-brand-primary-soft) md:size-20">
              {status === "success" ? (
                <CheckCircle2
                  size={28}
                  className="text-(--color-brand-primary) md:size-9"
                />
              ) : status === "error" ? (
                <XCircle
                  size={28}
                  className="text-(--color-danger) md:size-9"
                />
              ) : (
                <Mail
                  size={28}
                  className="text-(--color-brand-primary) md:size-9"
                />
              )}
            </div>

            <div className="mt-7 md:mt-8">
              <h1 className="text-2xl font-extrabold text-(--color-text-primary) sm:text-3xl md:text-4xl">
                {status === "verifying"
                  ? "Verifying your email"
                  : status === "success"
                    ? "Email verified"
                    : "Verification failed"}
              </h1>

              <p className="mt-2 text-base leading-relaxed text-(--color-text-secondary) md:mt-3 md:text-lg">
                {status === "verifying" ? (
                  "Please wait while we confirm your email address."
                ) : status === "success" ? (
                  "Your email has been verified. Taking you to your donor profile…"
                ) : (
                  "We couldn't complete your email verification."
                )}
              </p>

              {maskedEmail !== "your email address" && (
                <p className="mt-3 text-sm text-(--color-text-secondary)">
                  Email address:{" "}
                  <span className="font-semibold text-(--color-text-primary)">
                    {maskedEmail}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 md:mt-0">
            <div
              aria-live="polite"
              className="rounded-2xl bg-(--color-surface-subtle) p-4 md:p-6"
            >
              {status === "verifying" ? (
                <div className="flex items-center gap-3">
                  <span className="size-5 animate-spin rounded-full border-2 border-(--color-border-default) border-t-(--color-brand-primary)" />
                  <p className="text-sm leading-relaxed text-(--color-text-secondary) md:text-base">
                    Checking your verification link securely…
                  </p>
                </div>
              ) : status === "success" ? (
                <p className="text-sm leading-relaxed text-(--color-text-secondary) md:text-base">
                  Verification successful. You will be redirected automatically.
                </p>
              ) : (
                <>
                  <p
                    role="alert"
                    className="text-sm leading-relaxed text-(--color-danger) md:text-base"
                  >
                    {error}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-(--color-text-secondary)">
                    If the link has expired, return to signup and request a new
                    verification email.
                  </p>
                </>
              )}
            </div>

            {status === "error" && (
              <footer className="pt-6">
                <button
                  type="button"
                  onClick={() => router.push(AUTH_ROUTES.SIGNUP)}
                  className="h-(--control-height-lg) w-full rounded-(--radius-2xl) bg-(--color-brand-primary) text-sm font-semibold text-white hover:opacity-90 md:text-base"
                >
                  Return to signup
                </button>
              </footer>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function VerifyFallback() {
  return (
    <main className="min-h-screen rounded-4xl bg-(--color-surface-card)">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-5">
        <p className="text-sm text-(--color-text-secondary)">Loading…</p>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  );
}