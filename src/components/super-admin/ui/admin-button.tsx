import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  size?: "sm" | "md";
  children: ReactNode;
}

const variants: Record<AdminButtonVariant, string> = {
  primary:
    "bg-(--color-admin-accent) text-(--color-text-inverse) hover:opacity-90",
  secondary:
    "border border-(--color-admin-border) bg-transparent text-(--color-admin-text) hover:bg-(--color-admin-accent-soft)",
  ghost:
    "bg-transparent text-(--color-admin-muted) hover:bg-(--color-admin-accent-soft) hover:text-(--color-admin-text)",
  danger:
    "border border-(--color-danger) bg-(--color-admin-danger-soft) text-[#f87171] hover:opacity-90",
};

export function AdminButton({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-(--radius-md) font-semibold transition-opacity",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "min-h-(--control-height-sm) px-3 text-xs" : "min-h-(--control-height-md) px-4 text-sm",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
