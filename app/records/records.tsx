import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { get, del } from "component/fetchComponent";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "redux/store";
import { setCurrentBusForm } from "redux/slice/bus/busSlice";
import { setCurrentSwdiForm } from "redux/slice/swdi/swdiSlice";
import { setCurrentPcnForm } from "redux/slice/pcn/pcnSlice";
import { setCurrentCVSForm } from "redux/slice/cvs/cvsSlice";
import { setCurrentMISCForm } from "redux/slice/misc/miscSlice";
import {
  Loader2,
  InboxIcon,
  Copy,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  Download,
  Trash2,
  Layers,
} from "lucide-react";
import { BusViewModal } from "./busModal";
import { PcnViewModal } from "./pcnModal";
import { SwdiViewModal } from "./swdiModal";
import { MiscViewModal } from "./miscModal";
import { CvsViewModal } from "./cvsModal";
import type { BusFormFields } from "./../types/busTypes";
import type { SwdiFormFields } from "~/types/swdiTypes";
import type { PcnFormFields } from "~/types/pcnTypes";
import type { MiscFormFields } from "~/types/miscTypes";
import type { CvsFormFields } from "~/types/cvsTypes";


// ── Types ─────────────────────────────────────────────────────────────────────
type AllDocuments = {
  id: number;
  idNumber: string;
  name: string;
  documentType: string;
  documentId: number;
  remarks: string;
  userId: number;
  govUsername: string;
  subjectOfChange?: string;
  date: string;
};

type FilterState = {
  search: string;
  encoded: string;
  docType: string;
  dateFrom: string;
  dateTo: string;
  username: string;
};

// ── Shared classes ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
const labelCls =
  "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";

