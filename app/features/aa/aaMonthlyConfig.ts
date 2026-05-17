// Month-by-month grid configuration for each AA monthly module.
// valueKey  — the "did they submit this month?" cell (date/text the staff entered)
// remarkKeys — remark slots 1-N for that month

export interface MonthDef {
  label: string
  valueKey: string
  remarkKeys: string[]
}

export interface ModuleMonthlyConfig {
  /** API endpoint path (relative to /aa-documents/:id/) */
  endpoint: "monthly" | "load26-monthly"
  months: MonthDef[]
}

// ─── COAWTR26 ────────────────────────────────────────────────────────────────
const COAWTR26_MONTHS: MonthDef[] = [
  { label: "January", valueKey: "january", remarkKeys: ["janRemarksMe1", "janRemarksMe2"] },
  { label: "February", valueKey: "february", remarkKeys: ["febRemarksMe"] },
  { label: "March", valueKey: "march", remarkKeys: ["marRemarksMe"] },
  { label: "April", valueKey: "april", remarkKeys: ["aprRemarksMe"] },
  { label: "May", valueKey: "may", remarkKeys: ["mayRemarksMe"] },
  { label: "June", valueKey: "june", remarkKeys: ["junRemarksMe"] },
  { label: "July", valueKey: "july", remarkKeys: ["julRemarksMe"] },
]

// ─── HAZARD26 ────────────────────────────────────────────────────────────────
const HAZARD26_MONTHS: MonthDef[] = [
  { label: "January", valueKey: "january", remarkKeys: ["janRemarks1", "janRemarks2"] },
  { label: "February", valueKey: "february", remarkKeys: ["febRemarks1", "febRemarks2"] },
  { label: "March", valueKey: "march", remarkKeys: ["marRemarks1", "marRemarks2"] },
  { label: "April", valueKey: "april", remarkKeys: ["aprRemarks1", "aprRemarks2"] },
  { label: "May", valueKey: "may", remarkKeys: ["mayRemarks1", "mayRemarks2"] },
  { label: "June", valueKey: "june", remarkKeys: ["junRemarks1", "junRemarks2"] },
  { label: "July", valueKey: "july", remarkKeys: ["julRemarks1", "julRemarks2"] },
  { label: "August", valueKey: "august", remarkKeys: ["augRemarks1", "augRemarks2"] },
  { label: "September", valueKey: "september", remarkKeys: ["sepRemarks1", "sepRemarks2"] },
  { label: "October", valueKey: "october", remarkKeys: ["octRemarks1", "octRemarks2"] },
  { label: "November", valueKey: "november", remarkKeys: ["novRemarks1", "novRemarks2"] },
  { label: "December", valueKey: "december", remarkKeys: ["decRemarks1", "decRemarks2"] },
]

// ─── TEV26 ───────────────────────────────────────────────────────────────────
const TEV26_MONTHS: MonthDef[] = [
  {
    label: "January",
    valueKey: "january",
    remarkKeys: ["janRemarks1", "janRemarks2", "janRemarks3"],
  },
  { label: "February", valueKey: "february", remarkKeys: ["febRemarks1", "febRemarks2"] },
  { label: "March", valueKey: "march", remarkKeys: ["marRemarks1", "marRemarks2"] },
  { label: "April", valueKey: "april", remarkKeys: ["aprRemarks1", "aprRemarks2"] },
  { label: "April (2nd)", valueKey: "aprilDup", remarkKeys: ["aprDupRemarks1", "aprDupRemarks2"] },
  { label: "May", valueKey: "may", remarkKeys: ["mayRemarks1", "mayRemarks2"] },
  { label: "June", valueKey: "june", remarkKeys: ["junRemarks1", "junRemarks2"] },
  { label: "July", valueKey: "july", remarkKeys: ["julRemarks1", "julRemarks2"] },
  { label: "August", valueKey: "august", remarkKeys: ["augRemarks1", "augRemarks2"] },
  { label: "September", valueKey: "september", remarkKeys: ["sepRemarks1", "sepRemarks2"] },
  { label: "October", valueKey: "october", remarkKeys: ["octRemarks1", "octRemarks2"] },
  { label: "November", valueKey: "november", remarkKeys: ["novRemarks1", "novRemarks2"] },
  { label: "December", valueKey: "december", remarkKeys: ["decRemarks1", "decRemarks2"] },
]

// ─── MAGNA26 ─────────────────────────────────────────────────────────────────
const MAGNA26_MONTHS: MonthDef[] = [
  { label: "January", valueKey: "january", remarkKeys: ["janRemarks1", "janRemarks2"] },
  { label: "February", valueKey: "february", remarkKeys: ["febRemarks1", "febRemarks2"] },
  { label: "March", valueKey: "march", remarkKeys: ["marRemarks1", "marRemarks2"] },
  { label: "April", valueKey: "april", remarkKeys: ["aprRemarks"] },
]

