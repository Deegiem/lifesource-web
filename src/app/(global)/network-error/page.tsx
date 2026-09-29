"use client";

import { useState } from "react";
import { StateScreen } from "@/components/auth/StateScreen";
import { WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function NetworkError() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 2000);
  };

  return (
    <StateScreen
      iconColor="muted"
      icon={<WifiOff size={24} />}
      badge="No connection"
      badgeVariant="muted"
      title="Connection lost"
      description="Check your internet connection and try again. Your data is saved locally."
      actions={[
        {
          label: retrying ? "Checking connection…" : "Try again",
          onClick: handleRetry,
          loading: retrying,
        },
        {
          label: "Go back",
          variant: "ghost",
          onClick: () => router.push(AUTH_ROUTES.ENTRY),
        },
      ]}
    >
      {/* Network tips */}
      <div className="w-full text-left rounded-2xl bg-(--color-surface-subtle) p-4 space-y-2.5">
        <p className="text-xs font-bold text-(--color-text-muted) uppercase tracking-wider">
          Quick checks
        </p>
        {[
          "Check that mobile data or Wi-Fi is enabled.",
          "Move to an area with better signal.",
          "Try switching between mobile data and Wi-Fi.",
        ].map((tip, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-(--color-text-muted) mt-1.5 -0" />
            <p className="text-sm text-(--color-text-secondary)">{tip}</p>
          </div>
        ))}
      </div>
    </StateScreen>
  );
}
