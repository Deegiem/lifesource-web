import type { ReactNode } from "react";

export function AdminInfoRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-(--color-admin-border)/20 py-3 last:border-b-0">
      <span className="min-w-28 shrink-0 text-xs text-(--color-admin-muted)">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-(--color-admin-text)">
        {value}
      </span>
    </div>
  );
}
