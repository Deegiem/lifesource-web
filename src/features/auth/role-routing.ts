
import type { UserRole } from "@/features/auth/types";

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  donor: "/donor/dashboard",
  community_member: "/community/dashboard",
  community_admin: "/community-admin/dashboard",
  super_admin: "/super-admin/dashboard",
};

export function getDashboardRoute(role: unknown): string | null {
  if (typeof role !== "string") return null;

  if (!Object.prototype.hasOwnProperty.call(DASHBOARD_ROUTES, role)) {
    return null;
  }

  return DASHBOARD_ROUTES[role as UserRole];
}
