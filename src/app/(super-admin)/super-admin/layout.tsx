"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  FileClock,
  Hospital,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";

import { AdminShell, type AdminNavGroup } from "@/components/admin/layout/admin-shell";

const NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Platform",
    items: [
      { id: "requests", label: "Platform Requests", href: "/super-admin/requests", icon: ClipboardList },
      { id: "communities", label: "Communities", href: "/super-admin/communities", icon: UsersRound },
      { id: "community-admins", label: "Community Admins", href: "/super-admin/community-admins/invite", icon: Users },
      { id: "hospitals", label: "Hospitals", href: "/super-admin/hospitals", icon: Hospital },
      { id: "overrides", label: "Override Requests", href: "/super-admin/overrides", icon: ShieldAlert, badge: 3 },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "audit-log", label: "Audit Log", href: "/super-admin/audit-log", icon: FileClock },
      { id: "notifications", label: "Notifications", href: "/super-admin/notifications", icon: Bell },
      { id: "settings", label: "Platform Settings", href: "/super-admin/settings", icon: Settings },
      { id: "account-security", label: "Account Security", href: "/account/security", icon: ShieldCheck },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  requests: "Platform Requests",
  communities: "Communities",
  "community-admins": "Community Admins",
  hospitals: "Hospitals",
  overrides: "Override Requests",
  "audit-log": "Audit Log",
  settings: "Platform Settings",
  notifications: "Notifications",
};

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1] ?? "dashboard";
  const title =
    PAGE_TITLES[section] ??
    section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <AdminShell
      navGroups={NAV_GROUPS}
      brandLabel="Super Admin"
      brandHref="/super-admin/dashboard"
      userInitials="SA"
      userName="Super Admin"
      userRole="Platform"
      defaultTitle={PAGE_TITLES[section] ?? "Super Admin"}
      notificationsHref="/super-admin/notifications"
    >
      {children}
    </AdminShell>
  );
}