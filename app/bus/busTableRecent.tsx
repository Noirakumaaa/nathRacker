import { useDispatch, useSelector } from "react-redux";
import { setCurrentBusForm, setNewData } from "redux/slice/bus/busSlice";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { get } from "component/fetchComponent";
import type { AppDispatch, RootState } from "redux/store";
import type { FormFields } from "~/types/busTypes";
import { Copy, Loader2, InboxIcon } from "lucide-react";

const Cell = ({ value }: { value?: string }) => (
  <span className="text-gray-500 truncate block text-center" title={value}>
    {value || <span className="text-gray-300">—</span>}
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
  { label: "Encoded By",        key: "encodedBy" },
  { label: "Remarks",           key: "remarks" },
  // { label: "Encoded",          key: "remarks" },
  { label: "DRN",               key: "drn" },
  { label: "CL",                key: "cl" },
  { label: "Date",              key: "date" },
  { label: "Note",              key: "note" },
  { label: "",                  key: "actions" },
];

export default function RecentTable() {
  const User = useSelector((state: RootState) => state.user);
  const busNewData = useSelector((state: RootState) => state.bus.newData);
  const dispatch = useDispatch<AppDispatch>();
  const today = new Date().toISOString().slice(0, 10);

  const {
    data: recentUpdates,
    isLoading,
    error,
    refetch,
  } = useQuery<FormFields[]>({
    queryKey: ["recentBus", User],
    queryFn: async () => {
      const data = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/bus/recent`,
      );
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Recent Updates
        </h3>
        {recentUpdates && (
          <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
            {recentUpdates.length} record{recentUpdates.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={COLUMNS.length} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-xs">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : recentUpdates && recentUpdates.length > 0 ? (
              recentUpdates.map((update, i) => (
                <tr
                  key={update.id}
                  className={`hover:bg-blue-50/40 transition-colors duration-100 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* LGU */}
                  <td className="px-4 py-2.5 text-center font-semibold text-gray-800 whitespace-nowrap">
                    {update.lgu}
                  </td>

                  {/* Barangay */}
                  <td className="px-4 py-2.5 text-center text-gray-600 whitespace-nowrap">
                    {update.barangay}
                  </td>

                  {/* HH ID */}
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 group">
                      <span className="font-mono text-[11px] text-gray-700 whitespace-nowrap">
                        {update.hhId}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(update.hhId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500"
                        title="Copy HH ID"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </td>

                  {/* Grantee Name */}
                  <td className="px-4 py-2.5 text-center font-medium text-gray-800 whitespace-nowrap">
                    {update.granteeName}
                  </td>

                  {/* Type of Update */}
                  <td className="px-4 py-2.5 text-center text-gray-500 whitespace-nowrap">
                    {update.typeOfUpdate || <span className="text-gray-300">—</span>}
                  </td>

                  {/* Update Info */}
                  <td className="px-4 py-2.5">
                    <Cell value={update.updateInfo} />
                  </td>

                  {/* Subject of Change */}
                  <td className="px-4 py-2.5">
                    <Cell value={update.subjectOfChange} />
                  </td>

                  {/* Encoded By */}
                  <td className="px-4 py-2.5">
                    <Cell value={update.encodedBy} />
                  </td>

                  {/* Encoded By (alt)
                  <td className="px-4 py-2.5 text-center text-gray-600 whitespace-nowrap">
                    {update.encodedBy || <span className="text-gray-300">—</span>}
                  </td> */}

                  {/* Remarks */}
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                        update.remarks === "YES"
                          ? "bg-green-50 text-green-600 ring-1 ring-green-200"
                          : "bg-red-50 text-red-500 ring-1 ring-red-200"
                      }`}
                    >
                      {update.remarks || "—"}
                    </span>
                  </td>

                  {/* DRN */}
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {update.drn || <span className="text-gray-300 font-sans">—</span>}
                  </td>

                  {/* CL */}
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {update.cl || <span className="text-gray-300 font-sans">—</span>}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-2.5 text-center text-gray-400 whitespace-nowrap tabular-nums">
                    {new Date(update.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Note */}
                  <td className="px-4 py-2.5">
                    <Cell value={update.note} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleEdit(update.id)}
                      className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 hover:underline transition-colors whitespace-nowrap"
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
                    <InboxIcon size={24} className="text-gray-200" />
                    <span className="text-xs text-gray-400">No recent updates found</span>
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