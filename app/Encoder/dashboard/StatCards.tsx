import { MiniBar } from "./miniBar";
import type { StatCard } from "~/types/dashboardTypes";
import { sparkColor } from "component/styleConfig";

export function StatCards({
  stats,
  sparklines,
}: {
  stats: StatCard[];
  sparklines: Record<string, number[]>;
}) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.tag}
            className="bg-white border border-[#e8e8e0] rounded-xl p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}
              >
                <Icon size={16} className={s.tagClass.split(" ")[1]} />
              </div>
              <span
                className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wider ${s.tagClass}`}
              >
                {s.tag}
              </span>
            </div>
            <div className="mb-3">
              <p className="text-[30px] font-semibold tracking-[-0.04em] text-[#1a1a18] leading-none">
                {s.value.toLocaleString()}
              </p>
              <p className="text-[12px] text-[#8a8a80] mt-1">{s.label}</p>
            </div>
            <MiniBar
              values={sparklines[s.tag] ?? [0, 0, 0, 0, 0, 0, 0]}
              color={sparkColor[s.tag]}
            />
            <p className="text-[11px] text-[#c4c4b8] mt-2">{s.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
