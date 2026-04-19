type Props = {
  pending: number;
  verified: number;
  issue: number;
};

export function ProgressCard({ pending, verified, issue }: Props) {
  const total = pending + verified + issue;
  const progress = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-(--color-ink)">
          Verification Progress
        </span>
        <span className={`text-lg font-bold ${progress === 100 ? "text-emerald-500" : "text-(--color-ink)"}`}>
          {progress}%
        </span>
      </div>

      <div className="h-3 w-full bg-(--color-subtle) rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-emerald-400" : "bg-indigo-400"}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-500">{pending}</p>
          <p className="text-xs text-amber-500 mt-0.5 font-medium">Pending</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-500">{verified}</p>
          <p className="text-xs text-emerald-500 mt-0.5 font-medium">Verified</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{issue}</p>
          <p className="text-xs text-red-400 mt-0.5 font-medium">Issues</p>
        </div>
      </div>
    </div>
  );
}
