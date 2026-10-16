"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RoleDashboardShell } from "@/components/navigation/role-navigation";
import { apiService } from "@/services/api.service";

const NON_DASHBOARD_ROUTES = [
  "/community/invite",
  "/community/membership",
  "/account/security",
];

export default function CommunityMemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isMembershipFlow = NON_DASHBOARD_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Role guard: only run on dashboard pages, never on membership flow
  useEffect(() => {
    if (isMembershipFlow) return;

    let cancelled = false;

    apiService
      .currentSession()
      .then((session) => {
        if (cancelled) return;

        if (session.is_super_admin) {
          router.replace("/super-admin/dashboard");
          return;
        }
        if (session.is_community_admin && !session.is_member) {
          router.replace("/community-admin/dashboard");
          return;
        }
        if (!session.is_member) {
          router.replace("/auth-entry");
        }
      })
      .catch(() => {
        if (cancelled) return;
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [isMembershipFlow, router]);

  if (isMembershipFlow) return <>{children}</>;

  return (
    <RoleDashboardShell role="communityMember">
      {children}
    </RoleDashboardShell>
  );
}