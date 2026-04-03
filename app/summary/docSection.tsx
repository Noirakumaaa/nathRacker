import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DOC_DOT } from "~/types/SummaryType";
import { EntryRow } from "component/EntryRow";
import type { DocType } from "~/types/SummaryType";
import type { DocTypeSummary } from "~/types/SummaryType";

const statCfg = [
  { key: "encoded" as const, label: "Encoded", cls: "text-green-700 bg-green-50 border-green-200" },
  { key: "updated" as const, label: "Updated", cls: "text-blue-700 bg-blue-50 border-blue-200" },
  { key: "issue"   as const, label: "Issues",  cls: "text-red-600  bg-red-50   border-red-200"  },
];

export function DocSection({ type, summary }: { type: DocType; summary: DocTypeSummary }) {
  const [open, setOpen] = useState(false);
  const total = summary.encoded + summary.updated + summary.issue;

  return (
    <div className="rounded-xl border border-(--color-border) overflow-hidden bg-(--color-surface)">

      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-(--color-subtle) transition-colors text-left group"
      >
        {/* Left — type label + total count */}
        <div className="flex items-center gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: DOC_DOT[type] }}
          />
          <div>
            <p className="text-[13px] font-semibold text-(--color-ink) leading-none">{type}</p>
            <p className="text-[11px] text-(--color-muted) mt-0.5">
              {total === 0 ? "No records" : `${total} record${total !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Right — stat badges + chevron */}
        <div className="flex items-center gap-2">
          {statCfg.map(({ key, label, cls }) => (
            <span
              key={key}
              className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md border ${cls}`}
            >
              <span className="font-bold">{summary[key]}</span>
              <span className="opacity-70">{label}</span>
            </span>
          ))}

          {/* Mobile: compact counts */}
          <div className="flex sm:hidden items-center gap-1.5 text-[11px]">
            <span className="text-green-700 font-semibold">{summary.encoded}</span>
            <span className="text-(--color-placeholder)">/</span>
            <span className="text-blue-700 font-semibold">{summary.updated}</span>
            <span className="text-(--color-placeholder)">/</span>
            <span className="text-red-600 font-semibold">{summary.issue}</span>
          </div>

          <ChevronDown
            size={14}
            className={`text-(--color-muted) transition-transform flex-shrink-0 ml-1 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* ── Expanded entries ── */}
      {open && (
        <div className="border-t border-(--color-border)">

          {/* Column headers */}
          {summary.entries.length > 0 && (
            <div className="grid grid-cols-[72px_1fr_auto] gap-3 px-5 py-2 bg-(--color-bg) border-b border-(--color-border)">
              <span className="text-[10px] font-bold text-(--color-muted) uppercase tracking-widest">Date</span>
              <span className="text-[10px] font-bold text-(--color-muted) uppercase tracking-widest">Record</span>
              <span className="text-[10px] font-bold text-(--color-muted) uppercase tracking-widest">Status</span>
            </div>
          )}

          {summary.entries.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-10 text-center">
              <p className="text-[13px] font-medium text-(--color-ink)">No records this month</p>
              <p className="text-[11px] text-(--color-muted)">Nothing was encoded, updated, or flagged</p>
            </div>
          ) : (
            <div>
              {summary.entries.map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          )}

          {/* Footer summary row */}
          {summary.entries.length > 0 && (
            <div className="px-5 py-3 border-t border-(--color-border) bg-(--color-bg) flex items-center gap-4">
              {statCfg.map(({ key, label, cls }) => (
                <span key={key} className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${cls}`}>
                  {summary[key]} {label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
