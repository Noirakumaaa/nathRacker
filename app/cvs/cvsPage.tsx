import { useState } from "react";
import { CvsForm } from "./cvsForm";
import CvsRecentTable from "./cvsRecentTable";
import type { CvsFormFields } from "~/types/cvsTypes";

export default function CvsPage() {
  const [currentForm, setCurrentForm] = useState<CvsFormFields | null>(null);
  const [newData, setNewData] = useState(false);

  const handleSuccess = () => {
    setNewData(true);
    setTimeout(() => setNewData(false), 500);
  };

  const handleLoad = (record: CvsFormFields) => {
    setCurrentForm(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">
      {/* Page Header */}
      <div className="mb-6">
        <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">Records Management</p>
        <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">CVS Entry</h1>
      </div>

      {/* Form */}
      <CvsForm currentForm={currentForm} onSuccess={handleSuccess} />

      {/* Table */}
      <CvsRecentTable newData={newData} onLoad={handleLoad} />
    </div>
  );
}