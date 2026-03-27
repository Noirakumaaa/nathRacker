import SWDIForm from "./swdiForm"
import SwdiRecent from "./swdiRecent";

export default function SWDIMainContent() {
  return (
    <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">

      {/* Header */}
      <div className="mb-3 ml-3 mt-3">
        <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">
          Records Management
        </p>
        <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">
          SWDI DATA
        </h1>
      </div>

      <SWDIForm />
      <SwdiRecent />
    </div>
  );

}