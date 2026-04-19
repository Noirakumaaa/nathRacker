import type { StatCard } from "~/types/dashboardTypes";

export function TotalBreakdown({
  stats,
  total,
  isLoading,
}: {
  stats: StatCard[];
  total: number;
  isLoading: boolean;
}) {
  return (
    <div className="bg-(--color-ink) rounded-xl p-6 flex flex-col justify-between">
      <div>
        <p className="text-[11px] font-medium text-(--color-bg)/60 uppercase tracking-wider mb-1">
          Total Encoded
        </p>
        <p className="text-[52px] font-semibold tracking-[-0.05em] text-(--color-bg) leading-none">
          {isLoading ? <span className="inline-block w-24 h-12 bg-(--color-bg)/10 rounded animate-pulse" /> : total.toLocaleString()}
        </p>
        <p className="text-[13px] text-(--color-bg)/60 mt-2">
          records across all modules
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.tag} className="bg-(--color-bg)/10 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-mono text-(--color-bg)/60 tracking-wider">
              {s.tag}
            </p>
            <p className="text-[18px] font-semibold text-(--color-bg) leading-tight mt-0.5">
              {isLoading ? <span className="inline-block w-8 h-5 bg-(--color-surface)/10 rounded animate-pulse" /> : Number(s.value).toLocaleString()}
            </p>
            <div className="mt-1.5 h-1 rounded-full bg-(--color-bg)/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-(--color-bg)/50 transition-all duration-700"
                style={{
                  width:
                    total > 0 ? `${(Number(s.value) / total) * 100}%` : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
