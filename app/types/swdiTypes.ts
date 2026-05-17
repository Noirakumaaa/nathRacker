export type SwdiFormFields = {
  hhId: string;
  lgu: string;
  barangay: string;
  grantee: string;
  swdiScore: string;
  swdiLevel: string;
  remarks: string;
  issue?: string;
  cl?: string;
  drn?: string;
  date: string ;
  note?: string;
};

export function getEncodedBadgeClass(remarks: string): string {
  if (remarks === "YES") return "bg-emerald-50 text-emerald-700";
  if (remarks === "NO") return "bg-red-50 text-red-700";
  return "bg-slate-50 text-slate-600";
}


export type SwdiRecord = { 
    id : number;
    hhId: string
    lgu: string
    barangay: string
    grantee: string
    swdiScore: number
    swdiLevel: string
    encodedBy: string
    remarks: string
    issue: string 
    cl?: string 
    drn?: string 
    note: string 
    date : string
    userId: number
    createdAt?: string
    updatedAt?: string
}

export type SwdiResponse = {
  upload : boolean
  message : string
}