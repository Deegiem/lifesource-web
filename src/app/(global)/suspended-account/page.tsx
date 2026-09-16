"use client";

import { StateScreen } from "@/components/auth/StateScreen";
import { AlertTriangle, ChevronRight } from "lucide-react";

export default function SuspendedAccount() {
  return (
    <StateScreen
      iconColor="warning"
      icon={<AlertTriangle size={24} />}
      badge="Account suspended"
      badgeVariant="warning"
      title="Your account is suspended"
      description="Access to your account has been temporarily restricted. You can view this screen but cannot perform any actions."
      infoText="If you believe this is an error, or would like to appeal this decision, please contact LifeLink support through the button below."
    >
      {/* Reason */}
      <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left space-y-2">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
          Suspension reason
        </p>
        <p className="text-sm text-amber-800">
          Violation of community blood request guidelines — multiple unverified
          requests submitted.
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Suspended on <span className="font-semibold">8 September 2026</span>
        </p>
      </div>

      {/* Actions list */}
      <div className="w-full rounded-2xl border border-(--color-border-default) divide-y divide-(--color-surface-subtle) overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-(--color-surface-subtle) transition-colors text-left">
          <span className="text-sm font-semibold text-(--color-text-primary)">
            Contact support
          </span>
          <ChevronRight size={16} className="text-(--color-text-muted)" />
        </button>
        <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-(--color-surface-subtle) transition-colors text-left">
          <span className="text-sm font-semibold text-(--color-text-primary)">
            Submit an appeal
          </span>
          <ChevronRight size={16} className="text-(--color-text-muted)" />
        </button>
      </div>
    </StateScreen>
  );
}
