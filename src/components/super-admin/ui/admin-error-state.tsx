import { AdminButton } from "./admin-button";

export function AdminErrorState({
  message = "Unable to load this information.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-48 items-center justify-center px-6 text-center">
      <div>
        <h2 className="text-sm font-bold text-[#f87171]">Something went wrong</h2>
        <p className="mt-1 text-xs text-(--color-admin-muted)">{message}</p>
        {onRetry ? (
          <AdminButton size="sm" className="mt-4" onClick={onRetry}>
            Try again
          </AdminButton>
        ) : null}
      </div>
    </div>
  );
}
