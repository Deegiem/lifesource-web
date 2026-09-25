import { AdminButton } from "./admin-button";

interface AdminPaginationProps {
  showing: number;
  total: number;
  page: number;
  totalPages: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function AdminPagination({
  showing,
  total,
  page,
  totalPages,
  onPrevious,
  onNext,
}: AdminPaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-(--color-admin-border) px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-(--color-admin-muted)">
        Showing {showing} of {total}
      </span>

      <div className="flex items-center gap-2">
        <AdminButton
          size="sm"
          onClick={onPrevious}
          disabled={!onPrevious || page <= 1}
        >
          Previous
        </AdminButton>

        <span className="min-w-12 text-center text-xs text-(--color-admin-muted)">
          {page} / {totalPages}
        </span>

        <AdminButton
          size="sm"
          onClick={onNext}
          disabled={!onNext || page >= totalPages}
        >
          Next
        </AdminButton>
      </div>
    </div>
  );
}
