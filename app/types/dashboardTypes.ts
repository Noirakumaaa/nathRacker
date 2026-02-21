export type EncodedDocument = {
    id: number;
    hhId: string;
    name: string;
    documentType: string;
    encoded: "YES" | "NO" | "UPDATED" | "PENDING";
    userId: number;
    username: string;
    date: string;
    createdAt: string;
};

export type FormFields = {
  lgu: string
  barangay: string
  hhId: string
  granteeName: string
  typeOfUpdate: string
  encoded: string
  issue: string
  subjectOfChange: string
  date: string
}