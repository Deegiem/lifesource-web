"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/community-admin-auth/ui";
import { Button } from "@/components/ui/button";

export default function AdminOnboardingSuccess() {
  const router = useRouter();
  const name = "Dr. Amaka Nwosu";
  const communityName = "Ikeja General Hospital";
  const firstName = name.split(" ").pop() || name;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFBFF]">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6 overflow-y-auto max-w-lg mx-auto w-full">
        {/* Success ring */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#EEF2FF]">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#C7D2FE]">
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#4F46E5]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="primary">Community Admin</Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0D1B2A]">
            Your community is ready, {firstName}.
          </h1>
          <p className="text-[#4B617A] text-base leading-relaxed">
            <span className="font-semibold text-[#4F46E5]">
              {communityName}
            </span>{" "}
            is now live on LifeLink.
          </p>
        </div>

        {/* Next steps */}
        <div className="w-full text-left rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
            Your next steps
          </p>
          {[
            { step: "1", text: "Invite members to join your community." },
            {
              step: "2",
              text: "Approve membership requests from the dashboard.",
            },
            { step: "3", text: "Monitor and manage blood requests." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center -0 bg-[#4F46E5]">
                <span className="text-[10px] font-bold text-white">
                  {item.step}
                </span>
              </div>
              <p className="text-sm text-[#3730A3]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 space-y-3 -0 max-w-lg mx-auto w-full">
        <Button
          onClick={() => router.push("/community-admin/dashboard")}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-12 text-[15px] font-semibold"
        >
          Go to Community Dashboard
        </Button>
      </div>
    </div>
  );
}
