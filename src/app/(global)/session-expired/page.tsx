"use client";

import { StateScreen } from "@/components/auth/StateScreen";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function SessionExpired() {
  const router = useRouter();

  return (
    <StateScreen
      iconColor="brand"
      icon={<Lock size={24} />}
      badge="Session ended"
      badgeVariant="muted"
      title="Your session has expired"
      description="For your security, you have been signed out after a period of inactivity. Please log in again to continue."
      actions={[
        {
          label: "Log in again",
          onClick: () => router.push(AUTH_ROUTES.LOGIN),
        },
      ]}
    />
  );
}
