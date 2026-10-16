"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { apiService } from "@/services/api.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{
    size?: number | string;
    strokeWidth?: number;
    className?: string;
  }>;
  badge?: number;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export interface AdminShellProps {
  children: ReactNode;
  navGroups: AdminNavGroup[];
  brandLabel: string;
  brandHref: string;
  userInitials: string;
  userName: string;
  userRole: string;
  defaultTitle: string;
  notificationsHref: string;
  notificationCount?: number;
}

// ---------------------------------------------------------------------------
// Context — pages set title / topRight via hook
// ---------------------------------------------------------------------------

interface AdminShellContextValue {
  setTitle: (title: string) => void;
  setTopRight: (node: ReactNode | null) => void;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export function useAdminPageHeader(options: {
  title?: string;
  topRight?: ReactNode;
}) {
  const ctx = useContext(AdminShellContext);
  if (!ctx) {
    throw new Error(
      "useAdminPageHeader must be used inside an AdminShell. Is your page under the right layout?",
    );
  }

  const { setTitle, setTopRight } = ctx;
  const { title, topRight } = options;

  useEffect(() => {
    if (title) setTitle(title);
  }, [title, setTitle]);

  useEffect(() => {
    setTopRight(topRight ?? null);
    return () => setTopRight(null);
  }, [topRight, setTopRight]);
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export function AdminShell({
  children,
  navGroups,
  brandLabel,
  brandHref,
  userInitials,
  userName,
  userRole,
  defaultTitle,
  notificationsHref,
  notificationCount,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [pageTitle, setPageTitle] = useState(defaultTitle);
  const [topRight, setTopRight] = useState<ReactNode | null>(null);

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setPageTitle(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await apiService.logout();
    } catch {
      // Even if the API call fails, redirect to clear the client session
    } finally {
      router.replace("/login");
    }
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const contextValue: AdminShellContextValue = {
    setTitle: setPageTitle,
    setTopRight,
  };

  const showNotificationBadge =
    typeof notificationCount === "number" && notificationCount > 0;

  const renderNav = (mobile = false) => (
    <nav className="admin-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          <div className="mb-2 px-3 text-[9.5px] font-bold uppercase tracking-widest text-(--color-admin-dim)">
            {group.label}
          </div>
          {group.items.map((item) => {
            const Icon = item.icon;
            const selected = isActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={mobile ? () => setMobileOpen(false) : undefined}
                className={cn(
                  "relative mb-1 flex items-center gap-3 rounded-(--radius-md) px-3",
                  mobile ? "min-h-11" : "min-h-10",
                  "text-sm font-medium transition-colors",
                  selected
                    ? "bg-(--color-admin-accent-soft) text-(--color-admin-text)"
                    : "text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)",
                )}
              >
                {/* Red active-state accent bar */}
                {selected ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-(--color-blood)"
                  />
                ) : null}

                <Icon
                  size={mobile ? 18 : 17}
                  strokeWidth={1.8}
                  className={selected ? "text-(--color-blood)" : undefined}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-(--radius-full) bg-(--color-blood) px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  const renderUserFooter = () => (
    <div className="shrink-0 border-t border-(--color-admin-border) p-3">
      <div className="mb-3 h-px w-full bg-gradient-to-r from-(--color-blood)/60 via-(--color-blood)/20 to-transparent" />

      <div className="flex items-center gap-2.5 rounded-(--radius-md) p-1.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-blood-soft) text-xs font-extrabold text-(--color-blood)">
          {userInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-(--color-admin-text)">
            {userName}
          </p>
          <p className="truncate text-xs text-(--color-admin-muted)">
            {userRole}
          </p>
        </div>
      </div>

      {/* Pronounced logout button */}
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-(--radius-md) border border-(--color-blood)/25 bg-(--color-blood-soft) px-3 py-2 text-xs font-bold text-(--color-blood) transition-colors hover:border-(--color-blood)/50 hover:bg-(--color-blood) hover:text-white disabled:opacity-50"
      >
        <LogOut size={14} />
        {loggingOut ? "Logging out…" : "Log out"}
      </button>
    </div>
  );

  return (
    <AdminShellContext.Provider value={contextValue}>
      <div className="flex h-screen w-full overflow-hidden bg-(--color-admin-page) text-(--color-admin-text)">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-(--color-admin-border) bg-(--color-admin-sidebar) lg:flex">
          <div className="shrink-0 border-b border-(--color-admin-border) px-5 py-5">
            <Link href={brandHref} className="flex items-center gap-2.5">
              {/* Red brand mark */}
              <div className="flex size-9 items-center justify-center rounded-xl bg-(--color-blood) shadow-sm shadow-(--color-blood)/30">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="size-4.5 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M24 5S11 19.2 11 29.2C11 36.9 16.8 43 24 43s13-6.1 13-13.8C37 19.2 24 5 24 5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold tracking-tight text-(--color-text-inverse)">
                  LIFESOURCE
                </div>
                <div className="text-[9.5px] font-bold uppercase tracking-widest text-(--color-admin-muted)">
                  {brandLabel}
                </div>
              </div>
            </Link>
          </div>

          {renderNav(false)}
          {renderUserFooter()}
        </aside>

        {/* Mobile overlay */}
        {mobileOpen ? (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        ) : null}

        {/* Mobile drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[85vw] flex-col border-r border-(--color-admin-border) bg-(--color-admin-sidebar) transition-transform duration-300 ease-out lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-(--color-admin-border) px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-(--color-blood)">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="size-4 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M24 5S11 19.2 11 29.2C11 36.9 16.8 43 24 43s13-6.1 13-13.8C37 19.2 24 5 24 5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight text-(--color-text-inverse)">
                  LIFESOURCE
                </div>
                <div className="text-[9.5px] font-bold uppercase tracking-widest text-(--color-admin-muted)">
                  {brandLabel}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="flex size-9 items-center justify-center rounded-(--radius-md) text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)"
            >
              <X size={18} />
            </button>
          </div>

          {renderNav(true)}
          {renderUserFooter()}
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-(--color-admin-border) bg-(--color-admin-sidebar) px-4 md:px-6">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
              className="rounded-(--radius-md) p-2 text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text) lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-(--color-admin-text)">
                {pageTitle}
              </p>
            </div>

            {topRight ? (
              <div className="flex shrink-0 items-center gap-2">{topRight}</div>
            ) : null}

            <Link
              href={notificationsHref}
              aria-label="Notifications"
              className="relative rounded-(--radius-md) p-2 text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)"
            >
              <Bell size={19} />
              {showNotificationBadge ? (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-blood) px-1 text-[9px] font-bold text-white">
                  {notificationCount! > 9 ? "9+" : notificationCount}
                </span>
              ) : null}
            </Link>

            <div className="hidden h-8 w-px bg-(--color-admin-border) sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-(--color-admin-text)">
                {userName}
              </p>
              <p className="text-[10px] text-(--color-admin-muted)">
                {userRole}
              </p>
            </div>

            {/* Mobile-only logout */}
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              aria-label="Log out"
              title="Log out"
              className="flex size-9 items-center justify-center rounded-(--radius-md) text-(--color-admin-muted) hover:bg-(--color-blood)/15 hover:text-(--color-blood) disabled:opacity-50 lg:hidden"
            >
              <LogOut size={18} />
            </button>
          </header>

          {/* Content */}
          <main className="admin-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-(--container-xl) p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminShellContext.Provider>
  );
}