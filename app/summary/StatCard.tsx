export function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="bg-[#f8f8f4] rounded-lg border border-(--color-border) px-4 py-3">
      <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-semibold text-(--color-ink)">{value}</p>
      <p className="text-[11px] text-(--color-placeholder) mt-0.5">{sub}</p>
    </div>
  );
}