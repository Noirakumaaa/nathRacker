import type { JSX } from "react";

// ── Shared CVS UI constants ────────────────────────────────────────────────────
export const labelCls =
  "block text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider mb-1.5";

export const inputCls =
  "w-full h-9 px-3 text-[13px] text-[#1a1a18] bg-[#fafaf8] border border-[#e8e8e0] " +
  "rounded-lg focus:outline-none focus:border-[#1a1a18] focus:bg-white transition-colors " +
  "placeholder:text-[#c4c4b8]";

// Toast styling
export const toastAccent: Record<string, string> = {
  success: "#d1fae5",
  error:   "#fee2e2",
  info:    "#dbeafe",
};

export const toastIcon: Record<string, JSX.Element> = {
  success: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 3l6 6M9 3l-6 6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M6 5.5v3M6 4h.01" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};