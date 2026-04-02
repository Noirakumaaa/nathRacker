import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { DOC_DOT } from "~/types/SummaryType";
import { EntryRow } from "component/EntryRow";
import type { DocType } from "~/types/SummaryType";
import type { DocTypeSummary } from "~/types/SummaryType";

export function DocSection({ type, summary }: { type: DocType; summary: DocTypeSummary }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-(--color-border) overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 bg-(--color-surface) hover:bg-[#f8f8f4] transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-[13px] font-medium text-(--color-ink)">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: DOC_DOT[type] }} />
          {type}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 flex-wrap justify-end">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200">
              {summary.encoded} ENCODED
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {summary.updated} UPDATED
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200">
            {summary.issue} ISSUE
            </span>
          </div>
          <ChevronRight
            size={13}
            className={`text-(--color-muted) transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-(--color-border) bg-(--color-surface)">
          {summary.entries.length === 0 ? (
            <p className="text-center text-[13px] text-(--color-muted) py-6">No records this month</p>
          ) : (
            summary.entries.map((e) => <EntryRow key={e.id} entry={e} />)
          )}
        </div>
      )}
    </div>
  );
}