function EncodedBadge({ value }: { value: string }) {
  const cls =
    value === "YES"
      ? "bg-emerald-50 text-emerald-600"
      : value === "NO"
        ? "bg-red-50 text-red-500"
        : value === "UPDATED"
          ? "bg-blue-50 text-blue-600"
          : value === "PENDING"
            ? "bg-amber-50 text-amber-600"
            : "bg-[#f5f5f2] text-[#8a8a80]";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}
    >
      {value || "—"}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function RecordsTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    encoded: "",
    docType: "",
    dateFrom: "",
    dateTo: "",
    username: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBusItem, setSelectedBusItem] = useState<BusFormFields | null>(null);
  const [ selectedPcnItem, setSelectedPcnItem ] = useState<PcnFormFields | null>(null);
  const [ selectedSwdiItem, setSelectedSwdiItem ] = useState<SwdiFormFields | null>(null);
  const [ selectedMiscItem, setSelectedMiscItem ] = useState<MiscFormFields | null>(null);
   const [ selectedCVSItem, setSelectedCVSItem ] = useState<CvsFormFields | null>(null);
  const itemsPerPage = 10;

  const {
    data: busData = [],
    isLoading,
    refetch,
  } = useQuery<AllDocuments[]>({
    queryKey: ["allDocuments"],
    queryFn: async () =>
      await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/globalRecords`,
      ),
  });

  const filteredData = useMemo(
    () =>
      busData.filter((item) => {
        const s = filters.search.toLowerCase();
        const matchesSearch = s
          ? [
              item.idNumber,
              item.name,
              item.documentType,
              item.remarks,
              item.govUsername,
            ].some((v) => v?.toLowerCase().includes(s))
          : true;
        const matchesEncoded = filters.encoded
          ? item.remarks === filters.encoded
          : true;
        const matchesDocType = filters.docType
          ? item.documentType
              .toLowerCase()
              .includes(filters.docType.toLowerCase())
          : true;
        const matchesUsername = filters.username
          ? item.govUsername
              .toLowerCase()
              .includes(filters.username.toLowerCase())
          : true;
        const itemDate = new Date(item.date);
        const from = filters.dateFrom
          ? new Date(filters.dateFrom + "T00:00:00")
          : null;
        const to = filters.dateTo
          ? new Date(filters.dateTo + "T23:59:59")
          : null;
        const matchesDate =
          (!from || itemDate >= from) && (!to || itemDate <= to);
        return (
          matchesSearch &&
          matchesEncoded &&
          matchesDocType &&
          matchesUsername &&
          matchesDate
        );
      }),
    [busData, filters],
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      encoded: "",
      docType: "",
      dateFrom: "",
      dateTo: "",
      username: "",
    });
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;


  const handleView = async (item: AllDocuments) => {

    console.log(" ITEM : ", item)
    if (item.documentType === "BUS") {
      const full: BusFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/bus/records/${item.documentId}`,
      );
      setSelectedBusItem(full);
    }

    if (item.documentType === "SWDI") {
      const full: SwdiFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/swdi/records/${item.documentId}`,
      );
      console.log("Fetched SWDI record:", full, "from ID:", item.id);
      setSelectedSwdiItem(full);
    }

    if (item.documentType === "PCN") {
      const full: PcnFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/pcn/records/${item.documentId}`,
      );
      setSelectedPcnItem(full);
    }
      if (item.documentType === "CVS") {
      
      const full: CvsFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/cvs/records/${item.documentId}`,
      );
      setSelectedCVSItem(full);

    }

    if (item.documentType === "MISC") {
      const full: MiscFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/miscellaneous/records/${item.documentId}`,
      );
      setSelectedMiscItem(full);
    }
  };

  const handleLoad = async (item: AllDocuments) => {
    if (item.documentType === "BUS") {
      const full: BusFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/bus/records/${item.documentId}`,
      );
      dispatch(setCurrentBusForm(full));
      navigate("/bus");
    }
    if (item.documentType === "SWDI") {
      const full: SwdiFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/swdi/records/${item.documentId}`,
      );
      console.log("Full SWDI record:", full);
      dispatch(setCurrentSwdiForm(full));
      navigate("/swdi");
    }
    if (item.documentType === "PCN") {
      const full: PcnFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/pcn/records/${item.documentId}`,
      );
      console.log("Full PCN record:", full);
      dispatch(setCurrentPcnForm(full));
      navigate("/pcn");
    }
        if (item.documentType === "CVS") {
      const full: CvsFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/cvs/records/${item.documentId}`,
      );
      console.log("Full CVS record:", full);
      dispatch(setCurrentCVSForm(full));
      navigate("/cvs");
    }
    if (item.documentType === "MISC") {
      const full: MiscFormFields = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/misc/records/${item.documentId}`,
      );
      dispatch(setCurrentMISCForm(full))

    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await del(`${import.meta.env.VITE_BACKEND_API_URL}/bus/records/${id}`);
      refetch();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="p-6 bg-[#fafaf8] min-h-screen font-sans antialiased">
      <BusViewModal item={selectedBusItem} onClose={() => setSelectedBusItem(null)} />
      <PcnViewModal item={selectedPcnItem} onClose={() => setSelectedPcnItem(null)} />
      <SwdiViewModal item={selectedSwdiItem} onClose={() => setSelectedSwdiItem(null)} />
      <MiscViewModal item={selectedMiscItem} onClose={() => setSelectedMiscItem(null)} />
      <CvsViewModal item={selectedCVSItem} onClose={() => setSelectedCVSItem(null)} /> 


      <div className="bg-white border border-[#e8e8e0] rounded-xl px-6 py-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Layers className="w-4 h-4 text-sky-600" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] font-medium px-2 py-1 rounded-md bg-amber-50 text-sky-600 tracking-wider">
            GR
          </span>
          <h1 className="text-[15px] font-semibold tracking-tight text-[#1a1a18]">
            Global Records
          </h1>
          <span className="text-[13px] text-[#8a8a80]">
            — Other Encoded Records
          </span>
        </div>
      </div>
      {/* ── Action bar ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e8e8e0] rounded-xl p-4 mb-4 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium bg-[#1a1a18] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                size={13}
                className={isLoading ? "animate-spin" : ""}
              />
              {isLoading ? "Refreshing…" : "Refresh"}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-lg border transition-colors cursor-pointer ${
                showFilters
                  ? "bg-[#1a1a18] text-white border-[#1a1a18]"
                  : "bg-white text-[#1a1a18] border-[#e8e8e0] hover:border-[#1a1a18]"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[12px] text-[#8a8a80] hover:text-[#1a1a18] transition-colors cursor-pointer bg-transparent border-none"
              >
                Clear all
              </button>
            )}
          </div>

          <span className="text-[12px] font-mono text-[#8a8a80] bg-[#f5f5f2] px-3 py-1.5 rounded-full">
            {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#e8e8e0]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="HH ID, name, doc type…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Encoded Status</label>
                <select
                  value={filters.encoded}
                  onChange={(e) =>
                    handleFilterChange("encoded", e.target.value)
                  }
                  className={inputCls}
                >
                  <option value="">All Status</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="UPDATED">Updated</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Doc Type</label>
                <select
                  value={filters.docType}
                  onChange={(e) =>
                    handleFilterChange("docType", e.target.value)
                  }
                  className={inputCls}
                >
                  <option value="">All Types</option>
                  <option value="BUS">BUS</option>
                  <option value="SWDI">SWDI</option>
                  <option value="PCN">PCN</option>
                  <option value="MISC">MISC</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Username</label>
                <input
                  type="text"
                  value={filters.username}
                  onChange={(e) =>
                    handleFilterChange("username", e.target.value)
                  }
                  placeholder="Filter by username…"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e8e8e0] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            {/* Head */}
            <thead className="bg-[#fafaf8] border-b border-[#e8e8e0]">
              <tr>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  ID NUMBER
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Doc Type
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Subject of Change
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Username
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Body */}
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
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <InboxIcon size={22} className="text-[#d4d4cc]" />
                      <p className="text-[13px] font-medium text-[#1a1a18]">
                        No records found
                      </p>
                      <p className="text-[12px] text-[#8a8a80]">
                        Try adjusting your filters or refresh
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-indigo-50/20 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}
                  >
                    {/* HH ID */}
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 group">
                        <span className="font-mono text-[11px] text-[#1a1a18]">
                          {item.idNumber}
                        </span>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(item.idNumber)
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none"
                          title="Copy HH ID"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-2.5 text-center text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">
                      {item.name}
                    </td>

                    {/* Doc Type */}
                    <td className="px-4 py-2.5 text-center">
                      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 tracking-wider">
                        {item.documentType}
                      </span>
                    </td>

                    {/* Subject of Change */}
                    <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] max-w-[140px] truncate">
                      {item.subjectOfChange || (
                        <span className="text-[#d4d4cc]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2.5 text-center">
                      <EncodedBadge value={item.remarks} />
                    </td>

                    {/* Username */}
                    <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">
                      {item.govUsername}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-2.5 text-center text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleView(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#1a1a18] bg-white border border-[#e8e8e0] rounded-lg hover:border-[#1a1a18] transition-colors cursor-pointer"
                        >
                          <Eye size={11} /> View
                        </button>
                        <button
                          onClick={() => handleLoad(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <Download size={11} /> Load
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="px-6 py-3.5 border-t border-[#e8e8e0] flex items-center justify-between bg-white">
            <p className="text-[12px] text-[#8a8a80]">
              Showing{" "}
              <span className="font-medium text-[#1a1a18]">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium text-[#1a1a18]">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#1a1a18]">
                {filteredData.length}
              </span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e8e0] text-[#8a8a80] hover:border-[#1a1a18] hover:text-[#1a1a18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white text-[12px]"
              >
                ‹
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                const show =
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1);
                const dots = p === currentPage - 2 || p === currentPage + 2;
                if (dots)
                  return (
                    <span
                      key={p}
                      className="w-8 h-8 flex items-center justify-center text-[#c4c4b8] text-[12px]"
                    >
                      …
                    </span>
                  );
                if (!show) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                      currentPage === p
                        ? "bg-[#1a1a18] text-white border-[#1a1a18]"
                        : "bg-white text-[#8a8a80] border-[#e8e8e0] hover:border-[#1a1a18] hover:text-[#1a1a18]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e8e0] text-[#8a8a80] hover:border-[#1a1a18] hover:text-[#1a1a18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white text-[12px]"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
