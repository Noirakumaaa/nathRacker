import type { DetailTab } from "./types";

type Tab = { id: DetailTab; label: string };

type Props = {
  tabs: Tab[];
  active: DetailTab;
  counts: Record<DetailTab, number>;
  onChange: (tab: DetailTab) => void;
};

export function FilterTabs({ tabs, active, counts, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-(--color-surface) border border-(--color-border) rounded-xl p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer border-none ${
            active === tab.id
              ? "bg-(--color-ink) text-(--color-bg)"
              : "text-[#6a6a60] hover:text-(--color-ink) hover:bg-[#f0f0ec]"
          }`}
        >
          {tab.label}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              active === tab.id
                ? "bg-(--color-surface)/20 text-white"
                : "bg-[#f0f0ec] text-(--color-muted)"
            }`}
          >
            {counts[tab.id]}
          </span>
        </button>
      ))}
    </div>
  );
}
