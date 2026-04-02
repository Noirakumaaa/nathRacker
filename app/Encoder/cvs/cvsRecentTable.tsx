import { ArrowUpRight, Copy } from "lucide-react";
import RecentTable from "../../../component/recentTables";
import type { ColumnDef } from "../../../component/recentTables";
import type { CvsRecord, CvsFormFields } from "../../types/cvsTypes";
import { FormTypeChip, RemarksBadge } from "~/types/BadgeStyle";
import { useNavigate } from "react-router";

export default function CvsRecentTable() {
  const navigate = useNavigate();

  const handleEdit = (record: CvsRecord) => {
    navigate(`/cvs/${record.id}`);
  };
  const buildColumns: ColumnDef<CvsRecord>[] = [
    {
      header: "ID Number",
      headerClassName: "text-left first:pl-6",
      className: "pl-6 pr-4",
      cell: (r) => (
        <div className="flex items-center gap-1.5 group">
          <span className="font-mono text-[11px] font-medium text-(--color-ink) whitespace-nowrap">
            {r.idNumber}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText((r.idNumber))}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-(--color-placeholder) hover:text-(--color-muted) cursor-pointer bg-transparent border-none p-0"
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
        <span className="text-[12px] font-medium text-(--color-ink) truncate block whitespace-nowrap">
          {r.facilityName || (
            <span className="font-normal text-[#d4d4cc]">—</span>
          )}
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
      header: "",
      className: "pl-4 pr-6",
      cell: (r) => (
        <button
          onClick={() => handleEdit(r)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100"
        >
          Load <ArrowUpRight size={11} />
        </button>
      ),
    },
  ];

  return (
    <RecentTable<CvsRecord>
      queryKey="recentCvs"
      endpoint="/cvs/recent"
      columns={buildColumns}
      rowClassName={(_, i) =>
        `group hover:bg-(--color-bg) transition-colors duration-100 ${i % 2 === 0 ? "bg-(--color-surface)" : "bg-[#fdfdfc]"}`
      }
      headerLeft={(records) => (
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
            Recent Updates
          </p>
          {records.length > 0 && (
            <span className="text-[10px] font-mono bg-violet-50 text-violet-500 px-2 py-0.5 rounded-full">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
      headerRight={(records) =>
        records.length > 0 ? (
          <span className="text-[11px] text-(--color-placeholder) font-mono">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ) : null
      }
      footer={(records) => (
        <div className="px-6 py-3 border-t border-[#f0f0ec] bg-(--color-bg)">
          <p className="text-[11px] text-[#b0b0a8]">
            Showing {records.length} most recent record
            {records.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    />
  );
}
