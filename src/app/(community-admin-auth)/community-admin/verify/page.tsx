"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { ScreenHeader, OTPInput } from "@/components/community-admin-auth/ui";
import { Button } from "@/components/ui/button";

export default function AdminVerification() {
  const router = useRouter();
  const email = "amaka.nwosu@hospital.ng";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = () => {
    if (otp.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/community-admin/profile-setup");
    }, 1100);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFBFF]">
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto w-full">
        <ScreenHeader
          onBack={() => router.push("/community-admin/setup")}
          step={2}
          totalSteps={4}
        />

        <div className="pt-4 space-y-8">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
            <Mail size={26} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#0D1B2A]">
              Verify your email
            </h1>
            <p className="text-[#4B617A] text-base leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#0D1B2A] break-all">
                {email}
              </span>
            </p>
          </div>

          <OTPInput
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setError("");
            }}
            length={6}
            error={error}
          />

          {resent ? (
            <p className="text-sm text-center text-green-600 font-medium">
              Verification email resent.
            </p>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setResent(true)}
                className="text-sm font-semibold hover:underline text-[#4F46E5]"
              >
                Resend verification code
              </button>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE]">
            <p className="text-xs text-[#4338CA] leading-relaxed">
              This code verifies your identity as the designated admin for this
              community. It expires in 15 minutes.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 space-y-3 -0 max-w-lg mx-auto w-full">
        <Button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-12 text-[15px] font-semibold"
        >
          {loading ? "Verifying..." : "Verify email"}
        </Button>
      </div>
    </div>
  );
}
