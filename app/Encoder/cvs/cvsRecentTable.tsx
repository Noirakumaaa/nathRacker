import { useState } from "react";
import { ArrowUpRight, Copy, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import RecentTable from "../../../component/recentTables";
import type { ColumnDef } from "../../../component/recentTables";
import type { CvsRecord } from "../../types/cvsTypes";
import { FormTypeChip, RemarksBadge } from "~/types/BadgeStyle";
import { useNavigate } from "react-router";
import { DeleteModal } from "~/records/deleteModal";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";

export default function CvsRecentTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: Number | null }>({ open: false, id: null });

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await APIFETCH.delete(`/cvs/delete/${deleteModal.id}`);
      if (res.data.deleted ?? res.status === 200) {
        show(res.data.message ?? "Record deleted", "success");
        queryClient.invalidateQueries({ queryKey: ["recentCvs"] });
        queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
      } else {
        show(res.data.message ?? "Failed to delete", "error");
      }
    } catch {
      show("Failed to delete record", "error");
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  const buildColumns: ColumnDef<CvsRecord>[] = [
    {
      header: "ID Number",
      headerClassName: "text-center first:pl-6",
      className: "pl-6 pr-4",
      cell: (r) => (
        <div className="flex items-center justify-center gap-1.5 group">
          <span className="font-mono text-[11px] font-medium text-(--color-ink) whitespace-nowrap">
            {r.idNumber}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(r.idNumber)}
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
      headerClassName: "text-center",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted) whitespace-nowrap">
          {r.lgu || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Barangay",
      headerClassName: "text-center",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted) whitespace-nowrap">
          {r.barangay || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Facility Name",
      headerClassName: "text-center",
      className: "max-w-[160px]",
      cell: (r) => (
        <span className="text-[12px] font-medium text-(--color-ink) truncate block whitespace-nowrap">
          {r.facilityName || <span className="font-normal text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Form Type",
      headerClassName: "text-center",
      cell: (r) => <FormTypeChip value={r.formType} />,
    },
    {
      header: "Remarks",
      headerClassName: "text-center",
      cell: (r) => <RemarksBadge value={r.remarks} />,
    },
    {
      header: "Date",
      headerClassName: "text-center",
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
      header: "Actions",
      headerClassName: "text-center",
      className: "pl-4 pr-6",
      cell: (r) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(`/cvs/${r.id}`)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
          >
            Load <ArrowUpRight size={11} />
          </button>
          <button
            onClick={() => setDeleteModal({ open: true, id: r.id })}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DeleteModal
        open={deleteModal.open}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
      <RecentTable<CvsRecord>
        queryKey="recentCvs"
        endpoint="/cvs/recent"
        columns={buildColumns}
        rowClassName={(_, i) =>
          `group hover:bg-(--color-bg) transition-colors duration-100 ${i % 2 === 0 ? "bg-(--color-surface)" : "bg-(--color-bg)"}`
        }
        headerLeft={(records) => (
          <div className="w-full flex items-center justify-center gap-3">
            <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
              Recent Updates
            </p>
            {records.length > 0 && (
              <span className="text-[10px] font-mono bg-violet-50 text-violet-500 px-2 py-0.5 rounded-full">
                {records.length} record{records.length !== 1 ? "s" : ""}
              </span>
            )}
            {records.length > 0 && (
              <span className="text-[11px] text-(--color-placeholder) font-mono">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
        )}
        footer={(records) => (
          <div className="px-6 py-3 border-t border-(--color-border) bg-(--color-bg) text-center">
            <p className="text-[11px] text-(--color-muted)">
              Showing {records.length} most recent record{records.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      />
    </>
  );
}
