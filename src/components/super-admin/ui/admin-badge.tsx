import type { AdminStatus } from "@/features/super-admin/types";

const styles: Record<AdminStatus, string> = {
  active: "bg-(--color-admin-success-soft) text-[#4ade80]",
  inactive: "bg-(--color-admin-dim) text-(--color-admin-muted)",
  open: "bg-(--color-admin-accent-soft) text-[#60a5fa]",
  fulfilled: "bg-(--color-admin-success-soft) text-[#4ade80]",
  pending: "bg-(--color-admin-warning-soft) text-[#fbbf24]",
  approved: "bg-(--color-admin-success-soft) text-[#4ade80]",
  rejected: "bg-(--color-admin-danger-soft) text-[#f87171]",
  suspended: "bg-(--color-admin-warning-soft) text-[#fbbf24]",
  banned: "bg-(--color-admin-danger-soft) text-[#f87171]",
  escalated: "bg-(--color-admin-warning-soft) text-[#fbbf24]",
  sent: "bg-(--color-admin-success-soft) text-[#4ade80]",
  failed: "bg-(--color-admin-danger-soft) text-[#f87171]",
  confirmed: "bg-(--color-admin-success-soft) text-[#4ade80]",
};

const labels: Record<AdminStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  open: "Open",
  fulfilled: "Fulfilled",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
  banned: "Banned",
  escalated: "Escalated",
  sent: "Sent",
  failed: "Failed",
  confirmed: "Confirmed",
};

export function AdminBadge({ status }: { status: AdminStatus }) {
  return (
    <span
      className={[
        "inline-flex rounded-(--radius-full) px-2.5 py-1",
        "text-[10px] font-bold uppercase tracking-wide",
        styles[status],
      ].join(" ")}
    >
      {labels[status]}
    </span>
  );
}
