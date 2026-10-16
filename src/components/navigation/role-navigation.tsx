"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Plus,
  Menu,
  X,
  UserCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { apiService } from "@/services/api.service";

interface NavigationChild {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
}

interface NavigationGroup {
  label: string;
  id: string;
  icon: ComponentType<{ className?: string }>;
  children: NavigationChild[];
}

interface NavigationItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const standaloneByRole = {
  communityMember: [
    {
      label: "Dashboard",
      href: "/community/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Cooldown",
      href: "/community/cooldown",
      icon: Clock3,
    },
    {
      label: "Account security",
      href: "/account/security",
      icon: ShieldCheck,
    },
  ],
  donor: [
    {
      label: "Dashboard",
      href: "/donor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Cooldown",
      href: "/donor/cooldown",
      icon: Clock3,
    },
    {
      label: "Account security",
      href: "/account/security",
      icon: ShieldCheck,
    },
    {
      label: "Profile",
      href: "/donor/profile",
      icon: UserCircle,
    },
  ],
} satisfies Record<"communityMember" | "donor", NavigationItem[]>;

const groupsByRole = {
  communityMember: [
    {
      id: "blood-requests",
      label: "Blood Requests",
      icon: ClipboardList,
      children: [
        {
          label: "My Blood Requests",
          href: "/community/requests",
        },
        {
          label: "Create Blood Request",
          href: "/community/requests/new",
          icon: Plus,
        },
      ],
    },
  ],
  donor: [
    {
      id: "blood-requests",
      label: "Blood Requests",
      icon: ClipboardList,
      children: [
        {
          label: "Open Requests",
          href: "/donor/requests",
          icon: Search,
        },
        {
          label: "My Accepted Requests",
          href: "/donor/accepted",
        },
      ],
    },
  ],
} satisfies Record<"communityMember" | "donor", NavigationGroup[]>;

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, group: NavigationGroup) {
  return group.children.some((child) => isRouteActive(pathname, child.href));
}

interface RoleNavigationProps {
  role: "communityMember" | "donor";
  onNavigate?: () => void;
  mobile?: boolean;
}

