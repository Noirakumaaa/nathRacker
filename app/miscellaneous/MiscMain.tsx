import MiscForm from "./MiscForm";
import MiscRecentTable from "./MiscRecentTable";

export default function MiscMain() {


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
      <MiscForm />
      <MiscRecentTable />
    </div>
  );
}