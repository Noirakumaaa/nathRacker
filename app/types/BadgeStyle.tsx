
export function RemarksBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    DONE:         "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    PENDING:      "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    "FOR REVIEW": "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
    RETURNED:     "bg-red-50 text-red-500 ring-1 ring-red-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap ${map[value] ?? "bg-[#f5f5f2] text-[#8a8a80]"}`}>
      <span className="w-1 h-1 rounded-full bg-current opacity-70" />
      {value || "—"}
    </span>
  );
}

export function FormTypeChip({ value }: { value: string }) {
  return (
    <span className="inline-block font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-violet-50 text-violet-600 tracking-wider whitespace-nowrap">
      {value || "—"}
    </span>
  );
}