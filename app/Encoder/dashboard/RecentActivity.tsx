import { Clock, Copy, Loader2, InboxIcon } from "lucide-react";
import type { RecentEntry } from "~/types/dashboardTypes";
import { moduleStyle, encodedStyle } from "component/styleConfig";

export function RecentActivity({
  recentAll,
  isLoading,
}: {
  recentAll: RecentEntry[];
  isLoading: boolean;
}) {
  return (
    <div className="bg-white border border-[#e8e8e0] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#8a8a80]" />
          <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
            Recent Activity
          </p>
        </div>
        <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
          {recentAll.length} entries
        </span>
      </div>
      <div className="overflow-y-auto max-h-90">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#c4c4b8]">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-[12px]">Loading activity…</span>
          </div>
        ) : recentAll.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <InboxIcon size={22} className="text-[#d4d4cc]" />
            <span className="text-[12px] text-[#8a8a80]">
              No recent activity
            </span>
          </div>
        ) : (
          <table className="min-w-full text-xs">
            <thead className="bg-[#fafaf8] border-b border-[#e8e8e0] sticky top-0">
              <tr>
                {["Module", "HH ID", "Grantee", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f2]">
              {recentAll.map((entry, i) => (
                <tr
                  key={`${entry.documentType}-${entry.id}`}
                  className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}
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
                      <span className="font-mono text-[11px] text-[#1a1a18]">
                        {entry.idNumber}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(entry.idNumber)
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-[#1a1a18] max-w-35 truncate">
                    {entry.name ?? <span className="text-[#d4d4cc]">—</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${encodedStyle(entry.remarks ?? entry.encoded)}`}
                    >
                      {entry.remarks ?? entry.encoded ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
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
}
