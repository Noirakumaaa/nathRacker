import React from "react";
import { Copy } from "lucide-react";
import RecentTable from "./../../component/recentTables";
import type { ColumnDef } from "./../../component/recentTables";
import type { MiscRecord, MiscFormFields } from "./../types/miscTypes";

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

const buildColumns = (onLoad: (record: MiscFormFields) => void): ColumnDef<MiscRecord>[] => [
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
    header: "Grantee Name",
    cell: (r) => <span className="font-medium text-[#1a1a18] whitespace-nowrap">{r.granteeName}</span>,
  },
  {
    header: "Doc Type",
    cell: (r) => (
      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 tracking-wider whitespace-nowrap">
        {r.documentType || "—"}
      </span>
    ),
  },
  {
    header: "Subject",
    cell: (r) => <span className="max-w-[120px] truncate block">{r.subjectOfChange || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "Encoded By",
    cell: (r) => <span className="whitespace-nowrap">{r.encodedBy || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "Remarks",
    cell: (r) => <EncodedBadge value={r.remarks} />,
  },
  {
    header: "DRN",
    cell: (r) => <span className="font-mono text-[11px] whitespace-nowrap">{r.drn || <span className="text-[#d4d4cc] font-sans">—</span>}</span>,
  },
  {
    header: "CL",
    cell: (r) => <span className="font-mono text-[11px] whitespace-nowrap">{r.cl || <span className="text-[#d4d4cc] font-sans">—</span>}</span>,
  },
  {
    header: "Date",
    cell: (r) => (
      <span className="text-[11px] whitespace-nowrap tabular-nums">
        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    ),
  },
  {
    header: "Note",
    cell: (r) => <span className="max-w-[100px] truncate block">{r.note || <span className="text-[#d4d4cc]">—</span>}</span>,
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

export default function MiscRecentTable({
  newData,
  onLoad,
}: {
  newData: boolean;
  onLoad: (record: MiscFormFields) => void;
}) {
  return (
    <RecentTable<MiscRecord>
      queryKey="recentMisc"
      endpoint="/miscellaneous/recent"
      columns={buildColumns(onLoad)}
      newData={newData}
      title="Recent Updates"
    />
  );
}