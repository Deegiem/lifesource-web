type NotificationStatus = "sent" | "scheduled" | "draft" | "failed";

const styles: Record<NotificationStatus, string> = {
  sent: "bg-(--color-success-soft) text-(--color-success)",
  scheduled: "bg-(--color-info-soft) text-(--color-info)",
  draft: "bg-(--color-surface-subtle) text-(--color-text-muted)",
  failed: "bg-(--color-danger-soft) text-(--color-danger)",
};

const labels: Record<NotificationStatus, string> = {
  sent: "Sent",
  scheduled: "Scheduled",
  draft: "Draft",
  failed: "Failed",
};

export function NotificationBadge({ status }: { status: NotificationStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}