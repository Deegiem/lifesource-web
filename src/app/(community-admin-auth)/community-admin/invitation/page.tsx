"use client";

import { useRouter } from "next/navigation";
import { Shield, CheckCircle2 } from "lucide-react";
import {
  ScreenHeader,
  Badge,
  CommunityCard,
  TrustNote,
} from "@/components/community-admin-auth/ui";
import { Button } from "@/components/ui/button";

export default function AdminInvitation() {
  const router = useRouter();
  const community = {
    name: "Ikeja General Hospital",
    type: "Hospital",
    state: "Lagos",
    invitedBy: "LifeLink Super Admin",
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFBFF]">
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto w-full">
        <ScreenHeader onBack={() => router.push("/")} />

        <div className="pt-2 space-y-5">
          {/* Premium header */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center -0 mt-1">
              <Shield className="w-6 h-6 text-white opacity-90" />
            </div>
            <div>
              <Badge variant="primary" className="mb-2">
                Admin invitation
              </Badge>
              <h1 className="text-2xl font-extrabold text-[#0D1B2A] leading-tight">
                You've been invited as a
              </h1>
              <p className="text-2xl font-extrabold leading-tight text-[#4F46E5]">
                Community Admin
              </p>
            </div>
          </div>

          <CommunityCard {...community} inviteKind="admin" />

          {/* What this role means */}
          <div className="rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] p-4 space-y-3">
            <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
              Admin responsibilities
            </p>
            {[
              "Add and manage community members.",
              "Approve or reject membership requests.",
              "Oversee blood requests from your community.",
              "Represent your community on the LifeLink platform.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4F46E5] mt-0.5 -0" />
                <p className="text-xs text-[#3730A3]">{item}</p>
              </div>
            ))}
          </div>

          <TrustNote text="Community Admin accounts can only be created by LifeLink Super Admins." />
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 space-y-3 -0 max-w-lg mx-auto w-full">
        <Button
          onClick={() => router.push("/community-admin/setup")}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-12 text-[15px] font-semibold"
        >
          Accept invitation
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="w-full h-12 text-[15px] font-semibold text-[#4B617A] hover:text-[#0D1B2A] hover:bg-black/5"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
