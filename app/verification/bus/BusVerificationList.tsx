import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Loader2,
  FileCheck,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type { BusRecord } from "~/types/busTypes";

type BdmGroup = {
  bdm: string;
  total: number;
  verified: number;
  issues: number;
  pending: number;
};

type ListTab = "all" | "needs-review" | "completed" | "has-issues";

// ── Main page ─────────────────────────────────────────────────────────────────
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

  const tabs: { id: ListTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "needs-review", label: "Needs Review" },
    { id: "has-issues", label: "Has Issues" },
    { id: "completed", label: "Completed" },
  ];

  if (isLoading) {
    return (
      <main className="p-6 bg-(--color-bg) min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-(--color-muted)">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[13px]">Loading…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-(--color-bg) min-h-screen font-sans antialiased">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-[22px] font-semibold text-(--color-ink) tracking-tight">
            BUS Verification
          </h1>
          <p className="text-[12px] text-(--color-muted) mt-0.5">
            Select a BDM number to review and verify its records
          </p>
        </div>

        {/* ── Overall progress ─────────────────────────────────────────────── */}
        {totalRecords > 0 && (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
            <div className="flex items-end justify-between mb-3">
              <span className="text-[13px] font-semibold text-(--color-ink)">Overall Progress</span>
              <span className={`text-[20px] font-bold ${overallPct === 100 ? "text-emerald-500" : "text-(--color-ink)"}`}>
                {overallPct}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#f0f0ec] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${overallPct === 100 ? "bg-emerald-400" : "bg-indigo-400"}`}
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[20px] font-bold text-amber-500">{totalPending}</p>
                <p className="text-[11px] text-(--color-muted) mt-0.5">Pending</p>
              </div>
              <div className="border-x border-[#f0f0ec]">
                <p className="text-[20px] font-bold text-emerald-500">{totalVerified}</p>
                <p className="text-[11px] text-(--color-muted) mt-0.5">Verified</p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-red-400">{totalIssues}</p>
                <p className="text-[11px] text-(--color-muted) mt-0.5">Issues</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Controls row ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-(--color-surface) border border-(--color-border) rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer border-none whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-(--color-ink) text-(--color-bg)"
                    : "text-[#6a6a60] hover:text-(--color-ink) hover:bg-[#f0f0ec]"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.id ? "bg-(--color-surface)/20 text-white" : "bg-[#f0f0ec] text-(--color-muted)"
                }`}>
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b8b0] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search BDM number…"
              className="w-full pl-9 pr-9 py-2.5 text-[13px] border border-(--color-border) rounded-xl text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-ink) focus:border-transparent hover:border-(--color-border-hover) transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8b8b0] hover:text-[#6a6a60] transition-colors cursor-pointer bg-transparent border-none"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── BDM list ─────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-16 flex flex-col items-center gap-2 text-(--color-placeholder)">
            <FileCheck size={24} />
            <p className="text-[13px]">
              {search ? `No BDM matches "${search}"` : activeTab !== "all" ? "No BDMs in this category" : "No BUS records found"}
            </p>
            {(search || activeTab !== "all") && (
              <button
                type="button"
                onClick={() => { setSearch(""); setActiveTab("all"); }}
                className="text-[12px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr_140px_auto] gap-4 px-4 py-2.5 border-b border-[#f0f0ec] bg-(--color-bg)">
              <span className="text-[10px] font-semibold text-[#b8b8b0] uppercase tracking-wider">BDM Number</span>
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider hidden sm:block text-right">Pending</span>
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider hidden sm:block text-right">Verified</span>
              <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider hidden sm:block text-right">Issues</span>
              <span className="text-[10px] font-semibold text-[#b8b8b0] uppercase tracking-wider hidden sm:block">Progress</span>
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-(--color-subtle)">
              {filtered.map((group) => {
                const pct = group.total > 0 ? Math.round((group.verified / group.total) * 100) : 0;
                const isComplete = group.verified === group.total && group.total > 0;
                const hasIssues = group.issues > 0;
                const dotColor = isComplete ? "bg-emerald-400" : hasIssues ? "bg-red-400" : "bg-amber-300";

                return (
                  <button
                    key={group.bdm}
                    type="button"
                    onClick={() => navigate(`/verification/bus/${encodeURIComponent(group.bdm)}`)}
                    className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr_1fr_140px_auto] gap-4 items-center px-4 py-3.5 hover:bg-(--color-bg) text-left transition-colors group cursor-pointer"
                  >
                    {/* BDM number */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                      <span className="font-mono text-[13px] font-semibold text-(--color-ink) truncate">
                        {group.bdm}
                      </span>
                      {/* Mobile-only counts */}
                      <div className="flex items-center gap-2 sm:hidden ml-1">
                        {group.pending > 0 && (
                          <span className="text-[10px] text-amber-500 font-medium">{group.pending}p</span>
                        )}
                        {group.verified > 0 && (
                          <span className="text-[10px] text-emerald-500 font-medium">{group.verified}v</span>
                        )}
                        {group.issues > 0 && (
                          <span className="text-[10px] text-red-400 font-medium">{group.issues}i</span>
                        )}
                      </div>
                    </div>

                    {/* Counts (desktop) */}
                    <span className="text-[13px] font-medium text-amber-500 hidden sm:block text-right">{group.pending}</span>
                    <span className="text-[13px] font-medium text-emerald-500 hidden sm:block text-right">{group.verified}</span>
                    <span className={`text-[13px] font-medium hidden sm:block text-right ${group.issues > 0 ? "text-red-400" : "text-(--color-placeholder)"}`}>{group.issues}</span>

                    {/* Progress bar (desktop) */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#f0f0ec] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isComplete ? "bg-emerald-400" : "bg-indigo-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-(--color-muted) w-8 text-right shrink-0">{pct}%</span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={14} className="text-(--color-placeholder) group-hover:text-(--color-ink) transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