// ─── LOAD26 ──────────────────────────────────────────────────────────────────
const LOAD26_MONTHS: MonthDef[] = [
  {
    label: "January",
    valueKey: "january",
    remarkKeys: ["janRemark1", "janRemark2", "janRemark3", "janRemark4", "janRemark5"],
  },
  {
    label: "February",
    valueKey: "february",
    remarkKeys: ["febRemark1", "febRemark2", "febRemark3", "febRemark4", "febRemark5"],
  },
  {
    label: "March",
    valueKey: "march",
    remarkKeys: ["marRemark1", "marRemark2", "marRemark3", "marRemark4", "marRemark5"],
  },
  {
    label: "April",
    valueKey: "april",
    remarkKeys: ["aprRemark1", "aprRemark2", "aprRemark3", "aprRemark4", "aprRemark5"],
  },
  {
    label: "May",
    valueKey: "may",
    remarkKeys: ["mayRemark1", "mayRemark2", "mayRemark3", "mayRemark4", "mayRemark5"],
  },
  {
    label: "June",
    valueKey: "june",
    remarkKeys: ["junRemark1", "junRemark2", "junRemark3", "junRemark4", "junRemark5"],
  },
  {
    label: "July",
    valueKey: "july",
    remarkKeys: ["julRemarks1", "julRemarks2", "julRemarks3", "julRemarks4", "julRemarks5"],
  },
  {
    label: "August",
    valueKey: "august",
    remarkKeys: ["augRemarks1", "augRemarks2", "augRemarks3", "augRemarks4", "augRemarks5"],
  },
  {
    label: "September",
    valueKey: "september",
    remarkKeys: ["sepRemarks1", "sepRemarks2", "sepRemarks3", "sepRemarks4", "sepRemarks5"],
  },
  {
    label: "October",
    valueKey: "october",
    remarkKeys: ["octRemarks1", "octRemarks2", "octRemarks3", "octRemarks4", "octRemarks5"],
  },
  {
    label: "November",
    valueKey: "november",
    remarkKeys: ["novRemarks1", "novRemarks2", "novRemarks3", "novRemarks4", "novRemarks5"],
  },
  {
    label: "December",
    valueKey: "december",
    remarkKeys: ["decRemarks1", "decRemarks2", "decRemarks3", "decRemarks4", "decRemarks5"],
  },
]

// ─── DTR ─────────────────────────────────────────────────────────────────────
const DTR_MONTHS: MonthDef[] = [
  { label: "Dec (prev)", valueKey: "december2025", remarkKeys: ["decRemarks1", "decRemarks2"] },
  { label: "January", valueKey: "january", remarkKeys: ["janRemarks1", "janRemarks2"] },
  { label: "February", valueKey: "february", remarkKeys: ["febRemarks"] },
  { label: "March", valueKey: "march", remarkKeys: ["marRemarks"] },
  { label: "April", valueKey: "april", remarkKeys: ["aprRemarks"] },
  { label: "May", valueKey: "may", remarkKeys: ["mayRemarks1", "mayRemarks2"] },
  { label: "June", valueKey: "june", remarkKeys: ["junRemarks1", "junRemarks2"] },
  { label: "July", valueKey: "july", remarkKeys: ["julRemarks1", "julRemarks2", "julRemarks3"] },
  { label: "August", valueKey: "august", remarkKeys: ["augRemarks"] },
  {
    label: "September",
    valueKey: "september",
    remarkKeys: ["sepRemarks1", "sepRemarks2", "sepRemarks3"],
  },
  {
    label: "October",
    valueKey: "october",
    remarkKeys: ["octRemarks1", "octRemarks2", "octRemarks3"],
  },
  { label: "November", valueKey: "november", remarkKeys: ["novRemarks1", "novRemarks2"] },
]

// ─── Registry ─────────────────────────────────────────────────────────────────
export const AA_MONTHLY_CONFIGS: Record<string, ModuleMonthlyConfig> = {
  COAWTR: { endpoint: "monthly", months: COAWTR26_MONTHS },
  DTR: { endpoint: "monthly", months: DTR_MONTHS },
  HAZARD: { endpoint: "monthly", months: HAZARD26_MONTHS },
  TEV: { endpoint: "monthly", months: TEV26_MONTHS },
  MAGNA: { endpoint: "monthly", months: MAGNA26_MONTHS },
  LOAD: { endpoint: "monthly", months: LOAD26_MONTHS },
}
