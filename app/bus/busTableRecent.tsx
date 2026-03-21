import { useDispatch, useSelector } from "react-redux";
import { setCurrentBusForm, setNewData } from "redux/slice/bus/busSlice";
import { Copy } from "lucide-react";
import type { AppDispatch, RootState } from "redux/store";
import type { FormFields } from "./../types/busTypes";
import RecentTable from "./../../component/recentTables";
import type { ColumnDef } from "./../../component/recentTables";

const Cell = ({ value }: { value?: string }) => (
  <span className="text-[#8a8a80] truncate block text-center" title={value}>
    {value || <span className="text-[#d4d4cc]">—</span>}
  </span>
);

export default function BusRecentTable() {
  const User = useSelector((state: RootState) => state.user);
  const busNewData = useSelector((state: RootState) => state.bus.newData);
  const dispatch = useDispatch<AppDispatch>();
  const today = new Date().toISOString().slice(0, 10);

  const handleEdit = (record: FormFields) => {
    const { date, ...withoutDate } = record;
    dispatch(setCurrentBusForm({ ...withoutDate, date: today }));
  };

  const columns: ColumnDef<FormFields>[] = [
    {
      header: "LGU",
      cell: (r) => (
        <span className="text-[13px] font-semibold text-[#1a1a18] whitespace-nowrap">{r.lgu}</span>
      ),
    },
    {
      header: "Barangay",
      cell: (r) => (
        <span className="text-[12px] text-[#8a8a80] whitespace-nowrap">{r.barangay}</span>
      ),
    },
    {
      header: "HH ID",
      cell: (r) => (
        <div className="flex items-center justify-center gap-1.5 group">
          <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">{r.hhId}</span>
          <button
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
      header: "Grantee Name",
      cell: (r) => (
        <span className="text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">{r.granteeName}</span>
      ),
    },
    {
      header: "Type of Update",
      cell: (r) => (
        <span className="text-[12px] text-[#8a8a80] whitespace-nowrap">
          {r.typeOfUpdate || <span className="text-[#d4d4cc]">—</span>}
        </span>
      ),
    },
    { header: "Update Info",       cell: (r) => <Cell value={r.updateInfo} /> },
    { header: "Subject of Change", cell: (r) => <Cell value={r.subjectOfChange} /> },
    {
      header: "Remarks",
      cell: (r) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
          r.remarks === "YES"     ? "bg-emerald-50 text-emerald-600" :
          r.remarks === "UPDATED" ? "bg-blue-50 text-blue-600" :
                                    "bg-red-50 text-red-500"
        }`}>
          {r.remarks || "—"}
        </span>
      ),
    },
    {
      header: "DRN",
      cell: (r) => (
        <span className="font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">
          {r.drn || <span className="text-[#d4d4cc] font-sans">—</span>}
        </span>
      ),
    },
    {
      header: "CL",
      cell: (r) => (
        <span className="font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">
          {r.cl || <span className="text-[#d4d4cc] font-sans">—</span>}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (r) => (
        <span className="text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
          {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      header: "",
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
    <RecentTable<FormFields>
      queryKey={`recentBus-${User}`}
      endpoint="/bus/recent"
      columns={columns}
      newData={busNewData}
      title="Recent Updates"
    />
  );
}