export interface SummaryEntry {
  id: number;
  date: string;
  hhId: string;
  name: string;
  remarks: string;
  issue: string | null;
  type: 'encode' | 'update' | 'issue';
  verified: string;
}

export interface DocTypeSummary {
  encoded: number;
  updated: number;
  issue: number;
  entries: SummaryEntry[];
}

export interface MonthlySummaryResponse {
  month: number;
  year: number;
  BUS: DocTypeSummary;
  SWDI: DocTypeSummary;
  PCN: DocTypeSummary;
  CVS: DocTypeSummary;
  MISCELLANEOUS: DocTypeSummary;
  totals: {
    encoded: number;
    updated: number;
    issue: number;
  };
}


export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DOC_TYPES = ["BUS", "SWDI", "PCN", "CVS", "MISCELLANEOUS"] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const DOC_DOT: Record<DocType, string> = {
  BUS: "#378ADD",
  SWDI: "#1D9E75",
  PCN: "#D85A30",
  CVS: "#7F77DD",
  MISCELLANEOUS: "#888780",
};