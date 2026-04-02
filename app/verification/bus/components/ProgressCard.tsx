type Props = {
  pending: number;
  verified: number;
  issue: number;
};

export function ProgressCard({ pending, verified, issue }: Props) {
  const total = pending + verified + issue;
  const progress = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-medium text-[#6a6a60]">
          Verification Progress
        </span>
        <span
          className={`text-[15px] font-bold ${progress === 100 ? "text-emerald-500" : "text-(--color-ink)"}`}
        >
          {progress}%
        </span>
      </div>
      <div className="h-2 w-full bg-[#f0f0ec] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-emerald-400" : "bg-indigo-400"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 divide-x divide-[#f0f0ec] text-center">
        <div className="pr-3">
          <p className="text-[22px] font-bold text-amber-500">{pending}</p>
          <p className="text-[11px] text-(--color-muted)">Pending</p>
        </div>
        <div className="px-3">
          <p className="text-[22px] font-bold text-emerald-500">{verified}</p>
          <p className="text-[11px] text-(--color-muted)">Verified</p>
        </div>
        <div className="pl-3">
          <p className="text-[22px] font-bold text-red-400">{issue}</p>
          <p className="text-[11px] text-(--color-muted)">Issues</p>
        </div>
      </div>
    </div>
  );
}
