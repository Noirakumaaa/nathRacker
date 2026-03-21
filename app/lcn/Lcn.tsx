import React, {useState } from "react";
import { LcnForm } from "./LcnForm";
import { LcnRecentTable } from "./Lcntable";
import type { PcnFormFields } from "../types/pcnTypes";
import type { ToastStatus } from "../types/pcnTypes";






// ── Shared classes ────────────────────────────────────────────────────────────
export const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
export const labelCls =
  "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";

export const toastAccent: Record<ToastStatus, string> = {
  success: "#22c55e",
  error: "#ef4444",
};
export const toastIcon: Record<ToastStatus, React.ReactNode> = {
  success: (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};




// ── Main ──────────────────────────────────────────────────────────────────────
export default function PcnMain() {
  const [currentForm, setCurrentForm] = useState<PcnFormFields | null>(null);
  const [newData, setNewData] = useState(false);

  const handleSuccess = () => {
    setNewData(true);
    setTimeout(() => setNewData(false), 500);
  };

  const handleLoad = (record: PcnFormFields) => {
    const { date, ...rest } = record;
    setCurrentForm({ ...rest, date: new Date().toISOString().slice(0, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
 <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="mb-6 ">
            <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">
              Records Management
            </p>
            <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">
              LCN RECORDS
            </h1>
          </div>

          <LcnForm currentForm={currentForm} onSuccess={handleSuccess} />
          <LcnRecentTable newData={newData} onLoad={handleLoad} />

      </div>

  );
}