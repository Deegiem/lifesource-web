"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  Plus,
  Menu,
  X,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";

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
    ? "flex min-h-11 items-center rounded-(--radius-md) px-3 text-sm font-medium"
    : "flex min-h-10 items-center rounded-(--radius-md) px-3 text-sm font-medium";

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
            <Icon className="size-4 shrink-0" />
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
              <GroupIcon className="size-4 shrink-0" />
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
                      <span className="size-1.5 shrink-0 rounded-full bg-current opacity-50" />
                      <span className="flex-1">{child.label}</span>
                      {ChildIcon ? <ChildIcon className="size-3.5 shrink-0" /> : null}
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

export function RoleDashboardShell({ role, children }: RoleDashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer whenever the route changes
  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-(--color-surface-page)">
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-(--color-border-subtle) bg-(--color-surface-card) lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-(--color-border-subtle) px-6">
          <span className="font-(--font-heading) text-lg font-extrabold tracking-tight text-(--color-brand-primary)">
            LIFESOURCE
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <RoleNavigation role={role} />
        </div>
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
          <span className="font-(--font-heading) text-lg font-extrabold tracking-tight text-(--color-brand-primary)">
            LIFESOURCE
          </span>

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
        </header>

        <main className="min-h-screen p-5 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}