export function RoleNavigation({
  role,
  onNavigate,
  mobile = false,
}: RoleNavigationProps) {
  const pathname = usePathname();
  const groups = useMemo(() => groupsByRole[role], [role]);
  const standalone = useMemo(() => standaloneByRole[role], [role]);

  const activeGroupIds = useMemo(
    () =>
      new Set(
        groups
          .filter((group) => isGroupActive(pathname, group))
          .map((group) => group.id),
      ),
    [groups, pathname],
  );

  const [openGroups, setOpenGroups] = useState<Set<string>>(activeGroupIds);

  useEffect(() => {
    // This route synchronization intentionally opens the groups containing the active page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenGroups((current) => {
      const next = new Set(current);
      activeGroupIds.forEach((id) => next.add(id));
      return next;
    });
  }, [activeGroupIds]);

  function toggleGroup(groupId: string) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }

  const linkBase = mobile
    ? "relative flex min-h-11 items-center rounded-(--radius-md) px-3 text-sm font-medium"
    : "relative flex min-h-10 items-center rounded-(--radius-md) px-3 text-sm font-medium";

  return (
    <nav className="space-y-1">
      {standalone.map((item) => {
        const active = isRouteActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              linkBase,
              "gap-3 transition-colors",
              active
                ? "bg-(--color-brand-primary-soft) text-(--color-brand-primary)"
                : "text-(--color-text-secondary) hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)",
            )}
          >
            {active ? (
              <span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-(--color-blood)"
              />
            ) : null}
            <Icon
              className={cn("size-4 shrink-0", active && "text-(--color-blood)")}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {groups.map((group) => {
        const GroupIcon = group.icon;
        const active = isGroupActive(pathname, group);
        const open = openGroups.has(group.id);

        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={open}
              className={cn(
                linkBase,
                "w-full gap-3 text-left transition-colors",
                active
                  ? "bg-(--color-brand-primary-soft) text-(--color-brand-primary)"
                  : "text-(--color-text-secondary) hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)",
              )}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-(--color-blood)"
                />
              ) : null}
              <GroupIcon
                className={cn(
                  "size-4 shrink-0",
                  active && "text-(--color-blood)",
                )}
              />
              <span className="flex-1">{group.label}</span>
              {open ? (
                <ChevronDown className="size-4 shrink-0" />
              ) : (
                <ChevronRight className="size-4 shrink-0" />
              )}
            </button>

            {open ? (
              <div className="ml-4 mt-1 space-y-1 border-l border-(--color-border-subtle) pl-3">
                {group.children.map((child) => {
                  const childActive = isRouteActive(pathname, child.href);
                  const ChildIcon = child.icon;

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex min-h-9 items-center gap-2 rounded-(--radius-md) px-3 text-sm transition-colors",
                        childActive
                          ? "bg-(--color-brand-primary-soft) font-semibold text-(--color-brand-primary)"
                          : "text-(--color-text-secondary) hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          childActive ? "bg-(--color-blood)" : "bg-current opacity-50",
                        )}
                      />
                      <span className="flex-1">{child.label}</span>
                      {ChildIcon ? (
                        <ChildIcon className="size-3.5 shrink-0" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Dashboard shell — sidebar + mobile drawer + main content area
// ---------------------------------------------------------------------------

interface RoleDashboardShellProps {
  role: "communityMember" | "donor";
  children: React.ReactNode;
}

export function RoleDashboardShell({
  role,
  children,
}: RoleDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Close drawer whenever the route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Close drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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

  const renderUserFooter = () => (
    <div className="shrink-0 border-t border-(--color-border-subtle) p-3">
      <div className="mb-3 h-px w-full bg-gradient-to-r from-(--color-blood)/60 via-(--color-blood)/20 to-transparent" />

      <div className="flex items-center gap-2.5 rounded-(--radius-md) p-1.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-blood-soft) text-xs font-extrabold text-(--color-blood)">
          {role === "donor" ? "DN" : "CM"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-(--color-text-primary)">
            {role === "donor" ? "Donor" : "Community member"}
          </p>
          <p className="truncate text-xs text-(--color-text-muted)">
            LIFESOURCE
          </p>
        </div>
      </div>

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
    <div className="min-h-screen bg-(--color-surface-page)">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-(--color-border-subtle) bg-(--color-surface-card) lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2.5 border-b border-(--color-border-subtle) px-6">
          {/* Red brand mark */}
          <div className="flex size-8 items-center justify-center rounded-lg bg-(--color-blood) shadow-sm shadow-(--color-blood)/30">
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
          <span className="font-(--font-heading) text-base font-extrabold tracking-tight text-(--color-brand-primary)">
            LIFESOURCE
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <RoleNavigation role={role} />
        </div>

        {renderUserFooter()}
      </aside>

      {/* ---------- Mobile drawer overlay ---------- */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* ---------- Mobile drawer panel ---------- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-(--color-border-subtle) bg-(--color-surface-card) transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-(--color-border-subtle) px-5">
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
            <span className="font-(--font-heading) text-base font-extrabold tracking-tight text-(--color-brand-primary)">
              LIFESOURCE
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="flex size-9 items-center justify-center rounded-(--radius-md) text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <RoleNavigation
            role={role}
            mobile
            onNavigate={() => setMobileOpen(false)}
          />
        </div>

        {renderUserFooter()}
      </aside>

      {/* ---------- Main content ---------- */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-(--color-border-subtle) bg-(--color-surface-card)/90 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex size-9 items-center justify-center rounded-(--radius-md) text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-subtle) hover:text-(--color-text-primary)"
          >
            <Menu className="size-5" />
          </button>

          <span className="font-(--font-heading) text-sm font-extrabold tracking-tight text-(--color-brand-primary)">
            LIFESOURCE
          </span>

          {/* Mobile-only logout */}
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
            aria-label="Log out"
            title="Log out"
            className="ml-auto flex size-9 items-center justify-center rounded-(--radius-md) text-(--color-text-muted) transition-colors hover:bg-(--color-blood-soft) hover:text-(--color-blood) disabled:opacity-50"
          >
            <LogOut className="size-5" />
          </button>
        </header>

        <main className="min-h-screen p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}