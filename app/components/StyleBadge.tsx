
export function EncodedBadge({ value }: { value: string }) {
  const cls =
    value === "YES"
      ? "bg-emerald-50 text-emerald-600"
      : value === "NO"
        ? "bg-red-50 text-red-500"
        : value === "UPDATED"
          ? "bg-blue-50 text-blue-600"
          : value === "VERIFIED"
            ? "bg-emerald-500 text-white"
            : value === "NOT VERIFIED"
              ? "bg-red-500 text-white"
              : "bg-(--color-subtle) text-(--color-muted)";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}
    >
      {value || "—"}
    </span>
  );
}