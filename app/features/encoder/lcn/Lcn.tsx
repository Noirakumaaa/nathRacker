import { LcnForm } from "./LcnForm";
import { LcnRecentTable } from "./Lcntable";

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LcnMain() {
  return (
    <div className="min-h-screen bg-(--color-subtle) px-4 py-8 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-6 ">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
          Records Management
        </p>
        <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">
          LCN RECORDS
        </h1>
      </div>

      <LcnForm />
      <LcnRecentTable />
    </div>
  );
}
