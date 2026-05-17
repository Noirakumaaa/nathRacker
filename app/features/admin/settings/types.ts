export interface OperationsOffice {
  id: number;
  name: string;
}

export interface Lgu {
  id: number;
  name: string;
  operationsOfficeNumId: number;
}

export interface Barangay {
  id: number;
  name: string;
  lguId: number;
}

export type UserRole = "ENCODER" | "ADMIN" | "AREA_COORDINATOR" | "SOCIAL_WORKER_III";

export interface Employee {
  id: number;
  govUsername: string;
  email: string;
  role: UserRole;
  createdAt: string;
  userInfo: {
    firstName: string;
    lastName: string;
    middleName: string;
    phone: string;
    assignedOperationId: number | null;
    assignedLGUID: number | null;
    assignedBarangayId: number | null;
  } | null;
}

export type Tab = "register" | "office" | "lgu" | "barangay" | "employees";
