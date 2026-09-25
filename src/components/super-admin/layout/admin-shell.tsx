"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  requests: "Platform Requests",
  communities: "Communities",
  users: "User Management",
  "community-admins": "Community Admins",
  hospitals: "Hospitals",
  overrides: "Override Requests",
  "audit-log": "Audit Log",
  settings: "Platform Settings",
  notifications: "Notifications",
};

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const section = segments[1] ?? "dashboard";

  const title =
    PAGE_TITLES[section] ??
    section
      .replace(/-/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <div className="h-screen overflow-hidden bg-(--color-admin-page) text-(--color-admin-text)">
      <div className="flex h-full">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar
            title={title}
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <main className="admin-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-(--container-xl) p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      <AdminMobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </div>
  );
}