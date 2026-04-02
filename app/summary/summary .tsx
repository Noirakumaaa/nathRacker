import { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { MONTHS, DOC_TYPES } from "~/types/SummaryType";
import { useMonthlySummary } from "component/Usemonthlysummary";
import { downloadAccomplishment } from "./summaryHelpers";
import { StatCard } from "./StatCard"
import { DocSection } from "./docSection"

const selectCls =
  "text-[13px] text-[#1a1a18] px-3 py-1.5 rounded-lg border border-[#e8e8e0] bg-(--color-surface) hover:border-[#1a1a18] transition-colors outline-none cursor-pointer";

export default function SummaryPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading, isError, error } = useMonthlySummary(month, year);

  const years = Array.from({ length: now.getFullYear() - 2022 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="bg-(--color-surface) rounded-xl border border-[#e8e8e0] overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">Monthly Summary</p>
          <p className="text-[13px] text-[#1a1a18] font-medium mt-0.5">{MONTHS[month - 1]} {year}</p>
        </div>
        <div className="flex gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectCls}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-[#8a8a80] gap-2">
            <Loader2 size={15} className="animate-spin" />
            <span className="text-[13px]">Loading summary...</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
            <AlertCircle size={15} />
            <span>Failed to load summary. {(error as Error)?.message}</span>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Total Encoded" value={data.totals.encoded} sub="All document types" />
              <StatCard label="Total Updated" value={data.totals.updated} sub="Change requests" />
              <StatCard label="Issues Filed" value={data.totals.issue} sub="Flagged records" />
              <StatCard label="Document Types" value={DOC_TYPES.length} sub="Active modules" />
            </div>

            <div className="pb-2 border-b border-[#e8e8e0]">
              <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Document Breakdown</h3>
            </div>

            <div className="space-y-2">
              {DOC_TYPES.map((type) => (
                <DocSection key={type} type={type} summary={data[type]} />
              ))}
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => downloadAccomplishment(month, year, data)}
                className="flex items-center gap-2 h-10 px-4 bg-[#1a1a18] text-white text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors cursor-pointer"
              >
                <Download size={13} />
                Download Accomplishment Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
