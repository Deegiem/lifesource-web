import type { InputHTMLAttributes } from "react";

export function AdminSearch({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-(--control-height-sm) w-full rounded-(--radius-md)",
        "border border-(--color-admin-border) bg-(--color-admin-card)",
        "px-3 text-sm text-(--color-admin-text) outline-none",
        "placeholder:text-(--color-admin-muted)",
        "focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
