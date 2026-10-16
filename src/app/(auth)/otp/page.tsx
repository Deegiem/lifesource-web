"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [challengeId, setChallengeId] = useState(
    () => searchParams.get("challenge_id") ?? "",
  );
  const [maskedEmail, setMaskedEmail] = useState(
    () => searchParams.get("masked_email") ?? "your email",
  );
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const verify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challengeId || code.length !== 6 || busy) return;

    setBusy(true);
    setError("");

    try {
      await apiService.verifyOtp({ challenge_id: challengeId, code });

      // Decide where to send the user after OTP verification.
      // The session endpoint tells us their role — super admin, donor, etc.
      const session = await apiService.currentSession();

      if (session.is_super_admin) {
        router.push("/super-admin/dashboard");
      } else if (session.is_community_admin) {
        router.push("/community-admin/dashboard");
      } else if (session.is_donor) {
        router.push("/donor/dashboard");
      } else if (session.is_member) {
        router.push("/community/dashboard");
      } else {
        // Fallback — user exists but has no role yet
        router.push("/auth-entry");
      }
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "The verification code could not be confirmed.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!challengeId || busy) return;

    setBusy(true);
    setError("");

    try {
      const result = await apiService.resendOtp(challengeId);
      setChallengeId(result.challenge_id);
      setMaskedEmail(result.masked_email);

      // Update the URL so a refresh keeps the new challenge_id
      router.replace(
        `/otp?challenge_id=${encodeURIComponent(result.challenge_id)}&expires_in=${result.expires_in}&masked_email=${encodeURIComponent(result.masked_email)}`,
      );
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to resend the verification code.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-surface-card) px-5 py-10">
      <section className="w-full max-w-md space-y-6 rounded-2xl border border-(--color-border-default) bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-2 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-(--color-brand-primary)">
            Account security
          </p>
          <h1 className="text-2xl font-extrabold text-(--color-text-primary)">
            Verify your sign-in
          </h1>
          <p className="text-sm text-(--color-text-secondary)">
            Enter the six-digit code sent to {maskedEmail}.
          </p>
        </div>

        {!challengeId ? (
          <p
            role="alert"
            className="rounded-lg bg-(--color-danger-soft) p-3 text-sm text-(--color-danger)"
          >
            No active verification challenge. Please log in again.
          </p>
        ) : null}

        <form onSubmit={verify} className="space-y-4">
          <label
            className="block space-y-2 text-sm font-semibold text-(--color-text-primary)"
            htmlFor="otp-code"
          >
            Verification code
            <input
              id="otp-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              className="h-14 w-full rounded-xl border border-(--color-border-default) px-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-(--color-brand-primary)"
            />
          </label>

          {error ? (
            <p role="alert" className="text-sm text-(--color-danger)">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!challengeId || code.length !== 6 || busy}
            className="h-12 w-full rounded-xl bg-(--color-brand-primary) font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Verify and continue"}
          </button>
        </form>

        <button
          type="button"
          disabled={!challengeId || busy}
          onClick={() => void resend()}
          className="w-full text-sm font-semibold text-(--color-brand-primary) disabled:opacity-50"
        >
          Resend code
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full text-sm text-(--color-text-secondary)"
        >
          Return to login
        </button>
      </section>
    </main>
  );
}

function OtpFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--color-surface-card) px-5 py-10">
      <section className="w-full max-w-md space-y-6 rounded-2xl border border-(--color-border-default) bg-white p-6 shadow-sm sm:p-8">
        <p className="text-center text-sm text-(--color-text-secondary)">
          Loading…
        </p>
      </section>
    </main>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<OtpFallback />}>
      <OtpVerificationContent />
    </Suspense>
  );
}