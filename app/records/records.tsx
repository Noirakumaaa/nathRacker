import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Loader2, InboxIcon, Copy, RefreshCw,
  SlidersHorizontal, Eye, FileDown, Trash2,
  Search, X, ChevronLeft, ChevronRight, Pencil,
} from "lucide-react";
import { BusViewModal } from "./busModal";
import { PcnViewModal } from "./pcnModal";
import { SwdiViewModal } from "./swdiModal";
import { MiscViewModal } from "./miscModal";
import { CvsViewModal } from "./cvsModal";
import { DeleteModal } from "./deleteModal";
import { EditModal } from "./editModal";
import type { EditModalItem } from "./editModal";
import type { BusFormFields } from "./../types/busTypes";
import type { SwdiFormFields } from "~/types/swdiTypes";
import type { LcnFormFields } from "~/types/lcnTypes";
import type { MiscFormFields } from "~/types/miscTypes";
import type { CvsFormFields } from "~/types/cvsTypes";
import APIFETCH from "lib/axios/axiosConfig";
import { inputCls, labelCls, moduleStyle, encodedStyle } from "component/styleConfig";
import { EncodedBadge } from "component/StyleBadge";
import { useToastStore } from "lib/zustand/ToastStore";
import { useQueryClient } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────────────────────────────

type DocType = "BUS" | "SWDI" | "PCN" | "CVS" | "MISC";

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
  drn?: string;
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

// ── Config ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const FETCH_ENDPOINT: Record<DocType, string> = {
  BUS:  "/bus/records",
  SWDI: "/swdi/record",
  PCN:  "/lcn/record",
  CVS:  "/cvs/record",
  MISC: "/miscellaneous/record",
};

const LOAD_PATH: Record<DocType, string> = {
  BUS: "bus", SWDI: "swdi", PCN: "lcn", CVS: "cvs", MISC: "miscellaneous",
};

const DOC_TYPES: DocType[] = ["BUS", "SWDI", "PCN", "CVS", "MISC"];
const STATUS_OPTIONS = ["YES", "NO", "UPDATED", "PENDING"];
const EMPTY_FILTERS: FilterState = { search: "", encoded: "", docType: "", dateFrom: "", dateTo: "", username: "" };

// ── Helpers ────────────────────────────────────────────────────────────────────

