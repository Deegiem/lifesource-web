"use client";

import { StateScreen } from "@/components/auth/StateScreen";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function ExpiredInvitation() {
  const router = useRouter();

  return (
    <StateScreen
      iconColor="warning"
      icon={<Clock size={24} />}
      badge="Invitation expired"
      badgeVariant="warning"
      title="This invitation has expired"
      description="Invitation links are only valid for 72 hours. This one has passed its expiry date."
      infoText="Please ask the community administrator to send you a fresh invitation. Invitations can be resent from the LifeLink admin dashboard."
      actions={[
        {
          label: "Return to home",
          variant: "outline",
          onClick: () => router.push(AUTH_ROUTES.ENTRY),
        },
      ]}
    />
  );
}
