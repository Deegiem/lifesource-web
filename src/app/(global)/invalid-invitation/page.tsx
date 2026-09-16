"use client";

import { StateScreen } from "@/components/auth/StateScreen";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function InvalidInvitation() {
  const router = useRouter();

  return (
    <StateScreen
      iconColor="muted"
      icon={<XCircle size={24} />}
      badge="Invitation unavailable"
      badgeVariant="muted"
      title="This invitation is not valid"
      description="The invitation link you followed is invalid or is no longer available."
      infoText="If someone sent you this link, please ask them to send a new invitation from their LifeLink admin dashboard."
      actions={[
        {
          label: "Return to home",
          variant: "outline",
          onClick: () => router.push(AUTH_ROUTES.ENTRY),
        },
        {
          label: "Log in instead",
          variant: "ghost",
          onClick: () => router.push(AUTH_ROUTES.LOGIN),
        },
      ]}
    />
  );
}
