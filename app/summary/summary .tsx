import { useState } from "react";
import { Download, Loader2, AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import { MONTHS, DOC_TYPES } from "~/types/SummaryType";
import { useMonthlySummary } from "component/Usemonthlysummary";
import { downloadAccomplishment } from "./summaryHelpers";
import { StatCard } from "./StatCard";
import { DocSection } from "./docSection";

const selectCls =
  "text-[13px] text-(--color-ink) px-3 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) hover:border-(--color-ink) transition-colors outline-none cursor-pointer focus:ring-2 focus:ring-(--color-ink)";

export default function SummaryPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading, isError, error, refetch } = useMonthlySummary(month, year);

  const years = Array.from({ length: now.getFullYear() - 2022 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="min-h-screen bg-(--color-subtle) px-4 py-8 sm:px-6 lg:px-10">

      {/* ── Page header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
            Reports
          </p>
          <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">
            Monthly Summary
          </h1>
          <p className="text-[13px] text-(--color-muted) mt-1">
            {MONTHS[month - 1]} {year}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectCls}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-[13px] font-medium border border-(--color-border) bg-(--color-surface) text-(--color-ink) rounded-lg hover:border-(--color-ink) transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-(--color-muted)">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-[13px]">Loading summary…</span>
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
          <AlertCircle size={16} className="shrink-0" />
          <span>Failed to load summary. {(error as Error)?.message}</span>
        </div>
      )}

      {/* ── Data ── */}
      {data && (
        <div className="space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Encoded"   value={data.totals.encoded} sub="All document types" />
            <StatCard label="Total Updated"   value={data.totals.updated} sub="Change requests"    />
            <StatCard label="Issues Filed"    value={data.totals.issue}   sub="Flagged records"    />
            <StatCard label="Document Types"  value={DOC_TYPES.length}    sub="Active modules"     />
          </div>

          {/* Document breakdown */}
          <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">

            {/* Section header */}
            <div className="px-5 py-4 border-b border-(--color-border) flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BarChart3 size={15} className="text-(--color-muted)" />
                <div>
                  <p className="text-[13px] font-semibold text-(--color-ink)">Document Breakdown</p>
                  <p className="text-[11px] text-(--color-muted) mt-0.5">Expand a type to view individual records</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadAccomplishment(month, year, data)}
                className="inline-flex items-center gap-2 h-9 px-4 bg-(--color-ink) text-(--color-bg) text-[12px] font-medium rounded-lg hover:opacity-85 transition-opacity cursor-pointer"
              >
                <Download size={12} />
                Download Report
              </button>
            </div>

            {/* Doc type sections */}
            <div className="p-4 space-y-2">
              {DOC_TYPES.map((type) => (
                <DocSection key={type} type={type} summary={data[type]} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
