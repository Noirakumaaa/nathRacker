export type PcnFormFields = {
  id?: number
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  remarks: string
  issue: string
  encodedBy: string
  subjectOfChange: string
  pcn: string
  tr: string
  drn: string
  cl: string
  date: string
  note: string
}

export function getEncodedBadgeClass(remarks: string): string {
  if (remarks === "YES") return "bg-emerald-50 text-emerald-700";
  if (remarks === "NO") return "bg-red-50 text-red-700";
  return "bg-slate-50 text-slate-600";
}

export type PcnFields = {
    userId : number;
    username: string;
    hhId: string;
    grantee: string;
    pcn: string;
    tr: string;
    issue: string;
    date: string;
    encoded: string;
};


export type PcnRecord = PcnFormFields & {
  id: string;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type ToastStatus = "success" | "error";

