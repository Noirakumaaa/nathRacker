import { useState } from "react";
import type { Tab } from "./types";
import RegisterTab from "./RegisterTab";
import OfficeTab from "./OfficeTab";
import LguTab from "./LguTab";
import BarangayTab from "./BarangayTab";
import EmployeesTab from "./EmployeesTab";

const TABS: { id: Tab; label: string }[] = [
  { id: "register", label: "Register" },
  { id: "office", label: "Office" },
  { id: "lgu", label: "LGU" },
  { id: "barangay", label: "Barangay" },
  { id: "employees", label: "Employees" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("register");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-(--color-ink)">Admin Settings</h1>
        <p className="text-[12px] text-(--color-muted) mt-0.5">Manage offices, LGUs, barangays, and employees.</p>
      </div>

      <div className="flex gap-1 border-b border-(--color-border) mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-[12px] font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "text-(--color-ink) border border-b-0 border-(--color-border) bg-(--color-surface) -mb-px"
                : "text-(--color-muted) hover:text-(--color-ink)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "register" && <RegisterTab />}
      {activeTab === "office" && <OfficeTab />}
      {activeTab === "lgu" && <LguTab />}
      {activeTab === "barangay" && <BarangayTab />}
      {activeTab === "employees" && <EmployeesTab />}
    </div>
  );
}
