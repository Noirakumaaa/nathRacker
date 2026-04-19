import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";
import APIFETCH from "~/lib/axios/axiosConfig";
import { TableSkeleton } from "~/components/Skeleton";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ColumnDef<T> = {
  header: string;
  accessor?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type RecentTableProps<T extends { id: string | number }> = {
  queryKey: string;
  endpoint: string;
  columns: ColumnDef<T>[];
  title?: string;
  maxHeight?: string;
  rowClassName?: (row: T, index: number) => string;
  headerRight?: (records: T[]) => React.ReactNode;
  headerLeft?: (records: T[]) => React.ReactNode;
  footer?: (records: T[]) => React.ReactNode;
};

// ── Row ───────────────────────────────────────────────────────────────────────

type RowProps<T extends { id: string | number }> = {
  row: T;
  index: number;
  columns: ColumnDef<T>[];
  rowClassName?: (row: T, index: number) => string;
};

function TableRowInner<T extends { id: string | number }>({
  row,
  index,
  columns,
  rowClassName,
}: RowProps<T>) {
  return (
    <tr
      className={
        rowClassName
          ? rowClassName(row, index)
          : `hover:bg-amber-50/20 transition-colors duration-100 ${
              index % 2 === 0 ? "bg-(--color-surface)" : "bg-(--color-bg)"
            }`
      }
    >
      {columns.map((col) => (
        <td
          key={col.header}
          className={`px-4 py-2.5 text-center text-[12px] text-(--color-muted) ${col.className ?? ""}`}
        >
          {col.cell
            ? col.cell(row, index)
            : col.accessor
            ? String(row[col.accessor] ?? "—")
            : "—"}
        </td>
      ))}
    </tr>
  );
}

const TableRow = memo(TableRowInner) as typeof TableRowInner;

// ── Component ─────────────────────────────────────────────────────────────────

function RecentTableComponent<T extends { id: string | number }>({
  queryKey,
  endpoint,
  columns,
  title = "Recent Updates",
  maxHeight = "calc(100vh - 780px)",
  rowClassName,
  headerRight,
  headerLeft,
  footer,
}: RecentTableProps<T>) {
  const { data: records = [], isLoading } = useQuery<T[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await APIFETCH.get(endpoint);
      return res.data as T[];
    },
  });

  return (
    <div className="bg-(--color-surface) rounded-xl border border-(--color-border) mt-2 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        {headerLeft ? (
          headerLeft(records)
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">{title}</p>
            {!isLoading && records.length > 0 && (
              <span className="text-[11px] font-mono bg-(--color-subtle) text-(--color-muted) px-2.5 py-1 rounded-full">
                {records.length} record{records.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
        {headerRight ? headerRight(records) : null}
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight, minHeight: "220px" }}>
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-(--color-bg) border-b border-(--color-border)">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-[10px] font-semibold text-(--color-muted) uppercase tracking-widest whitespace-nowrap ${col.headerClassName ?? "text-center"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-(--color-subtle)">
            {isLoading ? (
              <TableSkeleton rows={6} cols={columns.length} />
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-(--color-muted)">No recent updates found</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((row, i) => (
                <TableRow
                  key={row.id}
                  row={row}
                  index={i}
                  columns={columns}
                  rowClassName={rowClassName}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {footer && !isLoading && records.length > 0 && footer(records)}
    </div>
  );
}

export default memo(RecentTableComponent) as typeof RecentTableComponent;
