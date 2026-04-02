import { Copy } from "lucide-react";
import type { BusRecord } from "./../types/busTypes";
import RecentTable from "./../../component/recentTables";
import type { ColumnDef } from "./../../component/recentTables";
import { useNavigate } from "react-router";

export default function BusRecentTable() {
  const navigate = useNavigate()

  const handleEdit = (record: BusRecord) => {
    navigate(`/bus/${record.id}`)
  };

  const columns: ColumnDef<BusRecord>[] = [
    {
      header: "LGU",
      cell: (r) => (
        <span className="text-[13px] font-semibold text-(--color-ink) whitespace-nowrap">
          {r.lgu}
        </span>
      ),
    },
    {
      header: "HH ID",
      cell: (r) => (
        <div className="flex items-center justify-center gap-1.5 group">
          <span className="font-mono text-[11px] text-(--color-ink) whitespace-nowrap">
            {r.hhId}
          </span>
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
      cell: (r) => (
        <span className="text-[12px] font-medium text-(--color-ink) whitespace-nowrap">
          {r.granteeName}
        </span>
      ),
    },
    {
      header: "Type of Update",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted) whitespace-nowrap">
          {r.typeOfUpdate || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Subject Of Change",
      cell: (r) => (
        <span
          className="text-(--color-muted) truncate block text-center"
          title={r.subjectOfChange}
        >
          {r.updateInfo || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Remarks",
      cell: (r) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
            r.remarks === "YES"
              ? "bg-emerald-50 text-emerald-600"
              : r.remarks === "UPDATED"
                ? "bg-blue-50 text-blue-600"
                : "bg-red-50 text-red-500"
          }`}
        >
          {r.remarks || "—"}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (r) => (
        <span className="text-[11px] text-(--color-muted) whitespace-nowrap tabular-nums">
          {new Date(r.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
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
    <RecentTable<BusRecord>
      queryKey={`recentBus`}
      endpoint="/bus/recent"
      columns={columns}
      title="Recent Updates"
    />
  );
}
