export type MiscFormFields = {
  hhId: string;
  lgu: string;
  barangay: string;
  granteeName: string;
  documentType: string;
  remarks: string;
  issue?: string;
  encodedBy: string;
  subjectOfChange?: string;
  drn?: string;
  cl?: string;
  date: string | Date;
  note?: string;
};

export function getEncodedBadgeClass(remarks: string): string {
  if (remarks === "YES") return "bg-emerald-50 text-emerald-700";
  if (remarks === "NO") return "bg-red-50 text-red-700";
  return "bg-slate-50 text-slate-600";
}