// ── Base pulse block ──────────────────────────────────────────────────────────

function Pulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

// ── Table row skeleton (for records / my-records tables) ──────────────────────

export function TableRowSkeleton({ cols = 9 }: { cols?: number }) {
  const widths = ["w-24", "w-32", "w-16", "w-28", "w-16", "w-20", "w-20", "w-20", "w-24"];
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3 first:pl-5 last:pr-5">
          <Pulse className={`h-4 ${widths[i] ?? "w-20"}`} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 8, cols = 9 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </>
  );
}

// ── Stat card skeleton (for verification / dashboard stat cards) ──────────────

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2">
      <Pulse className="h-3 w-20" />
      <Pulse className="h-8 w-14" />
      <Pulse className="h-3 w-28" />
    </div>
  );
}

// ── BDM list row skeleton (for verification list) ─────────────────────────────

export function BdmRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
      <Pulse className="w-2.5 h-2.5 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Pulse className="h-4 w-32" />
        <Pulse className="h-3 w-16" />
      </div>
      <Pulse className="h-4 w-8 hidden sm:block" />
      <Pulse className="h-4 w-8 hidden sm:block" />
      <Pulse className="h-4 w-8 hidden sm:block" />
      <div className="hidden sm:flex items-center gap-2 w-40">
        <Pulse className="h-2 flex-1 rounded-full" />
        <Pulse className="h-3 w-8" />
      </div>
      <Pulse className="w-4 h-4 rounded" />
    </div>
  );
}

export function BdmListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <BdmRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Record card skeleton (for verification detail) ────────────────────────────

export function RecordCardSkeleton() {
  return (
    <div className="bg-white border-l-4 border-l-gray-200 border border-gray-100 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Pulse className="h-5 w-48" />
          <Pulse className="h-4 w-28" />
        </div>
        <Pulse className="h-6 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Pulse className="h-2.5 w-16" />
            <Pulse className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Pulse className="h-11 rounded-xl" />
        <Pulse className="h-11 rounded-xl" />
      </div>
    </div>
  );
}

// ── Metric card skeleton (for dashboard/office metric cards) ─────────────────

export function MetricCardSkeleton() {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex flex-col gap-3">
      <Pulse className="h-9 w-9 rounded-lg" />
      <div className="space-y-1.5">
        <Pulse className="h-8 w-16" />
        <Pulse className="h-4 w-28" />
        <Pulse className="h-3 w-20" />
      </div>
    </div>
  );
}

// ── Employee row skeleton (for employees list) ────────────────────────────────

export function EmployeeRowSkeleton() {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between border-b border-(--color-border)">
      <div className="flex items-center gap-3">
        <Pulse className="w-9 h-9 rounded-full shrink-0" />
        <div className="space-y-1.5">
          <Pulse className="h-4 w-36" />
          <Pulse className="h-3 w-24" />
        </div>
      </div>
      <Pulse className="h-5 w-20 rounded-full" />
    </div>
  );
}

// ── List item skeleton (for admin tabs: LGU / Barangay / Office lists) ───────

export function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-(--color-border) bg-(--color-surface)">
      <div className="space-y-1.5 flex-1 mr-2">
        <Pulse className="h-3.5 w-28" />
        <Pulse className="h-3 w-20" />
      </div>
      <Pulse className="h-6 w-6 rounded-md shrink-0" />
    </div>
  );
}

// ── Staff card skeleton (for staff grid in StaffPage) ────────────────────────

export function StaffCardSkeleton() {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Pulse className="w-10 h-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Pulse className="h-4 w-28" />
            <Pulse className="h-3 w-20" />
          </div>
        </div>
        <Pulse className="w-3.5 h-3.5 rounded" />
      </div>
      <Pulse className="h-5 w-20 rounded-full" />
      <div className="space-y-1">
        <Pulse className="h-3.5 w-32" />
        <Pulse className="h-3.5 w-24" />
      </div>
    </div>
  );
}

// ── Progress card skeleton ────────────────────────────────────────────────────

export function ProgressCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Pulse className="h-4 w-36" />
        <Pulse className="h-5 w-10" />
      </div>
      <Pulse className="h-3 w-full rounded-full" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-3 space-y-2">
            <Pulse className="h-7 w-10 mx-auto" />
            <Pulse className="h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
