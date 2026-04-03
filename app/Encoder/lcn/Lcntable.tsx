import { useState } from "react";
import { ArrowUpRight, Copy, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import RecentTable from "../../../component/recentTables";
import type { ColumnDef } from "../../../component/recentTables";
import type { LcnRecord } from "../../types/lcnTypes";
import { useNavigate } from "react-router";
import { EncodedBadge } from "component/StyleBadge";
import { DeleteModal } from "~/records/deleteModal";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";

export function LcnRecentTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await APIFETCH.delete(`/lcn/delete/${deleteModal.id}`);
      if (res.data.deleted ?? res.status === 200) {
        show(res.data.message ?? "Record deleted", "success");
        queryClient.invalidateQueries({ queryKey: ["recentPcn"] });
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

  const buildColumns: ColumnDef<LcnRecord>[] = [
    {
      header: "HH ID",
      headerClassName: "text-left first:pl-6",
      className: "pl-6 pr-4",
      cell: (r) => (
        <div className="flex items-center gap-1.5 group">
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
      header: "Grantee",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="text-[12px] font-medium text-(--color-ink) whitespace-nowrap">
          {r.granteeName || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "LGU",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted) whitespace-nowrap">
          {r.lgu || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Barangay",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted) whitespace-nowrap">
          {r.barangay || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Subject",
      headerClassName: "text-left",
      className: "max-w-[120px] truncate",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted)">
          {r.subjectOfChange || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "PCN",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 tracking-wider whitespace-nowrap">
          {r.pcn || "—"}
        </span>
      ),
    },
    {
      header: "TR",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="font-mono text-[11px] text-(--color-muted) whitespace-nowrap">
          {r.lrn || <span className="text-[#d4d4cc] font-sans">—</span>}
        </span>
      ),
    },
    {
      header: "Remarks",
      headerClassName: "text-left",
      cell: (r) => <EncodedBadge value={r.remarks} />,
    },
    {
      header: "DRN",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="font-mono text-[11px] text-(--color-muted) whitespace-nowrap">
          {r.drn || <span className="text-[#d4d4cc] font-sans">—</span>}
        </span>
      ),
    },
    {
      header: "CL",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="font-mono text-[11px] text-(--color-muted) whitespace-nowrap">
          {r.cl || <span className="text-[#d4d4cc] font-sans">—</span>}
        </span>
      ),
    },
    {
      header: "Date",
      headerClassName: "text-left",
      cell: (r) => (
        <span className="text-[11px] text-(--color-muted) whitespace-nowrap tabular-nums">
          {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      header: "Note",
      headerClassName: "text-left",
      className: "max-w-[100px] truncate",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted)">
          {r.note || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-left",
      className: "pl-4 pr-6",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/lcn/${r.id}`)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
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
      <RecentTable<LcnRecord>
        queryKey="recentPcn"
        endpoint="/lcn/recent"
        columns={buildColumns}
        rowClassName={(_, i) =>
          `group hover:bg-(--color-bg) transition-colors duration-100 ${i % 2 === 0 ? "bg-(--color-surface)" : "bg-(--color-bg)"}`
        }
        headerLeft={(records) => (
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">Recent Updates</p>
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
              {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          ) : null
        }
        footer={(records) => (
          <div className="px-6 py-3 border-t border-(--color-border) bg-(--color-bg)">
            <p className="text-[11px] text-(--color-muted)">
              Showing {records.length} most recent record{records.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      />
    </>
  );
}
