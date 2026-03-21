
// ── CVS Types ──────────────────────────────────────────────────────────────────
export type ToastStatus = "success" | "error" | "info";

export interface CvsFormFields {
  id?: number;
  idNumber: string;
  lgu: string;
  barangay: string;
  facilityName: string;
  formType: string;
  remarks: string;
  date: string;
}

export interface CvsRecord extends CvsFormFields {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
