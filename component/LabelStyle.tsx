export function Req() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded uppercase tracking-wide leading-none">
      <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
      Required
    </span>
  );
}

export function Opt() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#8a8a80] bg-[#f5f5f2] border border-[#e8e8e0] px-1.5 py-0.5 rounded uppercase tracking-wide leading-none">
      Optional
    </span>
  );
}