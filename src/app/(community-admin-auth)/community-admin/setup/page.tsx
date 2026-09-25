"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScreenHeader,
  Input,
  PasswordInput,
  InfoBanner,
  TrustNote,
} from "@/components/community-admin-auth/ui";
import { Button } from "@/components/ui/button";

export default function AdminAccountSetup() {
  const router = useRouter();
  const community = { name: "Ikeja General Hospital" };
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Enter your full name.";
    if (!email.trim() || !email.includes("@")) e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/community-admin/verify");
    }, 900);
  };

  console.log("TESTING EXPORTS:", { ScreenHeader: typeof ScreenHeader, Input: typeof Input, PasswordInput: typeof PasswordInput, InfoBanner: typeof InfoBanner, TrustNote: typeof TrustNote, Button: typeof Button });
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFBFF]">
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto w-full">
        <ScreenHeader onBack={() => router.push("/community-admin/invitation")} step={1} totalSteps={4} />

        <div className="pt-4 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-[#4F46E5]">
              {community.name}
            </p>
            <h1 className="text-2xl font-extrabold text-[#0D1B2A]">
              Set up your account
            </h1>
            <p className="text-sm text-[#4B617A] mt-1">
              Use your official contact details as the community admin.
            </p>
          </div>

          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Dr. Amaka Nwosu"
            error={errors.fullName}
            autoFocus
          />
          
          <Input
            label="Official email address"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amaka.nwosu@hospital.ng"
            error={errors.email}
            hint="Use your official work email address."
          />
          
          <PasswordInput
            label="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <InfoBanner variant="info">
            <p className="text-xs leading-relaxed text-[#3730A3]">
              Admin accounts require email verification. Make sure you have access to the email address above.
            </p>
          </InfoBanner>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 space-y-3 flex-shrink-0 max-w-lg mx-auto w-full">
        <Button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-12 text-[15px] font-semibold"
        >
          {loading ? "Please wait..." : "Continue"}
        </Button>
        <TrustNote text="Your credentials are encrypted and stored securely." />
      </div>
    </div>
  );
}
