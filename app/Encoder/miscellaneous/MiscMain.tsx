import MiscForm from "./MiscForm";
import MiscRecentTable from "./MiscRecentTable";

export default function MiscMain() {


  return (
    <div className="min-h-screen bg-(--color-subtle) px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
          Records Management - UNDERDEVELOPMENT
        </p>
        <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">
          MISCELLANEOUS
        </h1>
      </div>
      <MiscForm />
      <MiscRecentTable />
    </div>
  );
}