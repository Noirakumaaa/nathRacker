export type SWDIFormFields = {
    hhId: string
    lgu: string
    barangay: string
    grantee: string
    swdiScore: number
    swdiLevel: string
    encodedBy: string
    remarks: string
    issue: string 
    cl: string 
    drn: string 
    note: string 
    date : string
}


export type SwdiData = { 
    id : number;
    hhId : string;
    grantee : string;
    swdiScore : string;
    encoded: string;
    issue? : string;
    date: string;
    userId: number;
    username: string
    createdAt?: string
    updatedAt?: string
}
