import type { ReactNode } from "react";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
}: AdminDataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 border-collapse">
        <thead>
          <tr className="bg-(--color-admin-sidebar)">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-b border-(--color-admin-border) px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-(--color-admin-muted)"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={[
                "border-b border-(--color-admin-border)/20",
                onRowClick
                  ? "cursor-pointer hover:bg-(--color-admin-accent-soft)"
                  : "",
              ].join(" ")}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-sm align-middle text-(--color-admin-text)"
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
