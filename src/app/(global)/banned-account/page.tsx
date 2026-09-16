"use client";

import { StateScreen } from "@/components/auth/StateScreen";

export default function BannedAccount() {
  return (
    <StateScreen
      iconColor="danger"
      icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 5l14 14M19 5L5 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      }
      badge="Account disabled"
      badgeVariant="error"
      title="Your account has been permanently disabled"
      description="This account has been permanently removed from the LifeLink platform due to a serious violation of our terms of service."
      infoText="Permanently disabled accounts cannot be reactivated. If you believe this action was taken in error, you may contact LifeLink support — however, the decision is at the sole discretion of the platform."
      actions={[
        {
          label: "Contact support",
          variant: "outline",
          onClick: () => {},
        },
      ]}
    >
      <div className="w-full rounded-2xl border border-red-200 bg-(--color-danger-soft) p-4 text-left space-y-2">
        <p className="text-xs font-bold text-red-700 uppercase tracking-wide">
          Reason
        </p>
        <p className="text-sm text-red-800">
          Repeated submission of fraudulent blood requests endangering the platform and donors.
        </p>
        <p className="text-xs text-red-600 mt-1">
          Disabled on <span className="font-semibold">1 September 2026</span>
        </p>
      </div>
    </StateScreen>
  );
}
