import { useState } from "react";
import { UserPlus, Building2, Map, MapPin, Users } from "lucide-react";
import type { Tab } from "./types";
import RegisterTab from "./RegisterTab";
import OfficeTab from "./OfficeTab";
import LguTab from "./LguTab";
import BarangayTab from "./BarangayTab";
import EmployeesTab from "./EmployeesTab";

const TABS: { id: Tab; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "register",  label: "Register",  desc: "Create accounts",  icon: <UserPlus  size={15} /> },
  { id: "office",    label: "Office",    desc: "Manage offices",   icon: <Building2 size={15} /> },
  { id: "lgu",       label: "LGU",       desc: "Manage LGUs",      icon: <Map       size={15} /> },
  { id: "barangay",  label: "Barangay",  desc: "Manage barangays", icon: <MapPin    size={15} /> },
  { id: "employees", label: "Employees", desc: "Manage staff",     icon: <Users     size={15} /> },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("register");

  return (
    <div className="flex min-h-full">

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-(--color-surface) border-r border-(--color-border) flex flex-col sticky top-0 h-[calc(100vh-4rem)]">

        {/* Header */}
        <div className="px-4 py-4 border-b border-(--color-border)">
          <p className="text-[10px] font-bold text-(--color-muted) uppercase tracking-widest mb-0.5">Admin Panel</p>
          <p className="text-[14px] font-semibold text-(--color-ink)">Settings</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-(--color-ink) text-(--color-bg)"
                    : "hover:bg-(--color-subtle) text-(--color-muted) hover:text-(--color-ink)"
                }`}
              >
                <span className={`shrink-0 ${isActive ? "" : "opacity-50"}`}>{tab.icon}</span>
                <div className="min-w-0">
                  <p className={`text-[13px] font-medium leading-none ${isActive ? "text-(--color-bg)" : "text-(--color-ink)"}`}>
                    {tab.label}
                  </p>
                  <p className={`text-[10px] mt-0.5 truncate ${isActive ? "opacity-55" : "text-(--color-placeholder)"}`}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 min-w-0 bg-(--color-subtle)">
        {activeTab === "register"  && <RegisterTab />}
        {activeTab === "office"    && <OfficeTab />}
        {activeTab === "lgu"       && <LguTab />}
        {activeTab === "barangay"  && <BarangayTab />}
        {activeTab === "employees" && <EmployeesTab />}
      </div>

    </div>
  );
}
