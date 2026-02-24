import { useDispatch, useSelector } from "react-redux";
import { setCurrentBusForm, setNewData } from "redux/slice/bus/busSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { get } from "component/fetchComponent";
import type { AppDispatch, RootState } from "redux/store";
import type { FormFields } from "~/types/busTypes";
import { Copy, Loader2, InboxIcon } from "lucide-react";

const Cell = ({ value }: { value?: string }) => (
  <span className="text-[#8a8a80] truncate block text-center" title={value}>
    {value || <span className="text-[#d4d4cc]">—</span>}
  </span>
);

const COLUMNS: { label: string; key: keyof FormFields | "actions" }[] = [
  { label: "LGU",               key: "lgu" },
  { label: "Barangay",          key: "barangay" },
  { label: "HH ID",             key: "hhId" },
  { label: "Grantee Name",      key: "granteeName" },
  { label: "Type of Update",    key: "typeOfUpdate" },
  { label: "Update Info",       key: "updateInfo" },
  { label: "Subject of Change", key: "subjectOfChange" },
  { label: "Remarks",           key: "remarks" },
  { label: "DRN",               key: "drn" },
  { label: "CL",                key: "cl" },
  { label: "Date",              key: "date" },
  { label: "",                  key: "actions" },
];

export default function RecentTable() {
  const User = useSelector((state: RootState) => state.user);
  const busNewData = useSelector((state: RootState) => state.bus.newData);
  const dispatch = useDispatch<AppDispatch>();
  const today = new Date().toISOString().slice(0, 10);

  const { data: recentUpdates, isLoading, refetch } = useQuery<FormFields[]>({
    queryKey: ["recentBus", User],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/bus/recent`);
      return data as FormFields[];
    },
  });

  const handleEdit = (id: string) => {
    const entryToEdit = recentUpdates?.find((entry) => entry.id === id);
    if (!entryToEdit) return;
    const { date, ...withoutDateEntry } = entryToEdit;
    dispatch(setCurrentBusForm({ ...withoutDateEntry, date: today }));
  };

  useEffect(() => {
    if (busNewData) {
      refetch();
      dispatch(setNewData(false));
    }
  }, [busNewData]);

  return (
    <div className="bg-white rounded-xl border border-[#e8e8e0] mt-2 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Recent Updates</p>
        {recentUpdates && (
          <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
            {recentUpdates.length} record{recentUpdates.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-[#fafaf8] border-b border-[#e8e8e0]">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5f5f2]">
            {isLoading ? (
              <tr>
                <td colSpan={COLUMNS.length} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#c4c4b8]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[12px]">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : recentUpdates && recentUpdates.length > 0 ? (
              recentUpdates.map((update, i) => (
                <tr
                  key={update.id}
                  className={`hover:bg-blue-50/30 transition-colors duration-100 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"
                  }`}
                >
                  {/* LGU */}
                  <td className="px-4 py-2.5 text-center text-[13px] font-semibold text-[#1a1a18] whitespace-nowrap">
                    {update.lgu}
                  </td>

                  {/* Barangay */}
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">
                    {update.barangay}
                  </td>

                  {/* HH ID */}
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 group">
                      <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">
                        {update.hhId}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(update.hhId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer"
                        title="Copy HH ID"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </td>

                  {/* Grantee Name */}
                  <td className="px-4 py-2.5 text-center text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">
                    {update.granteeName}
                  </td>

                  {/* Type of Update */}
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">
                    {update.typeOfUpdate || <span className="text-[#d4d4cc]">—</span>}
                  </td>

                  {/* Update Info */}
                  <td className="px-4 py-2.5 text-[12px]"><Cell value={update.updateInfo} /></td>

                  {/* Subject of Change */}
                  <td className="px-4 py-2.5 text-[12px]"><Cell value={update.subjectOfChange} /></td>

                  {/* Remarks */}
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
                        update.remarks === "YES"
                          ? "bg-emerald-50 text-emerald-600"
                          : update.remarks === "UPDATED"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {update.remarks || "—"}
                    </span>
                  </td>

                  {/* DRN */}
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">
                    {update.drn || <span className="text-[#d4d4cc] font-sans">—</span>}
                  </td>

                  {/* CL */}
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">
                    {update.cl || <span className="text-[#d4d4cc] font-sans">—</span>}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-2.5 text-center text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
                    {new Date(update.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleEdit(update.id)}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={COLUMNS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-[#8a8a80]">No recent updates found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}