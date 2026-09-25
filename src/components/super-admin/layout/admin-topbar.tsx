"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";

interface AdminTopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-(--color-admin-border) bg-(--color-admin-sidebar) px-4 md:px-6">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={onMenuClick}
        className="rounded-(--radius-md) p-2 text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text) lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-(--color-admin-text)">
          {title}
        </p>
      </div>

      <Link
        href="/super-admin/notifications"
        aria-label="Notifications"
        className="relative rounded-(--radius-md) p-2 text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)"
      >
        <Bell size={19} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-(--color-blood)" />
      </Link>

      <div className="hidden h-8 w-px bg-(--color-admin-border) sm:block" />

      <div className="hidden text-right sm:block">
        <p className="text-xs font-semibold text-(--color-admin-text)">Super Admin</p>
        <p className="text-[10px] text-(--color-admin-muted)">Platform</p>
      </div>
    </header>
  );
}
