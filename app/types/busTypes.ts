export type BusFormFields = {
  id: string;

  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  updateInfo: string;
  remarks: string;
  issue: string;
  encodedBy: string;
  subjectOfChange: string;
  drn: string;
  cl: string;
  date: string;
  note: string;
}

export type FormFields = {
  id: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  updateInfo: string;
  remarks: string;
  issue: string;
  subjectOfChange: string;
  encodedBy: string;
  drn: string;
  cl: string;
  date: string;
  note: string;
  userId: number;
  createdAt: string
  updatedAt: string
}

export type BusData = {
    id: number;
    hhId: string;
    name: string;
    documentType: string;
    documentId: number;
    encoded: string;
    date: string;
    govUsername: string;
    userId: number;
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

export const UPDATE_TYPE_KEYMAP: Record<string, string> = {
  '8': 'New Registration',
  '2': 'Address Change',
  '4': 'Health Change',
  '5': 'School Update',
  '6': 'Grantee Update',
  '7': 'Decease Update',
  '9': 'Basic Info Update',
  '10': 'IP Affiliation Update',
  '11': 'Beneficiary Update',
  '12': 'Pregnancy Update',
};