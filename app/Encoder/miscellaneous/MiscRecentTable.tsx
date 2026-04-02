import React from "react";
import { Copy } from "lucide-react";
import RecentTable from "./../../../component/recentTables";
import type { ColumnDef } from "./../../../component/recentTables";
import type { MiscRecord } from "./../../types/miscTypes";
import { EncodedBadge } from "component/StyleBadge";
import { useNavigate } from "react-router";



export default function MiscRecentTable() {
  const navigate = useNavigate()

  const handleEdit=(record : MiscRecord)=>{
    navigate(`/miscellaneous/${record.id}`)
  }
const buildColumns : ColumnDef<MiscRecord>[] = [
  {
    header: "HH ID",
    cell: (r) => (
      <div className="flex items-center justify-center gap-1.5 group">
        <span className="font-mono text-[11px] text-(--color-ink) whitespace-nowrap">{r.hhId}</span>
        <button
          onClick={() => navigator.clipboard.writeText(r.hhId)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-(--color-placeholder) hover:text-(--color-muted) cursor-pointer bg-transparent border-none"
          title="Copy HH ID"
        >
          <Copy size={11} />
        </button>
      </div>
    ),
  },
  {
    header: "Grantee Name",
    cell: (r) => <span className="font-medium text-(--color-ink) whitespace-nowrap">{r.granteeName}</span>,
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
    cell: (r) => <span className="max-w-30 truncate block">{r.subjectOfChange || <span className="text-[#d4d4cc]">—</span>}</span>,
  },
  {
    header: "Remarks",
    cell: (r) => <EncodedBadge value={r.remarks} />,
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
    header: "Action",
    cell: (r) => (
      <button
        onClick={() => handleEdit(r)}
        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
      >
        Load
      </button>
    ),
  },
];

  return (
    <RecentTable<MiscRecord>
      queryKey="recentMisc"
      endpoint="/miscellaneous/recent"
      columns={buildColumns}
      title="Recent Updates"
    />
  );
}