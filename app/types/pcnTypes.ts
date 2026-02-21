export type Pcn = {
    id: number
    hhId: string
    grantee: string
    pcn: string
    tr: string
    encoded: "YES" | "NO" | "UPDATED" | "PENDING"
    issue?: string
    date: string
    userId: number
    username: string
    createdAt?: string
    updatedAt?: string
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