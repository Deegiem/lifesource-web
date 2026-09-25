import type { AdminUserRole } from "./types";

export const SUPER_ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "requests", label: "Requests" },
  { id: "users", label: "Users" },
  { id: "communities", label: "Communities" },
  { id: "hospitals", label: "Hospitals" },
  { id: "overrides", label: "Override Queue" },
  { id: "audit-log", label: "Audit Log" },
  { id: "settings", label: "Settings" },
  { id: "notifications", label: "Notifications" },
] as const;

export const ROLE_LABELS: Record<AdminUserRole, string> = {
  super_admin: "Super Admin",
  community_admin: "Community Admin",
  community_member: "Member",
  donor: "Donor",
};

export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
