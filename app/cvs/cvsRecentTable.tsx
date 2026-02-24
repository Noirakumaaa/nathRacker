import { get } from "component/fetchComponent";
import type { CvsRecord, CvsFormFields } from "~/types/cvsTypes";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Loader2, InboxIcon, Copy, ArrowUpRight } from "lucide-react";

// ── Remarks badge ─────────────────────────────────────────────────────────────
function RemarksBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    DONE:          "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    PENDING:       "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    "FOR REVIEW":  "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
    RETURNED:      "bg-red-50 text-red-500 ring-1 ring-red-100",
  };
  const cls = map[value] ?? "bg-[#f5f5f2] text-[#8a8a80]";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${cls}`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-70" />
      {value || "—"}
    </span>
  );
}

// ── Form Type chip ────────────────────────────────────────────────────────────
function FormTypeChip({ value }: { value: string }) {
  return (
    <span className="inline-block font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-violet-50 text-violet-600 tracking-wider whitespace-nowrap">
      {value || "—"}
    </span>
  );
}

// ── CVS Recent Table ──────────────────────────────────────────────────────────
export function CvsRecentTable({
  newData,
  onLoad,
}: {
  newData: boolean;
  onLoad: (record: CvsFormFields) => void;
}) {
  const { data: records = [], isLoading, refetch } = useQuery<CvsRecord[]>({
    queryKey: ["recentCvs"],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/cvs/UserRecent`);
      return data as CvsRecord[];
    },
  });

  useEffect(() => {
    if (newData) refetch();
  }, [newData]);

  const COLS = ["ID Number", "LGU", "Barangay", "Facility Name", "Form Type", "Remarks", "Date", ""];

  return (
    <div className="bg-white rounded-xl border border-[#e8e8e0] mt-2 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Recent Updates</p>
          {!isLoading && records.length > 0 && (
            <span className="text-[10px] font-mono bg-violet-50 text-violet-500 px-2 py-0.5 rounded-full">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {!isLoading && records.length > 0 && (
          <span className="text-[11px] text-[#c4c4b8] font-mono">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-[#fafaf8] border-b border-[#e8e8e0]">
            <tr>
              {COLS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-semibold text-[#b0b0a8] uppercase tracking-widest whitespace-nowrap first:pl-6 last:pr-6"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5f5f2]">
            {isLoading ? (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#c4c4b8]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[12px]">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-[#8a8a80]">No recent updates found</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr
                  key={r.id}
                  className={`group hover:bg-[#fafaf8] transition-colors duration-100 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#fdfdfc]"
                  }`}
                >
                  {/* ID Number */}
                  <td className="pl-6 pr-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-medium text-[#1a1a18] whitespace-nowrap">
                        {r.idNumber}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(String(r.idNumber))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none p-0"
                        title="Copy ID Number"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                  </td>

                  {/* LGU */}
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6a6a60] whitespace-nowrap">
                      {r.lgu || <span className="text-[#d4d4cc]">—</span>}
                    </span>
                  </td>

                  {/* Barangay */}
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6a6a60] whitespace-nowrap">
                      {r.barangay || <span className="text-[#d4d4cc]">—</span>}
                    </span>
                  </td>

                  {/* Facility Name */}
                  <td className="px-4 py-3 max-w-[160px]">
                    <span className="text-[12px] font-medium text-[#1a1a18] truncate block whitespace-nowrap">
                      {r.facilityName || <span className="font-normal text-[#d4d4cc]">—</span>}
                    </span>
                  </td>

                  {/* Form Type */}
                  <td className="px-4 py-3">
                    <FormTypeChip value={r.formType} />
                  </td>

                  {/* Remarks */}
                  <td className="px-4 py-3">
                    <RemarksBadge value={r.remarks} />
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Load */}
                  <td className="pl-4 pr-6 py-3">
                    <button
                      onClick={() => onLoad(r)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8a8a80] hover:text-[#1a1a18] transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100"
                    >
                      Load <ArrowUpRight size={11} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!isLoading && records.length > 0 && (
        <div className="px-6 py-3 border-t border-[#f0f0ec] bg-[#fafaf8]">
          <p className="text-[11px] text-[#b0b0a8]">
            Showing {records.length} most recent record{records.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}