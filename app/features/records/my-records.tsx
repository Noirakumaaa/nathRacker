import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  InboxIcon, RefreshCw, SlidersHorizontal,
  Eye, FileDown, Trash2, Search, X, Pencil,
  ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import { BusViewModal } from "./busModal";
import { PcnViewModal } from "./pcnModal";
import { SwdiViewModal } from "./swdiModal";
import { MiscViewModal } from "./miscModal";
import { CvsViewModal } from "./cvsModal";
import { DeleteModal } from "./deleteModal";
import { EditModal } from "./editModal";
import { TableSkeleton } from "~/components/Skeleton";
import type { EditModalItem } from "./editModal";
import type { BusFormFields } from "~/types/busTypes";
import type { SwdiFormFields } from "~/types/swdiTypes";
import type { LcnFormFields } from "~/types/lcnTypes";
import type { MiscFormFields } from "~/types/miscTypes";
import type { CvsFormFields } from "~/types/cvsTypes";
import APIFETCH from "~/lib/axios/axiosConfig";
import { inputCls, labelCls, moduleStyle, encodedStyle } from "~/components/styleConfig";
import { EncodedBadge } from "~/components/StyleBadge";
import { useToastStore } from "~/lib/zustand/ToastStore";
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

type DrnBundle = {
  drn: string;
  name: string;
  docs: AllDocuments[];
  latestDate: Date;
};

type FilterState = {
  search: string;
  encoded: string;
  docType: string;
  dateFrom: string;
  dateTo: string;
};

// ── Config ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const FETCH_ENDPOINT: Record<DocType, string> = {
  BUS: "/bus/records", SWDI: "/swdi/record", PCN: "/lcn/record",
  CVS: "/cvs/record",  MISC: "/miscellaneous/record",
};

const LOAD_PATH: Record<DocType, string> = {
  BUS: "bus", SWDI: "swdi", PCN: "lcn", CVS: "cvs", MISC: "miscellaneous",
};

const DOC_TYPES: DocType[] = ["BUS", "SWDI", "PCN", "CVS", "MISC"];
const STATUS_OPTIONS = ["YES", "NO", "UPDATED", "PENDING"];
const EMPTY_FILTERS: FilterState = { search: "", encoded: "", docType: "", dateFrom: "", dateTo: "" };

const DOC_COLOR: Record<string, string> = {
  BUS: "bg-indigo-50 text-indigo-600 border-indigo-100",
  SWDI: "bg-emerald-50 text-emerald-600 border-emerald-100",
  PCN: "bg-rose-50 text-rose-600 border-rose-100",
  CVS: "bg-sky-50 text-sky-600 border-sky-100",
  MISC: "bg-amber-50 text-amber-600 border-amber-100",
};

