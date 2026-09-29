"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { RoleDashboardShell } from "@/components/navigation/role-navigation";

const NON_DASHBOARD_ROUTES = [
  "/community/invite",
  "/community/membership",
];

export default function CommunityMemberLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMembershipFlow = NON_DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isMembershipFlow) return <>{children}</>;

  return (
    <RoleDashboardShell role="communityMember">
      {children}
    </RoleDashboardShell>
  );
}