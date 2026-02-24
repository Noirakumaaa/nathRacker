import { get, post } from "component/fetchComponent";
import type { PcnFormFields } from "~/types/pcnTypes";
import type { PcnRecord } from "./../types/pcnTypes";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";
import { Loader2, InboxIcon, Copy } from "lucide-react";

// ── Encoded badge ─────────────────────────────────────────────────────────────
function EncodedBadge({ value }: { value: string }) {
  const cls =
    value === "YES"     ? "bg-emerald-50 text-emerald-600" :
    value === "NO"      ? "bg-red-50 text-red-500" :
    value === "UPDATED" ? "bg-blue-50 text-blue-600" :
                          "bg-[#f5f5f2] text-[#8a8a80]";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {value || "—"}
    </span>
  );
}


// ── PCN Recent Table ──────────────────────────────────────────────────────────
export function PcnRecentTable({
  newData,
  onLoad,
}: {
  newData: boolean;
  onLoad: (record: PcnFormFields) => void;
}) {
  const { data: records = [], isLoading, refetch } = useQuery<PcnRecord[]>({
    queryKey: ["recentPcn"],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/pcn/UserRecent`);
      return data as PcnRecord[];
    },
  });

  useEffect(() => {
    if (newData) refetch();
  }, [newData]);

  const COLS = [
    "HH ID", "Grantee", "LGU", "Barangay",
    "Subject", "PCN", "TR", "Remarks",
    "DRN", "CL", "Date", "Note", "",
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e8e8e0] mt-2 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Recent Updates</p>
        {records.length > 0 && (
          <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
            {records.length} record{records.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-[#fafaf8] border-b border-[#e8e8e0]">
            <tr>
              {COLS.map((h) => (
                <th key={h} className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5f5f2]">
            {isLoading ? (
              <tr>
                <td colSpan={COLS.length} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#c4c4b8]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[12px]">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-[#8a8a80]">No recent updates found</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr key={r.id} className={`hover:bg-rose-50/20 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}>
                  {/* HH ID */}
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 group">
                      <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">{r.hhId}</span>
                      <button onClick={() => navigator.clipboard.writeText(r.hhId)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none" title="Copy HH ID">
                        <Copy size={11} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">{r.granteeName || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">{r.lgu || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">{r.barangay || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] max-w-[120px] truncate">{r.subjectOfChange || <span className="text-[#d4d4cc]">—</span>}</td>
                  {/* PCN chip */}
                  <td className="px-4 py-2.5 text-center">
                    <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 tracking-wider whitespace-nowrap">
                      {r.pcn || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.tr || <span className="text-[#d4d4cc] font-sans">—</span>}</td>
                  <td className="px-4 py-2.5 text-center"><EncodedBadge value={r.remarks} /></td>
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.drn || <span className="text-[#d4d4cc] font-sans">—</span>}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.cl || <span className="text-[#d4d4cc] font-sans">—</span>}</td>
                  <td className="px-4 py-2.5 text-center text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
                    {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] max-w-[100px] truncate">{r.note || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => onLoad(r)}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}