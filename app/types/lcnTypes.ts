export type LcnFormFields = {
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  remarks: string
  issue: string
  encodedBy: string
  subjectOfChange: string
  pcn: string
  lrn: string
  drn: string
  cl: string
  date: string
  note: string
}

export type LcnRecord = {
  id : string
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  remarks: string
  issue: string
  encodedBy: string
  subjectOfChange: string
  pcn: string
  lrn: string
  drn: string
  cl: string
  date: string
  note: string
}

// export function getEncodedBadgeClass(remarks: string): string {
//   if (remarks === "YES") return "bg-emerald-50 text-emerald-700";
//   if (remarks === "NO") return "bg-red-50 text-red-700";
//   return "bg-slate-50 text-slate-600";
// }


