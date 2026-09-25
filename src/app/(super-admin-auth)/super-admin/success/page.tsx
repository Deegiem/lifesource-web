"use client";

import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { ShieldCheck, ChevronRight } from "lucide-react";

export default function SuperAdminSuccess() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-(--color-text-primary) w-full flex items-center justify-center p-0 sm:p-6 md:p-12">
      <div className="w-full max-w-2xl flex flex-col justify-center min-h-[600px] my-auto">
        <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 text-center space-y-6 overflow-y-auto pt-8 pb-4">

          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12l5 5L20 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/60 text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck size={14} />
              Authenticated
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Signed in as Super Admin
            </h1>
            <p className="text-white/50 text-base leading-relaxed">
              You now have full administrative access. All actions are audited
              and logged.
            </p>
          </div>


          <div className="w-full space-y-2 text-left pt-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest px-2 pb-1">Test State Screens</p>
            {[
              { label: "Suspended Account", route: AUTH_ROUTES.SUSPENDED_ACCOUNT },
              { label: "Banned Account", route: AUTH_ROUTES.BANNED_ACCOUNT },
              { label: "Network Error", route: AUTH_ROUTES.NETWORK_ERROR },
              { label: "Auth Error", route: AUTH_ROUTES.AUTH_ERROR },
              { label: "Invalid Invite", route: AUTH_ROUTES.INVALID_INVITATION },
              { label: "Expired Invite", route: AUTH_ROUTES.EXPIRED_INVITATION },
              { label: "Used Invite", route: AUTH_ROUTES.USED_INVITATION },
              { label: "Session Expired", route: AUTH_ROUTES.SESSION_EXPIRED },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.route)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-white/80">
                    {item.label}
                  </p>
                </div>
                <ChevronRight size={16} className="text-white/50" />
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-6 pt-3 space-y-3 flex-shrink-0 mt-auto">
          <button
            onClick={() => router.push(AUTH_ROUTES.ENTRY)}
            className="w-full bg-white text-(--color-text-primary) font-bold text-base py-4 rounded-2xl hover:bg-white/90 transition-colors min-h-[52px]"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
