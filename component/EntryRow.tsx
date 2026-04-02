import { fmtDate } from "~/summary/summaryHelpers";
import type { SummaryEntry } from "~/types/SummaryType";

export function EntryRow({ entry }: { entry: SummaryEntry }) {
  const badge =
    entry.type === "issue"
      ? "bg-red-50 text-red-600 border border-red-200"
      : entry.type === "update"
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : "bg-green-50 text-green-600 border border-green-200";

  const label =
    entry.type === "issue" ? "ISSUE" : entry.type === "update" ? "UPDATED" : "ENCODED";

  return (
    <div className="grid grid-cols-[72px_1fr_auto] gap-3 items-start px-5 py-2.5 border-b border-(--color-border) last:border-0">
      <span className="text-[11px] text-(--color-muted) pt-0.5 font-mono">{fmtDate(entry.date)}</span>
      <div>
        <p className="text-[13px] text-(--color-ink) leading-snug">{entry.remarks}</p>
        {entry.type === "issue" && entry.issue && (
          <p className="text-[11px] text-(--color-muted) mt-0.5">Issue: {entry.issue}</p>
        )}
        <p className="text-[11px] text-(--color-placeholder) mt-0.5">{entry.hhId} · {entry.name}</p>
      </div>
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap ${badge}`}>
        {label}
      </span>
    </div>
  );
}