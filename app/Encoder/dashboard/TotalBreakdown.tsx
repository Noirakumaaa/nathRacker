import type { StatCard } from "~/types/dashboardTypes";

export function TotalBreakdown({
  stats,
  total,
}: {
  stats: StatCard[];
  total: number;
}) {
  return (
    <div className="bg-[#1a1a18] rounded-xl p-6 flex flex-col justify-between">
      <div>
        <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">
          Total Encoded
        </p>
        <p className="text-[52px] font-semibold tracking-[-0.05em] text-white leading-none">
          {total.toLocaleString()}
        </p>
        <p className="text-[13px] text-white/50 mt-2">
          records across all modules
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.tag} className="bg-white/5 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-mono text-white/40 tracking-wider">
              {s.tag}
            </p>
            <p className="text-[18px] font-semibold text-white leading-tight mt-0.5">
              {Number(s.value).toLocaleString()}
            </p>
            <div className="mt-1.5 h-1 /*  */rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/40 transition-all duration-700"
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
