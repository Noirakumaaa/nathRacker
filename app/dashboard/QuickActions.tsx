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
      tagClass: "bg-[#f5f5f2] text-[#8a8a80]",
      icon: Layers,
    },
  ];

  return (
    <div className="bg-white border border-[#e8e8e0] rounded-xl p-6">
      <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider mb-4">
        Quick Actions
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <a
              key={a.href}
              href={a.href}
              className="group flex items-center justify-between p-4 border border-[#e8e8e0] rounded-xl hover:border-[#1a1a18] hover:bg-[#fafaf8] transition-all no-underline"
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={14}
                  className="text-[#8a8a80] group-hover:text-[#1a1a18] transition-colors"
                />
                <span className="text-[13px] font-medium text-[#1a1a18]">
                  {a.label}
                </span>
              </div>
              <ArrowUpRight
                size={13}
                className="text-[#c4c4b8] group-hover:text-[#1a1a18] transition-colors"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
