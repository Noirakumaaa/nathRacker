export const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
export const labelCls = "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";


// ── Module tag styles ────────────────────────────────────────────────────────
export const moduleStyle: Record<string, string> = {
  BUS: "bg-indigo-50 text-indigo-600",
  PCN: "bg-rose-50 text-rose-600",
  SWDI: "bg-emerald-50 text-emerald-600",
  MISC: "bg-amber-50 text-amber-600",
  CVS: "bg-sky-50 text-sky-600",
  VERIFIED: "bg-purple-50 text-purple-600",
};

export const encodedStyle = (v?: string) => {
  if (v === "YES") return "bg-emerald-50 text-emerald-600";
  if (v === "NO") return "bg-red-50 text-red-500";
  if (v === "UPDATED") return "bg-blue-50 text-blue-600";
  return "bg-[#f5f5f2] text-[#8a8a80]";
};

export const sparkColor: Record<string, string> = {
  BUS: "bg-indigo-400",
  PCN: "bg-rose-400",
  SWDI: "bg-emerald-400",
  MISC: "bg-amber-400",
  CVS: "bg-sky-400",
  VERIFIED: "bg-purple-400",
};

