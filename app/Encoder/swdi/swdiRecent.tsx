
import { Copy } from "lucide-react";
import RecentTable from "../../../component/recentTables";
import type { ColumnDef } from "../../../component/recentTables";
import type { SwdiRecord } from "../../types/swdiTypes";
import { useNavigate } from "react-router";

export default function SwdiRecent() {
  const navigate = useNavigate()

  const handleEdit = (record: SwdiRecord) => {
    navigate(`/swdi/${record.id}`)
  };


 const columns: ColumnDef<SwdiRecord>[] = [
    {
      header: "HH ID",
      cell: (r) => (
        <div className="flex items-center justify-center gap-1.5 group">
          <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">
            {r.hhId}
          </span>
          <button
            type="button"
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
      cell: (r) => (
        <span className="text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">
          {r.grantee}
        </span>
      ),
    },
    {
      header: "SWDI Score",
      cell: (r) => (
        <span className="font-mono text-[13px] font-semibold text-[#1a1a18]">
          {r.swdiScore}
        </span>
      ),
    },
    {
      header: "Level",
      cell: (r) => (
        <span className="text-[11px] text-[#8a8a80] whitespace-nowrap">
          {r.swdiLevel || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Encoded",
      cell: (r) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
            r.remarks === "YES"
              ? "bg-emerald-50 text-emerald-600"
              : r.remarks === "NO"
                ? "bg-red-50 text-red-500"
                : "bg-blue-50 text-blue-600"
          }`}
        >
          {r.remarks}
        </span>
      ),
    },
    {
      header: "Issue",
      className: "max-w-[180px] truncate",
      cell: (r) => (
        <span className="text-[12px] text-[#8a8a80]" title={r.issue}>
          {r.issue || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (r) => (
        <span className="text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
          {new Date(r.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "",
      cell: (r) => (
        <button
          type="button"
          onClick={() => handleEdit(r)}
          className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
        >
          Load
        </button>
      ),
    },
  ];

  return (
    <RecentTable<SwdiRecord>
      queryKey="recentSwdi"
      endpoint="/swdi/recent"
      columns={columns}
      title="Recent Updates"
      rowClassName={(_, i) =>
        `hover:bg-blue-50/30 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`
      }
    />
  );
}
