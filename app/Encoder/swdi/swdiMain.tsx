import SWDIForm from "./swdiForm"
import SwdiRecent from "./swdiRecent";

export default function SWDIMainContent() {
  return (
    <div className="min-h-screen bg-(--color-subtle) px-4 py-8 sm:px-6 lg:px-10">

      {/* Header */}
      <div className="mb-3 ml-3 mt-3">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
          Records Management
        </p>
        <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">
          SWDI DATA
        </h1>
      </div>

      <SWDIForm />
      <SwdiRecent />
    </div>
  );

}