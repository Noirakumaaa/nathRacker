import {
  FileText,
  IdCard,
  FileInput,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { moduleStyle } from "component/styleConfig";

export function QuickActions() {
  const actions = [
    {
      label: "New BUS Entry",
      href: "/bus",
      tag: "BUS",
      tagClass: moduleStyle.BUS,
      icon: FileText,
    },
    {
      label: "New PCN Entry",
      href: "/PCN",
      tag: "PCN",
      tagClass: moduleStyle.PCN,
      icon: IdCard,
    },
    {
      label: "New SWDI Entry",
      href: "/swdi",
      tag: "SWDI",
      tagClass: moduleStyle.SWDI,
      icon: FileInput,
    },
    {
      label: "View All Records",
      href: "/records",
      tag: "ALL",
      tagClass: "bg-(--color-subtle) text-(--color-muted)",
      icon: Layers,
    },
  ];

  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6">
      <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider mb-4">
        Quick Actions
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <a
              key={a.href}
              href={a.href}
              className="group flex items-center justify-between p-4 border border-(--color-border) rounded-xl hover:border-(--color-ink) hover:bg-(--color-bg) transition-all no-underline"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={14}
                  className="text-(--color-muted) group-hover:text-(--color-ink) transition-colors"
                />
                <span className="text-[13px] font-medium text-(--color-ink)">
                  {a.label}
                </span>
              </div>
              <ArrowUpRight
                size={13}
                className="text-(--color-placeholder) group-hover:text-(--color-ink) transition-colors"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
