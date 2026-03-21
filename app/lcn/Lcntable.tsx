import { Copy } from "lucide-react";
import RecentTable from "./../../component/recentTables";
import type { ColumnDef } from "./../../component/recentTables";
import type { PcnRecord, PcnFormFields } from "./../types/pcnTypes";

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

const buildColumns = (onLoad: (record: PcnFormFields) => void): ColumnDef<PcnRecord>[] => [
  {
    header: "HH ID",
    cell: (r) => (
      <div className="flex items-center justify-center gap-1.5 group">
        <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">{r.hhId}</span>
        <button
          onClick={() => navigator.clipboard.writeText(r.hhId)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none"
          title="Copy HH ID"
        >
          <Copy size={11} />
        </button>
      </div>
    ),
  },
  {
    header: "Grantee",
    cell: (r) => <span className="text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">{r.granteeName || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "LGU",
    cell: (r) => <span className="text-[12px] text-[#8a8a80] whitespace-nowrap">{r.lgu || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "Barangay",
    cell: (r) => <span className="text-[12px] text-[#8a8a80] whitespace-nowrap">{r.barangay || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "Subject",
    className: "max-w-[120px] truncate",
    cell: (r) => <span className="text-[12px] text-[#8a8a80]">{r.subjectOfChange || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "PCN",
    cell: (r) => (
      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 tracking-wider whitespace-nowrap">
        {r.pcn || "—"}
      </span>
    ),
  },
  {
    header: "TR",
    cell: (r) => <span className="font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.lrn || <span className="text-[#d4d4cc] font-sans">—</span>}</span>,
  },
  {
    header: "Remarks",
    cell: (r) => <EncodedBadge value={r.remarks} />,
  },
  {
    header: "DRN",
    cell: (r) => <span className="font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.drn || <span className="text-[#d4d4cc] font-sans">—</span>}</span>,
  },
  {
    header: "CL",
    cell: (r) => <span className="font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.cl || <span className="text-[#d4d4cc] font-sans">—</span>}</span>,
  },
  {
    header: "Date",
    cell: (r) => (
      <span className="text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    ),
  },
  {
    header: "Note",
    className: "max-w-[100px] truncate",
    cell: (r) => <span className="text-[12px] text-[#8a8a80]">{r.note || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "",
    cell: (r) => (
      <button
        onClick={() => onLoad(r)}
        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
      >
        Load
      </button>
    ),
  },
];

export function LcnRecentTable({
  newData,
  onLoad,
}: {
  newData: boolean;
  onLoad: (record: PcnFormFields) => void;
}) {
  return (
    <RecentTable<PcnRecord>
      queryKey="recentPcn"
      endpoint="/pcn/UserRecent"
      columns={buildColumns(onLoad)}
      newData={newData}
      title="Recent Updates"
      rowClassName={(_, i) =>
        `hover:bg-rose-50/20 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`
      }
    />
  );
}