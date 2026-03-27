
export function EncodedBadge({ value }: { value: string }) {
  const cls =
    value === "YES"
      ? "bg-emerald-50 text-emerald-600"
      : value === "NO"
        ? "bg-red-50 text-red-500"
        : value === "UPDATED"
          ? "bg-blue-50 text-blue-600"
          : "bg-[#f5f5f2] text-[#8a8a80]";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}
    >
      {value || "—"}
    </span>
  );
}