"use client";

import { StateScreen } from "@/components/auth/StateScreen";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function UsedInvitation() {
  const router = useRouter();

  return (
    <StateScreen
      iconColor="success"
      icon={<CheckCircle2 size={24} />}
      badge="Already used"
      badgeVariant="muted"
      title="This invitation has already been used"
      description="This invitation link was already accepted and an account has been created. Each invitation can only be used once."
      infoText="If you are the person who accepted this invitation, log in to access your account. If someone else used your invitation, contact your community administrator."
      actions={[
        {
          label: "Log in",
          onClick: () => router.push(AUTH_ROUTES.LOGIN),
        },
        {
          label: "Return to home",
          variant: "ghost",
          onClick: () => router.push(AUTH_ROUTES.ENTRY),
        },
      ]}
    />
  );
}
