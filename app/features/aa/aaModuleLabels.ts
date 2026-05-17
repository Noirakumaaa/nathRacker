import type { AaDocumentModule } from "~/types/aaTypes"

const DATE_LABELS: Record<string, string> = {
  CVS: "Date Submitted",
  EDTMS: "DATE",
  MRBTOF: "DATE FORWARDED TO MRB",
}

export const getAaModuleLabels = (
  moduleCode: string,
  module?: Pick<AaDocumentModule, "name" | "colStaff" | "colSubject" | "colActivity"> | null
) => ({
  moduleName: (module?.name?.trim() || moduleCode).replace(/\s*\b(19|20)\d{2}\b/g, "").trim(),
  staff: module?.colStaff?.trim() || "Name of Staff",
  subject: module?.colSubject?.trim() || "Subject",
  activity: module?.colActivity?.trim() || null,
  date: DATE_LABELS[moduleCode.toUpperCase()] || "Date Created",
  latestRemark: "Remarks/Date",
})
