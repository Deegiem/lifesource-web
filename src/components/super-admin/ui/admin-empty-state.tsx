export function AdminEmptyState({
  title = "Nothing here yet",
  description = "There is no data to display.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-48 items-center justify-center px-6 text-center">
      <div>
        <h2 className="text-sm font-bold text-(--color-admin-text)">{title}</h2>
        <p className="mt-1 text-xs text-(--color-admin-muted)">{description}</p>
      </div>
    </div>
  );
}
