import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Loader2, InboxIcon } from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function RecentTable<T extends { id: string | number }>({
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

const { data: records = [], isLoading, refetch } = useQuery<T[]>({
  queryKey: [queryKey],
  queryFn: async () => {
    const res = await APIFETCH.get(endpoint);
    return res.data as T[];
  },
});


  return (
    <div className="bg-white rounded-xl border border-[#e8e8e0] mt-2 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        {headerLeft ? (
          headerLeft(records)
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">{title}</p>
            {!isLoading && records.length > 0 && (
              <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
                {records.length} record{records.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
        {headerRight ? headerRight(records) : null}
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight, minHeight: '220px' }}>
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-[#fafaf8] border-b border-[#e8e8e0]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap ${col.headerClassName ?? "text-center"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5f5f2]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#c4c4b8]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[12px]">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-[#8a8a80]">No recent updates found</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((row, i) => (
                <tr
                  key={row.id}
                  className={
                    rowClassName
                      ? rowClassName(row, i)
                      : `hover:bg-amber-50/20 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`px-4 py-2.5 text-center text-[12px] text-[#8a8a80] ${col.className ?? ""}`}
                    >
                      {col.cell
                        ? col.cell(row, i)
                        : col.accessor
                        ? String(row[col.accessor] ?? "—")
                        : "—"}
                    </td>
                  ))}
                </tr>
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