import React from "react";

export type MiscFormFields = {
  [x: string]: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  documentType: string;
  remarks: string;
  issue: string;
  subjectOfChange: string;
  drn: string;
  cl: string;
  date: string;
  note: string;
};

export type MiscRecord = MiscFormFields & {
  id: string;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type ToastStatus = "success" | "error";

export const inputCls =
  "w-full px-3 py-2 text-[13px] border border-(--color-border) rounded-lg text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors";

export const labelCls =
  "block text-[11px] font-medium text-(--color-muted) mb-1.5 uppercase tracking-wider";

export const toastAccent: Record<ToastStatus, string> = {
  success: "#22c55e",
  error: "#ef4444",
};

export function getEncodedBadgeClass(encoded: string) {
    switch (encoded) {
        case 'YES':
            return 'bg-green-100 text-green-800';
        case 'NO':
            return 'bg-red-100 text-red-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}


export const toastIcon: Record<ToastStatus, React.ReactNode> = {
  success: (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};