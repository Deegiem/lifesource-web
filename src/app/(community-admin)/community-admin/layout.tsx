"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  FileClock,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import {
  AdminShell,
  type AdminNavGroup,
} from "@/components/admin/layout/admin-shell";
import { useCANotificationsStore } from "@/stores/community-admin-notifications.store";

const NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/community-admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        id: "members",
        label: "Members",
        href: "/community-admin/members",
        icon: Users,
      },
      {
        id: "join-requests",
        label: "Join Requests",
        href: "/community-admin/join-requests",
        icon: UserPlus,
      },
    ],
  },
  {
    label: "Requests",
    items: [
      {
        id: "requests",
        label: "Community Requests",
        href: "/community-admin/requests",
        icon: ClipboardList,
      },
      {
        id: "escalations",
        label: "Escalations",
        href: "/community-admin/escalations",
        icon: ShieldAlert,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        id: "audit-log",
        label: "Audit Log",
        href: "/community-admin/audit-log",
        icon: FileClock,
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/community-admin/notifications",
        icon: Bell,
      },
      {
        id: "account-security",
        label: "Account Security",
        href: "/account/security",
        icon: ShieldCheck,
      },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  members: "Members",
  "join-requests": "Join Requests",
  requests: "Community Requests",
  escalations: "Escalations",
  "audit-log": "Audit Log",
  notifications: "Notifications",
};

export default function CommunityAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1] ?? "dashboard";

  const defaultTitle =
    PAGE_TITLES[section] ??
    section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Unread count derived from store — returns a primitive, safe for React
  const unreadCount = useCANotificationsStore(
    (s) => s.items.filter((n) => !n.read).length,
  );

  // Gate notifications to after hydration so SSR and first client render match
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const state = useCANotificationsStore.getState();
    if (!state.loadedOnce) {
      void state.loadItems();
    }
  }, [mounted]);

  return (
    <AdminShell
      navGroups={NAV_GROUPS}
      brandLabel="Community Admin"
      brandHref="/community-admin/dashboard"
      userInitials="CA"
      userName="Community Admin"
      userRole="Managing"
      defaultTitle={defaultTitle}
      notificationsHref="/community-admin/notifications"
      notificationCount={mounted ? unreadCount : 0}
    >
      {children}
    </AdminShell>
  );
}