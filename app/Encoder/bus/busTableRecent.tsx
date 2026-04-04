import { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { BusRecord } from "./../../types/busTypes";
import RecentTable from "./../../../component/recentTables";
import type { ColumnDef } from "./../../../component/recentTables";
import { useNavigate } from "react-router";
import { DeleteModal } from "~/records/deleteModal";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";

export default function BusRecentTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await APIFETCH.delete(`/bus/delete/${deleteModal.id}`);
      if (res.data.deleted ?? res.status === 200) {
        show(res.data.message ?? "Record deleted", "success");
        queryClient.invalidateQueries({ queryKey: ["recentBus"] });
        queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
        navigate("/bus")
      } else {
        show(res.data.message ?? "Failed to delete", "error");
      }
    } catch {
      show("Failed to delete record", "error");
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  const columns: ColumnDef<BusRecord>[] = [
    {
      header: "LGU",
      headerClassName: "text-center first:pl-6",
      className: "pl-6 pr-4",
      cell: (r) => (
        <span className="text-[13px] font-semibold text-(--color-ink) whitespace-nowrap">
          {r.lgu}
        </span>
      ),
    },
    {
      header: "HH ID",
      headerClassName: "text-center",
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
      header: "Grantee Name",
      headerClassName: "text-center",
      cell: (r) => (
        <span className="text-[12px] font-medium text-(--color-ink) whitespace-nowrap">{r.granteeName}</span>
      ),
    },
    {
      header: "Type of Update",
      headerClassName: "text-center",
      cell: (r) => (
        <span className="text-[12px] text-(--color-muted) whitespace-nowrap">
          {r.typeOfUpdate || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Subject Of Change",
      headerClassName: "text-center",
      cell: (r) => (
        <span className="text-(--color-muted) truncate block" title={r.subjectOfChange}>
          {r.updateInfo || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    {
      header: "Remarks",
      headerClassName: "text-center",
      cell: (r) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
          r.remarks === "YES" ? "bg-emerald-50 text-emerald-600"
          : r.remarks === "UPDATED" ? "bg-blue-50 text-blue-600"
          : "bg-red-50 text-red-500"
        }`}>
          {r.remarks || "—"}
        </span>
      ),
    },
    {
      header: "Date",
      headerClassName: "text-center",
      cell: (r) => (
        <span className="text-[11px] text-(--color-muted) whitespace-nowrap tabular-nums">
          {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      className: "pl-4 pr-6",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/bus/${r.id}`)}
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
      <RecentTable<BusRecord>
        queryKey="recentBus"
        endpoint="/bus/recent"
        columns={columns}
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
              {today}
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
