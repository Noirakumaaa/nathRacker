import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "redux/store";
import { setCurrentSwdiForm, setNewData } from "redux/slice/swdi/swdiSlice";
import { useEffect } from "react";
import { Copy, Loader2, InboxIcon } from "lucide-react";
import { get } from "component/fetchComponent";
import type { SwdiData } from "./../types/swdiTypes";

export default function SwdiRecent() {
  const dispatch = useDispatch<AppDispatch>();
  const newSwdiData = useSelector((state: RootState) => state.swdi.newData);

  const { data: recentSwdi, isLoading, refetch } = useQuery<SwdiData[]>({
    queryKey: ["recentSwdi"],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/swdi/recent`);
      return data as SwdiData[];
    },
  });

  const handleEdit = (id: number) => {
    const entryToEdit = recentSwdi?.find((entry) => entry.id === id);
    if (!entryToEdit) return;
    const { createdAt, updatedAt, id: _, userId, remarks, swdiScore, ...rest } = entryToEdit;

    dispatch(setCurrentSwdiForm({ ...rest, remarks: remarks, swdiScore: swdiScore, cl: rest.cl || "", drn: rest.drn || "" }));
  };

  useEffect(() => {
    if (newSwdiData) {
      refetch();
      dispatch(setNewData(false));
    }
  }, [newSwdiData]);

  return (
    <div className="bg-white rounded-xl border border-[#e8e8e0] mt-2 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Recent Updates</p>
        {recentSwdi && (
          <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
            {recentSwdi.length} record{recentSwdi.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-[#fafaf8] border-b border-[#e8e8e0]">
            <tr>
              {["HH ID", "Grantee", "SWDI Score", "Level", "Encoded", "Issue", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5f5f2]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#c4c4b8]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[12px]">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : !recentSwdi || recentSwdi.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-[#8a8a80]">No recent updates found</span>
                  </div>
                </td>
              </tr>
            ) : (
              recentSwdi.map((update, i) => (
                <tr
                  key={update.id}
                  className={`hover:bg-blue-50/30 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}
                >
                  {/* HH ID */}
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 group">
                      <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">{update.hhId}</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(update.hhId)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none"
                        title="Copy HH ID"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </td>

                  {/* Grantee */}
                  <td className="px-4 py-2.5 text-center text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">
                    {update.grantee}
                  </td>

                  {/* SWDI Score */}
                  <td className="px-4 py-2.5 text-center">
                    <span className="font-mono text-[13px] font-semibold text-[#1a1a18]">{update.swdiScore}</span>
                  </td>

                  {/* Level */}
                  <td className="px-4 py-2.5 text-center text-[11px] text-[#8a8a80] whitespace-nowrap">
                    {update.swdiLevel || <span className="text-[#d4d4cc]">—</span>}
                  </td>

                  {/* Encoded */}
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
                        update.remarks === "YES"
                          ? "bg-emerald-50 text-emerald-600"
                          : update.remarks === "NO"
                          ? "bg-red-50 text-red-500"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {update.remarks}
                    </span>
                  </td>

                  {/* Issue */}
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] max-w-[180px] truncate" title={update.issue}>
                    {update.issue || <span className="text-[#d4d4cc]">—</span>}
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
                      type="button"
                      onClick={() => handleEdit(update.id)}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}