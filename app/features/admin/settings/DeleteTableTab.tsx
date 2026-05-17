import { useState } from "react";
import {
  Database, Trash2, AlertTriangle, Loader2,
  FileText, Bus, Shield, ClipboardList, Heart, FolderOpen, Users, UserCog,
} from "lucide-react";
import APIFETCH from "~/lib/axios/axiosConfig";
import { useToastStore } from "~/lib/zustand/ToastStore";
import { PanelHeader } from "./shared";

// ── Table definitions ───────────────────────────────────────────────────────

interface TableDef {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;      // card accent
  bgColor: string;    // icon bg
  borderColor: string;
}

const TABLES: TableDef[] = [
  {
    key: "encodedDocument",
    label: "Global Encoded",
    description: "All encoded document records across every module",
    icon: <FileText size={18} />,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    key: "bus",
    label: "BUS",
    description: "Business permit & renewal records",
    icon: <Bus size={18} />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  {
    key: "swdi",
    label: "SWDI",
    description: "Social Welfare Development Indicator records",
    icon: <Shield size={18} />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    key: "pcn",
    label: "LCN",
    description: "LRN AND PCN records",
    icon: <ClipboardList size={18} />,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  {
    key: "cvs",
    label: "CVS",
    description: "Community Volunteer Service records",
    icon: <Heart size={18} />,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    key: "misc",
    label: "Miscellaneous",
    description: "Miscellaneous document records",
    icon: <FolderOpen size={18} />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    key: "user",
    label: "Users",
    description: "All user accounts — this is destructive!",
    icon: <Users size={18} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    key: "userInfo",
    label: "User Info",
    description: "Extended profile information for users",
    icon: <UserCog size={18} />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function DeleteTableTab() {
  const { show } = useToastStore();
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleDelete = async (table: string) => {
    setLoadingKey(table);
    try {
      const { data } = await APIFETCH.delete("/admin/delete/table", {
        params: { table },
      });
      if (data.deleted) {
        show(`"${TABLES.find((t) => t.key === table)?.label}" table cleared successfully.`, "success");
      } else {
        show("Table was not deleted — unknown table key.", "error");
      }
    } catch {
      show("Failed to delete table. Please try again.", "error");
    } finally {
      setLoadingKey(null);
      setConfirmKey(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader label="Delete Table Data" legend={false} />

      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Warning banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50/60">
          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-red-700">Danger Zone</p>
            <p className="text-[12px] text-red-600 mt-0.5 leading-relaxed">
              Deleting a table will <strong>permanently remove all rows</strong> from the selected table.
              This action <strong>cannot be undone</strong>. Make sure you have a backup before proceeding.
            </p>
          </div>
        </div>

        {/* Table heading */}
        <div className="flex items-center gap-2">
          <Database size={15} className="text-(--color-muted)" />
          <p className="text-[12px] font-semibold text-(--color-muted) uppercase tracking-wider">
            Available Tables
          </p>
        </div>

        {/* Table cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TABLES.map((table) => {
            const isConfirming = confirmKey === table.key;
            const isLoading = loadingKey === table.key;

            return (
              <div
                key={table.key}
                className={`relative rounded-xl border bg-(--color-surface) overflow-hidden transition-all duration-200 ${isConfirming
                  ? "border-red-300 shadow-[0_0_0_1px_rgba(239,68,68,0.15)]"
                  : "border-(--color-border) hover:border-(--color-border-hover) hover:shadow-sm"
                  }`}
              >
                <div className="flex items-start gap-3.5 p-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg ${table.bgColor} ${table.color} flex items-center justify-center shrink-0`}>
                    {table.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-(--color-ink) leading-tight">{table.label}</p>
                    <p className="text-[11px] text-(--color-muted) mt-0.5 leading-relaxed">{table.description}</p>
                    <p className="text-[10px] font-mono text-(--color-placeholder) mt-1 uppercase tracking-wider">
                      key: {table.key}
                    </p>
                  </div>

                  {/* Action area */}
                  <div className="shrink-0 flex items-center">
                    {isConfirming ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(table.key)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          {isLoading ? "Deleting…" : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmKey(null)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-[11px] font-medium text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmKey(table.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                        Delete All
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirm banner */}
                {isConfirming && !isLoading && (
                  <div className="px-4 py-2.5 bg-red-50 border-t border-red-200 flex items-center gap-2">
                    <AlertTriangle size={13} className="text-red-500 shrink-0" />
                    <p className="text-[11px] text-red-600 leading-snug">
                      Are you sure? All <strong>{table.label}</strong> records will be permanently deleted.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
