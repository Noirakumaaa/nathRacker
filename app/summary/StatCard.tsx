export function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="bg-[#f8f8f4] rounded-lg border border-[#e8e8e0] px-4 py-3">
      <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#1a1a18]">{value}</p>
      <p className="text-[11px] text-[#c4c4b8] mt-0.5">{sub}</p>
    </div>
  );
}