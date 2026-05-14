export const ROLES = {
  ADMIN: "ADMIN",
  ENCODER: "ENCODER",
  SWA: "SWA",
  VERIFIER: "VERIFIER",
  AC: "AC",
  SWOIII: "SWOIII",
  BDM: "BDM",
} as const

export const ROLE_OPTIONS: { value: Role; label: string; desc: string }[] = [
  { value: ROLES.ADMIN, label: "Admin", desc: "Full system access and user management." },
  { value: ROLES.ENCODER, label: "Encoder", desc: "Can encode and submit records." },
  { value: ROLES.SWA, label: "SWA", desc: "Social Welfare Assistant role." },
  { value: ROLES.VERIFIER, label: "Verifier", desc: "Verifies and validates submitted records." },
  { value: ROLES.AC, label: "AC", desc: "Area Coordinator role." },
  { value: ROLES.SWOIII, label: "SWO III", desc: "Social Welfare Officer III role." },
  { value: ROLES.BDM, label: "BDM", desc: "Barangay Data Manager role." },
]

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ENCODER_ROLES: Role[] = [ROLES.ENCODER, ROLES.ADMIN, ROLES.SWA, ROLES.BDM]
export const ADMIN_ROLES: Role[] = [ROLES.ADMIN]
export const VERIFIER_ROLES: Role[] = [ROLES.VERIFIER, ROLES.ADMIN, ROLES.BDM]
export const OPERATIONS_ROLES: Role[] = [ROLES.AC, ROLES.SWOIII, ROLES.ADMIN, ROLES.BDM]
export const AA_ROLES: Role[] = [
  ROLES.ADMIN,
  ROLES.BDM,
  ROLES.AC,
  ROLES.SWOIII,
  ROLES.SWA,
  ROLES.ENCODER,
]