function Dash() {
  return <span className="text-(--color-placeholder)">—</span>;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function RecordsTable() {
  const navigate = useNavigate();
  const { show } = useToastStore();
  const queryClient = useQueryClient()

  // view modals
  const [selectedBusItem,  setSelectedBusItem]  = useState<BusFormFields  | null>(null);
  const [selectedPcnItem,  setSelectedPcnItem]  = useState<LcnFormFields  | null>(null);
  const [selectedSwdiItem, setSelectedSwdiItem] = useState<SwdiFormFields | null>(null);
  const [selectedMiscItem, setSelectedMiscItem] = useState<MiscFormFields | null>(null);
  const [selectedCVSItem,  setSelectedCVSItem]  = useState<CvsFormFields  | null>(null);

  // delete modal
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  // edit modal
  const [editItem, setEditItem] = useState<EditModalItem | null>(null);

  // filters, pagination, per-page
  const [filters,      setFilters]      = useState<FilterState>(EMPTY_FILTERS);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [pageSize,     setPageSize]     = useState(25);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────────

  const { data: allDocuments = [], isLoading, refetch } = useQuery<AllDocuments[]>({
    queryKey: ["allDocuments"],
    queryFn: async () => (await APIFETCH.get("alldocuments/globalRecords")).data,
  });


  // per-type counts shown in the stats bar
  const typeCounts = useMemo(() =>
    DOC_TYPES.reduce((acc, t) => {
      acc[t] = allDocuments.filter((d) => d.documentType === t).length;
      return acc;
    }, {} as Record<DocType, number>),
  [allDocuments]);

  const filteredData = useMemo(() => {
    const s = filters.search.toLowerCase();
    return allDocuments.filter((item) => {
      if (s && ![item.idNumber, item.name, item.documentType, item.remarks, item.govUsername, item.drn]
        .some((v) => v?.toLowerCase().includes(s))) return false;
      if (filters.encoded  && item.remarks !== filters.encoded) return false;
      if (filters.docType  && item.documentType !== filters.docType) return false;
      if (filters.username && !item.govUsername.toLowerCase().includes(filters.username.toLowerCase())) return false;
      const d = new Date(item.date);
      if (filters.dateFrom && d < new Date(filters.dateFrom + "T00:00:00")) return false;
      if (filters.dateTo   && d > new Date(filters.dateTo   + "T23:59:59")) return false;
      return true;
    });
  }, [allDocuments, filters]);

  const totalPages    = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilters = Object.values(filters).filter(Boolean).length;

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => { setFilters(EMPTY_FILTERS); setCurrentPage(1); };

  const handleView = async (item: AllDocuments) => {
    const type     = item.documentType as DocType;
    const endpoint = FETCH_ENDPOINT[type];
    if (!endpoint) return;
    const { data } = await APIFETCH.get(`${endpoint}/${item.documentId}`);
    if (type === "BUS")  setSelectedBusItem(data);
    if (type === "SWDI") setSelectedSwdiItem(data);
    if (type === "PCN")  setSelectedPcnItem(data);
    if (type === "CVS")  setSelectedCVSItem(data);
    if (type === "MISC") setSelectedMiscItem(data);
  };

  const handleLoad = (item: AllDocuments) => {
    const path = LOAD_PATH[item.documentType as DocType];
    if (path) navigate(`/${path}/${item.documentId}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return;
    try {
      const res = await APIFETCH.delete(`/alldocuments/delete/${deleteModal.id}`);
      show(res.data.message, res.data.deleted ? "success" : "error");
      queryClient.invalidateQueries({queryKey : ["recentCvs","recentBus", "recentSwdi", "recentMisc", "recentLcn"]})
      if (res.data.deleted) await refetch();
    } catch {
      show("Failed to delete record.", "error");
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="p-5 bg-(--color-bg) min-h-screen font-sans antialiased space-y-4">

      {/* ── Modals ── */}
      <DeleteModal open={deleteModal.open} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteModal({ open: false, id: null })} />
      <EditModal item={editItem} onClose={() => setEditItem(null)} onSaved={() => refetch()} />
      <BusViewModal  item={selectedBusItem}  onClose={() => setSelectedBusItem(null)} />
      <PcnViewModal  item={selectedPcnItem}  onClose={() => setSelectedPcnItem(null)} />
      <SwdiViewModal item={selectedSwdiItem} onClose={() => setSelectedSwdiItem(null)} />
      <MiscViewModal item={selectedMiscItem} onClose={() => setSelectedMiscItem(null)} />
      <CvsViewModal  item={selectedCVSItem}  onClose={() => setSelectedCVSItem(null)} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold text-(--color-ink) tracking-tight">Global Records</h1>
          <p className="text-[12px] text-(--color-muted) mt-0.5">All encoded documents across offices</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-(--color-ink) text-(--color-bg) rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* ── Type stats chips ── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("docType", "")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
            !filters.docType
              ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
              : "bg-(--color-surface) text-(--color-muted) border-(--color-border) hover:border-(--color-ink) hover:text-(--color-ink)"
          }`}
        >
          All
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${!filters.docType ? "bg-white/20 text-(--color-bg)" : "bg-(--color-subtle) text-(--color-muted)"}`}>
            {allDocuments.length}
          </span>
        </button>

        {DOC_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter("docType", filters.docType === t ? "" : t)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
              filters.docType === t
                ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
                : "bg-(--color-surface) text-(--color-muted) border-(--color-border) hover:border-(--color-ink) hover:text-(--color-ink)"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              t === "BUS"  ? "bg-indigo-400" :
              t === "SWDI" ? "bg-emerald-400" :
              t === "PCN"  ? "bg-rose-400" :
              t === "CVS"  ? "bg-sky-400" : "bg-amber-400"
            }`} />
            {t}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filters.docType === t ? "bg-white/20 text-(--color-bg)" : "bg-(--color-subtle) text-(--color-muted)"}`}>
              {typeCounts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + filter bar ── */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 space-y-3">

        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-placeholder) pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search by ID, name, username, DRN…"
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-(--color-border) rounded-lg text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-ink) focus:border-transparent hover:border-(--color-border-hover) transition-colors"
            />
            {filters.search && (
              <button onClick={() => setFilter("search", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-placeholder) hover:text-(--color-muted) cursor-pointer bg-transparent border-none">
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-lg border transition-colors cursor-pointer shrink-0 ${
              showAdvanced || activeFilters > 1
                ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
                : "bg-(--color-surface) text-(--color-ink) border-(--color-border) hover:border-(--color-ink)"
            }`}
          >
            <SlidersHorizontal size={13} />
            Filters
            {activeFilters > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">{activeFilters}</span>
            )}
          </button>

          {activeFilters > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-(--color-muted) hover:text-(--color-ink) border border-(--color-border) hover:border-(--color-ink) rounded-lg transition-colors cursor-pointer bg-transparent shrink-0">
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Status quick-filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter("encoded", filters.encoded === s ? "" : s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                filters.encoded === s
                  ? encodedStyle(s) + " border-current"
                  : "bg-(--color-subtle) text-(--color-muted) border-(--color-border) hover:border-(--color-border-hover)"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-(--color-border)">
            <div>
              <label className={labelCls}>Username</label>
              <input type="text" value={filters.username} onChange={(e) => setFilter("username", e.target.value)} placeholder="Filter by username…" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date From</label>
              <input type="date" value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date To</label>
              <input type="date" value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)} className={inputCls} />
            </div>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">

        {/* Table meta row */}
        <div className="px-5 py-3 border-b border-(--color-border) flex items-center justify-between">
          <p className="text-[12px] text-(--color-muted)">
            {filteredData.length === allDocuments.length
              ? <><span className="font-semibold text-(--color-ink)">{allDocuments.length}</span> total records</>
              : <><span className="font-semibold text-(--color-ink)">{filteredData.length}</span> of {allDocuments.length} records</>
            }
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-(--color-muted)">Show</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="text-[12px] font-medium text-(--color-ink) border border-(--color-border) rounded-lg px-2 py-1 bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-ink) cursor-pointer hover:border-(--color-border-hover) transition-colors"
            >
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-[11px] text-(--color-muted)">per page</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-(--color-bg) border-b border-(--color-border)">
                {["ID Number", "Name", "Type", "Subject of Change", "DRN", "Status", "Username", "Date", "Actions"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-[10px] font-bold text-(--color-muted) uppercase tracking-widest whitespace-nowrap first:pl-5 last:pr-5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-(--color-placeholder)">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-[13px]">Loading records…</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <InboxIcon size={28} className="text-(--color-placeholder)" />
                      <p className="text-[14px] font-semibold text-(--color-ink)">No records found</p>
                      <p className="text-[12px] text-(--color-muted)">Try adjusting your filters or search</p>
                      {activeFilters > 0 && (
                        <button onClick={clearFilters} className="mt-1 text-[12px] font-medium text-blue-600 hover:underline cursor-pointer bg-transparent border-none">
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="border-b border-(--color-subtle) hover:bg-(--color-bg) transition-colors group">

                    {/* ID Number */}
                    <td className="px-4 py-3 pl-5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[12px] font-medium text-(--color-ink)">{item.idNumber}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(item.idNumber)}
                          title="Copy ID"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-(--color-placeholder) hover:text-(--color-muted) cursor-pointer bg-transparent border-none p-0"
                        >
                          <Copy size={11} />
                        </button>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-medium text-(--color-ink) whitespace-nowrap">{item.name}</span>
                    </td>

                    {/* Doc type */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-1 rounded-md ${moduleStyle[item.documentType] ?? "bg-(--color-subtle) text-(--color-muted)"}`}>
                        {item.documentType}
                      </span>
                    </td>

                    {/* Subject of change */}
                    <td className="px-4 py-3 max-w-40">
                      <span className="text-[12px] text-(--color-muted) block truncate" title={item.subjectOfChange}>
                        {item.subjectOfChange || <Dash />}
                      </span>
                    </td>

                    {/* DRN */}
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--color-muted) whitespace-nowrap">{item.drn || <Dash />}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <EncodedBadge value={item.remarks} />
                    </td>

                    {/* Username */}
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--color-muted) whitespace-nowrap">{item.govUsername}</span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--color-muted) whitespace-nowrap tabular-nums">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 pr-5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-(--color-ink) bg-(--color-surface) border border-(--color-border) rounded-lg hover:border-(--color-ink) transition-colors cursor-pointer"
                        >
                          <Eye size={11} /> View
                        </button>
                        <button
                          onClick={() => setEditItem({ documentType: item.documentType, documentId: item.documentId })}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-violet-600 bg-violet-50 border border-violet-100 rounded-lg hover:bg-violet-100 transition-colors cursor-pointer"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          onClick={() => handleLoad(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <FileDown size={11} /> Load
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: item.id })}
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

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-(--color-border) flex items-center justify-between">
            <p className="text-[12px] text-(--color-muted)">
              Page <span className="font-semibold text-(--color-ink)">{currentPage}</span> of <span className="font-semibold text-(--color-ink)">{totalPages}</span>
              <span className="ml-2 text-(--color-placeholder)">·</span>
              <span className="ml-2">
                <span className="font-semibold text-(--color-ink)">{(currentPage - 1) * pageSize + 1}</span>
                {" – "}
                <span className="font-semibold text-(--color-ink)">{Math.min(currentPage * pageSize, filteredData.length)}</span>
              </span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-[12px] text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-(--color-placeholder) text-[12px]">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                        currentPage === p
                          ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
                          : "bg-(--color-surface) text-(--color-muted) border-(--color-border) hover:border-(--color-ink) hover:text-(--color-ink)"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)"
              >
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 text-[12px] text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
