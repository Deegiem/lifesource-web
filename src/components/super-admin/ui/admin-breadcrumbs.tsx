import type { ReactNode } from "react";

export interface AdminBreadcrumb {
  label: string;
  href?: string;
}

interface AdminBreadcrumbsProps {
  items: AdminBreadcrumb[];
  separator?: ReactNode;
}

export function AdminBreadcrumbs({
  items,
  separator = "/",
}: AdminBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex flex-wrap items-center gap-2 text-xs text-(--color-admin-muted)"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="text-(--color-admin-dim)">{separator}</span>
          ) : null}

          {item.href ? (
            <a
              href={item.href}
              className="text-(--color-admin-accent) hover:underline"
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
