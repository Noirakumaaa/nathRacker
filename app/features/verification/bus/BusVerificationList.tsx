import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  FileCheck,
  Search,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutList,
} from "lucide-react";
import APIFETCH from "~/lib/axios/axiosConfig";
import type { BusRecord } from "~/types/busTypes";
import { StatCardSkeleton, BdmListSkeleton } from "~/components/Skeleton";

type BdmGroup = {
  bdm: string;
  total: number;
  verified: number;
  issues: number;
  pending: number;
};

type ListTab = "all" | "needs-review" | "completed" | "has-issues";

export default function BusVerificationList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ListTab>("all");

  const { data: records = [], isLoading } = useQuery<BusRecord[]>({
    queryKey: ["busAll"],
    queryFn: async () => {
      const res = await APIFETCH.get("/bus/verification");
      return res.data;
    },
  });

  const bdmGroups = useMemo<BdmGroup[]>(() => {
    const map = new Map<string, BusRecord[]>();
    for (const r of records) {
      const key = r.drn?.trim() || "(No DRN)";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries())
      .map(([bdm, recs]) => {
        const verified = recs.filter((r) => r.verified === "YES").length;
        const issues = recs.filter((r) => r.verified === "ISSUE").length;
        return {
          bdm,
          total: recs.length,
          verified,
          issues,
          pending: recs.length - verified - issues,
        };
      })
      .sort((a, b) => a.bdm.localeCompare(b.bdm));
  }, [records]);

  const tabCounts = useMemo(
    () => ({
      all: bdmGroups.length,
      "needs-review": bdmGroups.filter((g) => g.pending > 0).length,
      completed: bdmGroups.filter((g) => g.verified === g.total && g.total > 0).length,
      "has-issues": bdmGroups.filter((g) => g.issues > 0).length,
    }),
    [bdmGroups],
  );

  const totalVerified = bdmGroups.reduce((s, g) => s + g.verified, 0);
  const totalRecords = bdmGroups.reduce((s, g) => s + g.total, 0);
  const totalIssues = bdmGroups.reduce((s, g) => s + g.issues, 0);
  const totalPending = bdmGroups.reduce((s, g) => s + g.pending, 0);
  const overallPct = totalRecords > 0 ? Math.round((totalVerified / totalRecords) * 100) : 0;

  const filtered = useMemo(() => {
    let list = bdmGroups;
    if (activeTab === "needs-review") list = list.filter((g) => g.pending > 0);
    else if (activeTab === "completed") list = list.filter((g) => g.verified === g.total && g.total > 0);
    else if (activeTab === "has-issues") list = list.filter((g) => g.issues > 0);
    const q = search.toLowerCase().trim();
    if (!q) return list;
    return list.filter((g) => g.bdm.toLowerCase().includes(q));
  }, [bdmGroups, activeTab, search]);

  const tabs: { id: ListTab; label: string; color: string }[] = [
    { id: "all",          label: "All",          color: "text-gray-600" },
    { id: "needs-review", label: "Needs Review",  color: "text-amber-600" },
    { id: "has-issues",   label: "Has Issues",    color: "text-red-500" },
    { id: "completed",    label: "Completed",     color: "text-emerald-600" },
  ];

  if (isLoading) {
    return (
      <main className="bg-(--color-bg) min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-2">
          <div className="h-3 w-24 animate-pulse bg-gray-200 rounded" />
          <div className="h-7 w-48 animate-pulse bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="h-3 w-full animate-pulse bg-gray-200 rounded-full mb-6" />
        <BdmListSkeleton rows={8} />
      </main>
    );
  }

  return (
    <main className="bg-(--color-bg) min-h-screen px-4 py-6 sm:px-6 lg:px-8">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
          Verification
        </p>
        <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">
          BUS Verification
        </h1>
        <p className="text-sm text-(--color-muted) mt-1">
          Select a BDM number to review and verify its records
        </p>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────────── */}
      {totalRecords > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <LayoutList size={15} className="text-(--color-muted)" />
              <span className="text-xs font-medium text-(--color-muted) uppercase tracking-wide">Total</span>
            </div>
            <p className="text-3xl font-bold text-(--color-ink)">{totalRecords}</p>
            <p className="text-xs text-(--color-muted) mt-0.5">records across {bdmGroups.length} BDMs</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={15} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">Pending</span>
            </div>
            <p className="text-3xl font-bold text-amber-500">{totalPending}</p>
            <p className="text-xs text-amber-400 mt-0.5">awaiting review</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Verified</span>
            </div>
            <p className="text-3xl font-bold text-emerald-500">{totalVerified}</p>
            <p className="text-xs text-emerald-400 mt-0.5">{overallPct}% complete</p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={15} className="text-red-400" />
              <span className="text-xs font-medium text-red-500 uppercase tracking-wide">Issues</span>
            </div>
            <p className="text-3xl font-bold text-red-400">{totalIssues}</p>
            <p className="text-xs text-red-300 mt-0.5">need attention</p>
          </div>
        </div>
      )}

      {/* ── Overall progress bar ─────────────────────────────────────────────── */}
      {totalRecords > 0 && (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-(--color-ink)">Overall Progress</span>
            <span className={`text-sm font-bold ${overallPct === 100 ? "text-emerald-500" : "text-(--color-ink)"}`}>
              {overallPct}%
            </span>
          </div>
          <div className="h-3 w-full bg-(--color-subtle) rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overallPct === 100 ? "bg-emerald-400" : "bg-indigo-400"}`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Controls row ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-(--color-surface) border border-(--color-border) rounded-xl p-1 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer border-none whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-(--color-ink) text-(--color-bg)"
                  : `${tab.color} hover:bg-(--color-subtle)`
              }`}
            >
              {tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-(--color-subtle) text-(--color-muted)"
              }`}>
                {tabCounts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-placeholder) pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BDM number…"
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-(--color-border) rounded-xl text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-ink) focus:border-transparent hover:border-(--color-border-hover) transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-placeholder) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── BDM list ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-20 flex flex-col items-center gap-3 text-(--color-placeholder)">
          <FileCheck size={28} />
          <p className="text-sm">
            {search
              ? `No BDM matches "${search}"`
              : activeTab !== "all"
              ? "No BDMs in this category"
              : "No BUS records found"}
          </p>
          {(search || activeTab !== "all") && (
            <button
              type="button"
              onClick={() => { setSearch(""); setActiveTab("all"); }}
              className="text-sm text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_90px_90px_90px_160px_32px] gap-4 px-5 py-3 border-b border-(--color-border) bg-(--color-subtle)">
            <span className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider">BDM Number</span>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider hidden sm:block text-right">Pending</span>
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider hidden sm:block text-right">Verified</span>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider hidden sm:block text-right">Issues</span>
            <span className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider hidden sm:block">Progress</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-(--color-border)">
            {filtered.map((group) => {
              const pct = group.total > 0 ? Math.round((group.verified / group.total) * 100) : 0;
              const isComplete = group.verified === group.total && group.total > 0;
              const hasIssues = group.issues > 0;

              const statusDot = isComplete
                ? "bg-emerald-400"
                : hasIssues
                ? "bg-red-400"
                : "bg-amber-300";

              const rowBg = isComplete
                ? "hover:bg-emerald-50/40"
                : hasIssues
                ? "hover:bg-red-50/30"
                : "hover:bg-(--color-subtle)";

              return (
                <button
                  key={group.bdm}
                  type="button"
                  onClick={() => navigate(`/verification/bus/${encodeURIComponent(group.bdm)}`)}
                  className={`w-full grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_90px_90px_90px_160px_32px] gap-4 items-center px-5 py-4 text-left transition-colors group cursor-pointer ${rowBg}`}
                >
                  {/* BDM number */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot}`} />
                    <div className="min-w-0">
                      <span className="font-mono text-sm font-bold text-(--color-ink) truncate block">
                        {group.bdm}
                      </span>
                      <span className="text-xs text-(--color-muted)">{group.total} record{group.total !== 1 ? "s" : ""}</span>
                    </div>
                    {/* Mobile counts */}
                    <div className="flex items-center gap-2 sm:hidden ml-auto">
                      {group.pending > 0 && (
                        <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">{group.pending}p</span>
                      )}
                      {group.verified > 0 && (
                        <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">{group.verified}v</span>
                      )}
                      {group.issues > 0 && (
                        <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-full font-semibold">{group.issues}i</span>
                      )}
                    </div>
                  </div>

                  {/* Desktop counts */}
                  <span className="text-sm font-semibold text-amber-500 hidden sm:block text-right">{group.pending}</span>
                  <span className="text-sm font-semibold text-emerald-500 hidden sm:block text-right">{group.verified}</span>
                  <span className={`text-sm font-semibold hidden sm:block text-right ${group.issues > 0 ? "text-red-400" : "text-(--color-placeholder)"}`}>
                    {group.issues}
                  </span>

                  {/* Progress bar */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="flex-1 h-2 bg-(--color-subtle) rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-400" : "bg-indigo-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-(--color-muted) w-9 text-right shrink-0">{pct}%</span>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={16} className="text-(--color-placeholder) group-hover:text-(--color-ink) transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
