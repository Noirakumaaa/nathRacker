// ─── AA Document Tracking Module — shared TypeScript types ───────────────────

export interface AaDocumentModule {
  id: string
  code: string
  name: string
  prefix: string
  description: string | null
  isActive: boolean
  isMonthly: boolean
  colStaff?: string | null
  colSubject?: string | null
  colActivity?: string | null
  createdAt: string
  updatedAt: string
  _count?: { documents: number }
}

export interface AaRemark {
  id: string
  documentId: string
  content: string
  remarkDate: string | null
  order: number
  createdAt: string
}

export interface AaDocument {
  id: string
  trackingNo: string
  sequence: number
  staffName: string
  subject: string
  operationNum: string | null
  year: number
  dateCreated: string
  dateSubmittedJnt: string | null
  oo8Level: string | null
  moduleId: string
  module?: AaDocumentModule
  remarks: AaRemark[]
  load26Monthly?: AaLoad26Monthly | null
  createdAt: string
  updatedAt: string
}

export interface AaLoad26Monthly {
  id: string
  documentId: string

  january: string | null
  janRemark1: string | null
  janRemark2: string | null
  janRemark3: string | null
  janRemark4: string | null
  janRemark5: string | null
  february: string | null
  febRemark1: string | null
  febRemark2: string | null
  febRemark3: string | null
  febRemark4: string | null
  febRemark5: string | null
  march: string | null
  marRemark1: string | null
  marRemark2: string | null
  marRemark3: string | null
  marRemark4: string | null
  marRemark5: string | null
  april: string | null
  aprRemark1: string | null
  aprRemark2: string | null
  aprRemark3: string | null
  aprRemark4: string | null
  aprRemark5: string | null
  may: string | null
  mayRemark1: string | null
  mayRemark2: string | null
  mayRemark3: string | null
  mayRemark4: string | null
  mayRemark5: string | null
  june: string | null
  junRemark1: string | null
  junRemark2: string | null
  junRemark3: string | null
  junRemark4: string | null
  junRemark5: string | null
  july: string | null
  julRemarks1: string | null
  julRemarks2: string | null
  julRemarks3: string | null
  julRemarks4: string | null
  julRemarks5: string | null
  august: string | null
  augRemarks1: string | null
  augRemarks2: string | null
  augRemarks3: string | null
  augRemarks4: string | null
  augRemarks5: string | null
  september: string | null
  sepRemarks1: string | null
  sepRemarks2: string | null
  sepRemarks3: string | null
  sepRemarks4: string | null
  sepRemarks5: string | null
  october: string | null
  octRemarks1: string | null
  octRemarks2: string | null
  octRemarks3: string | null
  octRemarks4: string | null
  octRemarks5: string | null
  november: string | null
  novRemarks1: string | null
  novRemarks2: string | null
  novRemarks3: string | null
  novRemarks4: string | null
  novRemarks5: string | null
  december: string | null
  decRemarks1: string | null
  decRemarks2: string | null
  decRemarks3: string | null
  decRemarks4: string | null
  decRemarks5: string | null

  createdAt: string
  updatedAt: string
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface AaDocumentListResponse {
  data: AaDocument[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// ─── Form values ──────────────────────────────────────────────────────────────

export interface CreateDocumentFormValues {
  staffName: string
  subject: string
  operationNum?: string
  year: number
  dateCreated: string
}

export interface AddRemarkFormValues {
  content: string
  remarkDate: string
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface DocumentQueryParams {
  page?: number
  pageSize?: number
  search?: string
  staffName?: string
  year?: number
  dateFrom?: string
  dateTo?: string
  sortBy?: "trackingNo" | "staffName" | "dateCreated" | "createdAt"
  sortOrder?: "asc" | "desc"
}
