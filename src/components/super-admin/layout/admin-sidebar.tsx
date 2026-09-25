"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  FileClock,
  Hospital,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
  UsersRound,
} from "lucide-react";

import { SUPER_ADMIN_NAV } from "@/features/super-admin/constants";

const icons = {
  dashboard: LayoutDashboard,
  requests: ClipboardList,
  users: Users,
  communities: UsersRound,
  hospitals: Hospital,
  overrides: ShieldAlert,
  "audit-log": FileClock,
  settings: Settings,
  notifications: Bell,
} as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-(--color-admin-border) bg-(--color-admin-sidebar) lg:flex">
      <div className="shrink-0 border-b border-(--color-admin-border) px-5 py-5">
        <Link href="/super-admin/dashboard" className="block">
          <div className="text-base font-extrabold tracking-tight text-(--color-text-inverse)">
            LIFESOURCE
          </div>

          <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-(--color-admin-muted)">
            Super Admin
          </div>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {SUPER_ADMIN_NAV.map((item) => {
          const href =
            item.id === "dashboard"
              ? "/super-admin/dashboard"
              : `/super-admin/${item.id}`;

          const selected =
            item.id === "dashboard"
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          const Icon = icons[item.id];

          return (
            <Link
              key={item.id}
              href={href}
              className={[
                "mb-1 flex min-h-10 items-center gap-3 rounded-(--radius-md) px-3",
                "text-sm font-medium transition-colors",
                selected
                  ? "bg-(--color-admin-accent-soft) text-(--color-admin-text)"
                  : "text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={1.8} />

              <span>{item.label}</span>

              {item.id === "overrides" ? (
                <span className="ml-auto rounded-(--radius-full) bg-(--color-danger) px-1.5 py-0.5 text-[9px] font-bold text-white">
                  3
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-(--color-admin-border) p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-admin-accent-soft) text-xs font-extrabold text-(--color-admin-accent)">
            SA
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-(--color-admin-text)">
              Super Admin
            </p>

            <p className="text-xs text-(--color-admin-muted)">
              Platform
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}