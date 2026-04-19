import { memo } from "react";
import { Clock, Copy, InboxIcon } from "lucide-react";
import type { RecentEntry } from "~/types/dashboardTypes";
import { moduleStyle, encodedStyle } from "~/components/styleConfig";
import { TableRowSkeleton } from "~/components/Skeleton";

export const RecentActivity = memo(function RecentActivity({
  recentAll,
  isLoading,
}: {
  recentAll: RecentEntry[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-(--color-muted)" />
          <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
            Recent Activity
          </p>
        </div>
        <span className="text-[11px] font-mono bg-(--color-subtle) text-(--color-muted) px-2.5 py-1 rounded-full">
          {recentAll.length} entries
        </span>
      </div>
      <div className="overflow-y-auto max-h-90">
        {isLoading ? (
          <table className="min-w-full text-xs">
            <thead className="bg-(--color-bg) border-b border-(--color-border)">
              <tr>
                {["Module", "HH ID", "Grantee", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-(--color-muted) uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-subtle)">
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={5} />
              ))}
            </tbody>
          </table>
        ) : recentAll.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <InboxIcon size={22} className="text-[#d4d4cc]" />
            <span className="text-[12px] text-(--color-muted)">
              No recent activity
            </span>
          </div>
        ) : (
          <table className="min-w-full text-xs">
            <thead className="bg-(--color-bg) border-b border-(--color-border) sticky top-0">
              <tr>
                {["Module", "HH ID", "Grantee", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-semibold text-(--color-muted) uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-subtle)">
              {recentAll.map((entry, i) => (
                <tr
                  key={`${entry.documentType}-${entry.id}`}
                  className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? "bg-(--color-surface)" : "bg-(--color-bg)"}`}
                >
                  <td className="px-4 py-2.5">
                    <span
                      className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wider ${moduleStyle[entry.documentType]}`}
                    >
                      {entry.documentType}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 group">
                      <span className="font-mono text-[11px] text-(--color-ink)">
                        {entry.idNumber}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(entry.idNumber)
                        }
                        aria-label="Copy HH ID"
                        title="Copy HH ID"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-(--color-placeholder) hover:text-(--color-muted) cursor-pointer bg-transparent border-none"
                      >
                        <Copy size={10} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-(--color-ink) max-w-35 truncate">
                    {entry.name ?? <span className="text-[#d4d4cc]">—</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${encodedStyle(entry.remarks ?? entry.encoded)}`}
                    >
                      {entry.remarks ?? entry.encoded ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-(--color-muted) whitespace-nowrap tabular-nums">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});
