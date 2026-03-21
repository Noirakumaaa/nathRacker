import { ArrowUpRight, Copy } from "lucide-react";
import RecentTable from "./../../component/recentTables";
import type { ColumnDef } from "./../../component/recentTables";
import type { CvsRecord, CvsFormFields } from "./../types/cvsTypes";

function RemarksBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    DONE:         "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    PENDING:      "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    "FOR REVIEW": "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
    RETURNED:     "bg-red-50 text-red-500 ring-1 ring-red-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${map[value] ?? "bg-[#f5f5f2] text-[#8a8a80]"}`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-70" />
      {value || "—"}
    </span>
  );
}

function FormTypeChip({ value }: { value: string }) {
  return (
    <span className="inline-block font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-violet-50 text-violet-600 tracking-wider whitespace-nowrap">
      {value || "—"}
    </span>
  );
}

const buildColumns = (onLoad: (record: CvsFormFields) => void): ColumnDef<CvsRecord>[] => [
  {
    header: "ID Number",
    headerClassName: "text-left first:pl-6",
    className: "pl-6 pr-4",
    cell: (r) => (
      <div className="flex items-center gap-1.5 group">
        <span className="font-mono text-[11px] font-medium text-[#1a1a18] whitespace-nowrap">{r.idNumber}</span>
        <button
          onClick={() => navigator.clipboard.writeText(String(r.idNumber))}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none p-0"
          title="Copy ID Number"
        >
          <Copy size={10} />
        </button>
      </div>
    ),
  },
  {
    header: "LGU",
    headerClassName: "text-left",
    cell: (r) => (
      <span className="text-[12px] text-[#6a6a60] whitespace-nowrap">
        {r.lgu || <span className="text-[#d4d4cc]">—</span>}
      </span>
    ),
  },
  {
    header: "Barangay",
    headerClassName: "text-left",
    cell: (r) => (
      <span className="text-[12px] text-[#6a6a60] whitespace-nowrap">
        {r.barangay || <span className="text-[#d4d4cc]">—</span>}
      </span>
    ),
  },
  {
    header: "Facility Name",
    headerClassName: "text-left",
    className: "max-w-[160px]",
    cell: (r) => (
      <span className="text-[12px] font-medium text-[#1a1a18] truncate block whitespace-nowrap">
        {r.facilityName || <span className="font-normal text-[#d4d4cc]">—</span>}
      </span>
    ),
  },
  {
    header: "Form Type",
    headerClassName: "text-left",
    cell: (r) => <FormTypeChip value={r.formType} />,
  },
  {
    header: "Remarks",
    headerClassName: "text-left",
    cell: (r) => <RemarksBadge value={r.remarks} />,
  },
  {
    header: "Date",
    headerClassName: "text-left",
    cell: (r) => (
      <span className="text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    ),
  },
  {
    header: "",
    className: "pl-4 pr-6",
    cell: (r) => (
      <button
        onClick={() => onLoad(r)}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8a8a80] hover:text-[#1a1a18] transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100"
      >
        Load <ArrowUpRight size={11} />
      </button>
    ),
  },
];

export default function CvsRecentTable({
  newData,
  onLoad,
}: {
  newData: boolean;
  onLoad: (record: CvsFormFields) => void;
}) {
  return (
    <RecentTable<CvsRecord>
      queryKey="recentCvs"
      endpoint="/cvs/recent"
      columns={buildColumns(onLoad)}
      newData={newData}
      rowClassName={(_, i) =>
        `group hover:bg-[#fafaf8] transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fdfdfc]"}`
      }
      headerLeft={(records) => (
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Recent Updates</p>
          {records.length > 0 && (
            <span className="text-[10px] font-mono bg-violet-50 text-violet-500 px-2 py-0.5 rounded-full">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
      headerRight={(records) =>
        records.length > 0 ? (
          <span className="text-[11px] text-[#c4c4b8] font-mono">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        ) : null
      }
      footer={(records) => (
        <div className="px-6 py-3 border-t border-[#f0f0ec] bg-[#fafaf8]">
          <p className="text-[11px] text-[#b0b0a8]">
            Showing {records.length} most recent record{records.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    />
  );
}