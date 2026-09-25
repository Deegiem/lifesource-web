import type { SelectHTMLAttributes } from "react";

export function AdminFilter({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={[
        "h-(--control-height-sm) rounded-(--radius-md)",
        "border border-(--color-admin-border) bg-(--color-admin-card)",
        "px-3 text-sm text-(--color-admin-text) outline-none",
        "focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
