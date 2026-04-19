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
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-1.5 flex flex-col gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer border-none ${
            active === tab.id
              ? "bg-(--color-ink) text-(--color-bg)"
              : "text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-subtle)"
          }`}
        >
          <span>{tab.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            active === tab.id
              ? "bg-white/20 text-white"
              : "bg-(--color-subtle) text-(--color-muted)"
          }`}>
            {counts[tab.id]}
          </span>
        </button>
      ))}
    </div>
  );
}
