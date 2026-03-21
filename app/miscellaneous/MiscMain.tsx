import React, { useState } from "react";
import MiscForm from "./MiscForm";
import MiscRecentTable from "./MiscRecentTable";
import type { MiscFormFields } from "./../types/miscTypes";

export default function MiscMain() {
  const [currentForm, setCurrentForm] = useState<MiscFormFields | null>(null);
  const [newData, setNewData] = useState(false);

  const handleSuccess = () => {
    setNewData(true);
    setTimeout(() => setNewData(false), 500);
  };

  const handleLoad = (record: MiscFormFields) => {
    const { date, ...rest } = record;
    setCurrentForm({ ...rest, date: new Date().toISOString().slice(0, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">
          Records Management - UNDERDEVELOPMENT
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">
          MISCELLANEOUS
        </h1>
      </div>
      <MiscForm currentForm={currentForm} onSuccess={handleSuccess} />
      <MiscRecentTable newData={newData} onLoad={handleLoad} />
    </div>
  );
}