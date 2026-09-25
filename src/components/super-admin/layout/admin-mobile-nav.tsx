"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import { SUPER_ADMIN_NAV } from "@/features/super-admin/constants";

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({
  open,
  onClose,
}: AdminMobileNavProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-(--z-overlay) lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-(--color-overlay)"
      />

      <aside className="relative z-(--z-modal) h-full w-72 max-w-[85vw] border-r border-(--color-admin-border) bg-(--color-admin-sidebar)">
        <div className="flex items-center justify-between border-b border-(--color-admin-border) px-5 py-5">
          <div>
            <div className="text-base font-extrabold text-(--color-text-inverse)">
              LIFESOURCE
            </div>

            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-(--color-admin-muted)">
              Super Admin
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-(--radius-md) p-2 text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft)"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="p-3">
          {SUPER_ADMIN_NAV.map((item) => {
            const href =
              item.id === "dashboard"
                ? "/super-admin/dashboard"
                : `/super-admin/${item.id}`;

            const selected =
              item.id === "dashboard"
                ? pathname === href
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.id}
                href={href}
                onClick={onClose}
                className={[
                  "mb-1 flex items-center rounded-(--radius-md) px-3 py-3 text-sm font-medium",
                  selected
                    ? "bg-(--color-admin-accent-soft) text-(--color-admin-text)"
                    : "text-(--color-admin-muted)",
                ].join(" ")}
              >
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
      </aside>
    </div>
  );
}