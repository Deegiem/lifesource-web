import type { ReactNode } from "react";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
}

export function AdminCard({ children, className = "" }: AdminCardProps) {
  return (
    <section
      className={[
        "rounded-(--radius-lg) border border-(--color-admin-border)",
        "bg-(--color-admin-card)",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
