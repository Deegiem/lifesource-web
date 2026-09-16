"use client";

import { useState } from "react";
import { StateScreen } from "@/components/auth/StateScreen";
import { XOctagon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function AuthError() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      router.push(AUTH_ROUTES.LOGIN);
    }, 1500);
  };

  return (
    <StateScreen
      iconColor="danger"
      icon={<XOctagon size={24} />}
      badge="Authentication error"
      badgeVariant="error"
      title="Something went wrong"
      description="We were unable to complete the authentication request. This is usually temporary."
      infoText="If this keeps happening, please check your connection and try again. If the issue persists, contact LifeLink support."
      actions={[
        {
          label: retrying ? "Retrying…" : "Try again",
          onClick: handleRetry,
          loading: retrying,
        },
        {
          label: "Back to login",
          variant: "ghost",
          onClick: () => router.push(AUTH_ROUTES.LOGIN),
        },
      ]}
    />
  );
}