const DOC_DOT: Record<string, string> = {
  BUS: "bg-indigo-400", SWDI: "bg-emerald-400",
  PCN: "bg-rose-400",   CVS: "bg-sky-400", MISC: "bg-amber-400",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

// ── Main component ─────────────────────────────────────────────────────────────

export function MyRecordsTable() {
  const navigate = useNavigate();
  const { show } = useToastStore();
  const queryClient = useQueryClient();

  // view modals
  const [selectedBusItem,  setSelectedBusItem]  = useState<BusFormFields  | null>(null);
  const [selectedPcnItem,  setSelectedPcnItem]  = useState<LcnFormFields  | null>(null);
  const [selectedSwdiItem, setSelectedSwdiItem] = useState<SwdiFormFields | null>(null);
  const [selectedMiscItem, setSelectedMiscItem] = useState<MiscFormFields | null>(null);
  const [selectedCVSItem,  setSelectedCVSItem]  = useState<CvsFormFields  | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [editItem,    setEditItem]    = useState<EditModalItem | null>(null);

  const [filters,      setFilters]      = useState<FilterState>(EMPTY_FILTERS);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedDrns, setExpandedDrns] = useState<Set<string>>(new Set());

  // ── Data ──────────────────────────────────────────────────────────────────────

  const { data: myDocuments = [], isLoading, refetch } = useQuery<AllDocuments[]>({
    queryKey: ["myDocuments"],
    queryFn: async () => {
      const res = await APIFETCH.get("alldocuments/myRecords");
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data?.records ?? []);
    },
  });

  // ── Filter → Group by DRN ─────────────────────────────────────────────────────

  const filteredDocs = useMemo(() => {
    const s = filters.search.toLowerCase();
    return myDocuments.filter((item) => {
      if (s && ![item.idNumber, item.name, item.drn, item.documentType, item.remarks]
        .some((v) => v?.toLowerCase().includes(s))) return false;
      if (filters.encoded && item.remarks !== filters.encoded) return false;
      if (filters.docType && item.documentType !== filters.docType) return false;
      const d = new Date(item.date);
      if (filters.dateFrom && d < new Date(filters.dateFrom + "T00:00:00")) return false;
      if (filters.dateTo   && d > new Date(filters.dateTo   + "T23:59:59")) return false;
      return true;
    });
  }, [myDocuments, filters]);

  const bundles = useMemo<DrnBundle[]>(() => {
    const map = new Map<string, AllDocuments[]>();
    for (const doc of filteredDocs) {
      const key = doc.drn?.trim() || "__NO_DRN__";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(doc);
    }
    return Array.from(map.entries())
      .map(([drn, docs]) => ({
        drn,
        name: docs[0].name,
        docs,
        latestDate: new Date(Math.max(...docs.map((d) => new Date(d.date).getTime()))),
      }))
      .sort((a, b) => b.latestDate.getTime() - a.latestDate.getTime());
  }, [filteredDocs]);

  const totalPages    = Math.ceil(bundles.length / pageSize);
  const paginatedBundles = bundles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilters = Object.values(filters).filter(Boolean).length;

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => { setFilters(EMPTY_FILTERS); setCurrentPage(1); };

  const toggleExpand = (drn: string) => {
    setExpandedDrns((prev) => {
      const next = new Set(prev);
      next.has(drn) ? next.delete(drn) : next.add(drn);
      return next;
    });
  };

  const toggleExpandAll = () => {
    if (expandedDrns.size === paginatedBundles.length) {
      setExpandedDrns(new Set());
    } else {
      setExpandedDrns(new Set(paginatedBundles.map((b) => b.drn)));
    }
  };

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
      queryClient.invalidateQueries({ queryKey: ["recentCvs", "recentBus", "recentSwdi", "recentMisc", "recentLcn"] });
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
          <h1 className="text-[20px] font-bold text-(--color-ink) tracking-tight">My Records</h1>
          <p className="text-[12px] text-(--color-muted) mt-0.5">Your encoded documents grouped by DRN</p>
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
            {myDocuments.length}
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
            <span className={`w-2 h-2 rounded-full ${DOC_DOT[t]}`} />
            {t}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filters.docType === t ? "bg-white/20 text-(--color-bg)" : "bg-(--color-subtle) text-(--color-muted)"}`}>
              {myDocuments.filter((d) => d.documentType === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search + filter bar ── */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-placeholder) pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search by DRN, name, ID…"
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

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-(--color-border)">
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

      {/* ── Bundle list meta row ── */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-(--color-muted)">
          {bundles.length === 0
            ? "No records found"
            : <><span className="font-semibold text-(--color-ink)">{bundles.length}</span> DRN bundle{bundles.length !== 1 ? "s" : ""} · <span className="font-semibold text-(--color-ink)">{filteredDocs.length}</span> document{filteredDocs.length !== 1 ? "s" : ""}</>
          }
        </p>
        <div className="flex items-center gap-3">
          {bundles.length > 0 && (
            <button
              onClick={toggleExpandAll}
              className="text-[12px] font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
            >
              {expandedDrns.size === paginatedBundles.length ? "Collapse all" : "Expand all"}
            </button>
          )}
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
      </div>

      {/* ── Bundle Cards ── */}
      {isLoading ? (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <table className="min-w-full"><tbody><TableSkeleton rows={6} cols={7} /></tbody></table>
        </div>
      ) : bundles.length === 0 ? (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-20 flex flex-col items-center gap-2">
          <InboxIcon size={28} className="text-(--color-placeholder)" />
          <p className="text-[14px] font-semibold text-(--color-ink)">No records found</p>
          <p className="text-[12px] text-(--color-muted)">Try adjusting your filters or search</p>
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="mt-1 text-[12px] font-medium text-blue-600 hover:underline cursor-pointer bg-transparent border-none">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedBundles.map((bundle) => {
            const isExpanded = expandedDrns.has(bundle.drn);
            const isNoDrn    = bundle.drn === "__NO_DRN__";

            return (
              <div key={bundle.drn} className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden transition-shadow hover:shadow-sm">

                {/* Bundle header — click to expand */}
                <button
                  onClick={() => toggleExpand(bundle.drn)}
                  className="w-full flex items-center gap-5 px-5 py-4 text-left hover:bg-(--color-bg) transition-colors cursor-pointer"
                >
                  {/* DRN + name */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-[15px] font-bold leading-tight ${isNoDrn ? "text-(--color-placeholder) italic" : "text-(--color-ink)"}`}>
                      {isNoDrn ? "No DRN" : bundle.drn}
                    </p>
                    <p className="text-[13px] text-(--color-muted) mt-0.5 truncate">{bundle.name}</p>
                  </div>

                  {/* Doc type chips — unique types only */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    {[...new Set(bundle.docs.map((d) => d.documentType))].map((type) => (
                      <span
                        key={type}
                        className={`inline-flex items-center font-mono text-[12px] font-bold px-3 py-1 rounded-lg border ${DOC_COLOR[type] ?? "bg-(--color-subtle) text-(--color-muted) border-(--color-border)"}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Meta + toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden md:block">
                      <p className="text-[13px] font-medium text-(--color-ink) tabular-nums">
                        {bundle.latestDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-[11px] text-(--color-muted) mt-0.5">
                        {bundle.docs.length} document{bundle.docs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-lg border border-(--color-border) flex items-center justify-center shrink-0 transition-colors ${isExpanded ? "bg-(--color-ink) border-(--color-ink)" : "bg-(--color-surface)"}`}>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-(--color-bg)" : "text-(--color-muted)"}`}
                      />
                    </div>
                  </div>
                </button>

                {/* Expanded document cards */}
                {isExpanded && (
                  <div className="border-t border-(--color-border) bg-(--color-bg) divide-y divide-(--color-border)">
                    {bundle.docs.map((doc) => {
                      const borderColor =
                        doc.documentType === "BUS"  ? "border-indigo-400" :
                        doc.documentType === "SWDI" ? "border-emerald-400" :
                        doc.documentType === "PCN"  ? "border-rose-400" :
                        doc.documentType === "CVS"  ? "border-sky-400" : "border-amber-400";

                      return (
                        <div key={doc.id} className={`flex flex-col gap-4 px-5 py-5 border-l-4 ${borderColor} hover:bg-(--color-surface) transition-colors`}>

                          {/* Top row — info fields */}
                          <div className="flex flex-wrap items-start gap-6">

                            {/* Doc type badge */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-(--color-placeholder) uppercase tracking-widest">Type</span>
                              <span className={`inline-flex items-center font-mono text-[13px] font-bold px-3 py-1.5 rounded-lg ${moduleStyle[doc.documentType] ?? "bg-(--color-subtle) text-(--color-muted)"}`}>
                                {doc.documentType}
                              </span>
                            </div>

                            {/* ID Number */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-(--color-placeholder) uppercase tracking-widest">ID Number</span>
                              <span className="font-mono text-[15px] font-semibold text-(--color-ink) leading-none">{doc.idNumber}</span>
                            </div>

                            {/* Subject of Change */}
                            <div className="flex flex-col gap-1.5 flex-1 min-w-40">
                              <span className="text-[10px] font-semibold text-(--color-placeholder) uppercase tracking-widest">Subject of Change</span>
                              <span className="text-[14px] text-(--color-ink) leading-snug">
                                {doc.subjectOfChange || <span className="text-(--color-placeholder) italic font-normal text-[13px]">None</span>}
                              </span>
                            </div>

                            {/* Date */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-(--color-placeholder) uppercase tracking-widest">Date Encoded</span>
                              <span className="text-[14px] font-medium text-(--color-ink) tabular-nums whitespace-nowrap">
                                {new Date(doc.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                              </span>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] font-semibold text-(--color-placeholder) uppercase tracking-widest">Status</span>
                              <EncodedBadge value={doc.remarks} />
                            </div>
                          </div>

                          {/* Bottom row — actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-(--color-border)">
                            <span className="text-[11px] text-(--color-placeholder) mr-1">Actions:</span>
                            <button
                              onClick={() => handleView(doc)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-(--color-ink) bg-(--color-surface) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:bg-(--color-bg) transition-colors cursor-pointer"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button
                              onClick={() => setEditItem({ documentType: doc.documentType, documentId: doc.documentId })}
                              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors cursor-pointer"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleLoad(doc)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                              <FileDown size={14} /> Load
                            </button>
                            <button
                              onClick={() => setDeleteModal({ open: true, id: doc.id })}
                              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-5 py-3.5 flex items-center justify-between">
          <p className="text-[12px] text-(--color-muted)">
            Page <span className="font-semibold text-(--color-ink)">{currentPage}</span> of <span className="font-semibold text-(--color-ink)">{totalPages}</span>
            <span className="ml-2 text-(--color-placeholder)">·</span>
            <span className="ml-2">
              <span className="font-semibold text-(--color-ink)">{(currentPage - 1) * pageSize + 1}</span>
              {" – "}
              <span className="font-semibold text-(--color-ink)">{Math.min(currentPage * pageSize, bundles.length)}</span>
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
              className="px-2.5 py-1.5 text-[12px] text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)">
              First
            </button>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)">
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
                  <button key={p} onClick={() => setCurrentPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                      currentPage === p
                        ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
                        : "bg-(--color-surface) text-(--color-muted) border-(--color-border) hover:border-(--color-ink) hover:text-(--color-ink)"
                    }`}>
                    {p}
                  </button>
                )
              )}

            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)">
              <ChevronRight size={14} />
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 text-[12px] text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer bg-(--color-surface)">
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
