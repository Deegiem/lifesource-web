"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ChevronLeft, Loader2, Lock } from "lucide-react";

function SuperAdminVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "admin@lifelink.ng";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length < 6) {
      setError("Enter the 6-digit authentication code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(AUTH_ROUTES.SUPER_ADMIN_SUCCESS);
    }, 1200);
  };

  const mins = Math.floor(countdown / 60);
  const secs = String(countdown % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-(--color-text-primary) w-full flex items-center justify-center p-0 sm:p-6 md:p-12">
      <div className="w-full max-w-xl flex flex-col justify-center min-h-[600px] my-auto">
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 pt-8 pb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 transition-colors mb-6"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="space-y-8">
            {/* 2FA */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-white/80" />
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-extrabold text-white">
                Two-factor authentication
              </h1>
              <p className="text-white/50 text-base leading-relaxed">
                Enter the 6-digit code sent to{" "}
                <span className="text-white/80 font-semibold">{email}</span>
              </p>
            </div>

            {/* OTP boxes — dark themed */}
            <div className="space-y-3 relative">
              <div className="flex gap-2.5 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                      otp[i]
                        ? "border-white/60 bg-white/15 text-white"
                        : "border-white/15 bg-white/5 text-white/20"
                    }`}
                  >
                    {otp[i] ? "•" : ""}
                  </div>
                ))}
              </div>
              {/* Hidden real input overlay trick */}
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(v);
                  setError("");
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-text"
                autoFocus
              />
              {error && (
                <p className="text-sm text-center text-red-400 font-medium pt-2">
                  {error}
                </p>
              )}
              <p className="text-center text-xs text-white/30 pt-1">
                (Type your 6-digit code)
              </p>
            </div>

            {/* Timer */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-white/40">
                  Code expires in{" "}
                  <span className="font-semibold text-white/60 tabular-nums">
                    {mins}:{secs}
                  </span>
                </p>
              ) : (
                <button
                  onClick={() => setCountdown(120)}
                  className="text-sm font-semibold text-white/60 hover:text-white/80"
                >
                  Request new code
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-white/40 leading-relaxed text-center">
                This is a mandatory second factor for Super Admin access. If you
                did not initiate this login, contact the platform security team
                immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-6 pt-3 space-y-3 -0">
          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            className="w-full bg-white text-(--color-text-primary) font-bold text-base py-4 rounded-2xl hover:bg-white/90 transition-colors disabled:opacity-30 min-h-14 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function SuperAdminVerification() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-(--color-text-primary) w-full flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-xl flex flex-col min-h-[600px] items-center justify-center my-auto">
            <span className="text-white/50">Loading...</span>
          </div>
        </main>
      }
    >
      <SuperAdminVerificationContent />
    </Suspense>
  );
}
