import type { ReactNode } from "react"
import {
  BookText,
  Building2,
  ClipboardCheck,
  Database,
  FileIcon,
  FileInput,
  FileText,
  Home,
  IdCard,
  Landmark,
  Layers,
  LogOut,
  MapPin,
  Settings,
  Shield,
  UserPlus,
  Users,
} from "lucide-react"
export { AA_ROLES } from "~/constants/roles"
import {
  ADMIN_ROLES,
  ENCODER_ROLES,
  OPERATIONS_ROLES,
  ROLES,
  VERIFIER_ROLES,
  type Role,
} from "~/constants/roles"

export type UserRole = Role

export interface NavItemDef {
  label: string
  path: string
  icon: ReactNode
  group?: string
  status?: "live" | "coming"
  roles?: UserRole[]
  tag?: string
}

export interface AppDef {
  id: string
  name: string
  basePath: string
  status: "live" | "coming"
  accent: string
  accentText: string
  accentIcon: string
  accentIconText: string
  icon: ReactNode
  items: NavItemDef[]
}

const I = (Icon: typeof Home) => <Icon size={17} className="shrink-0 opacity-50" />

export const apps: AppDef[] = [
  {
    id: "nathracker",
    name: "NathRacker",
    basePath: "/",
    status: "live",
    accent: "bg-sky-50",
    accentText: "text-sky-700",
    accentIcon: "bg-sky-100",
    accentIconText: "text-sky-600",
    icon: I(Layers),
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: I(Home),
        group: "Encoder Modules",
        roles: ENCODER_ROLES,
      },
      {
        label: "BUS",
        path: "/bus",
        icon: I(FileText),
        group: "Encoder Modules",
        roles: ENCODER_ROLES,
        tag: "BUS",
      },
      {
        label: "SWDI",
        path: "/swdi",
        icon: I(FileInput),
        group: "Encoder Modules",
        roles: ENCODER_ROLES,
        tag: "SWDI",
      },
      {
        label: "LCN",
        path: "/lcn",
        icon: I(IdCard),
        group: "Encoder Modules",
        roles: ENCODER_ROLES,
        tag: "LCN",
      },
      {
        label: "CVS",
        path: "/cvs",
        icon: I(FileText),
        group: "Encoder Modules",
        roles: ENCODER_ROLES,
        tag: "CVS",
      },
      {
        label: "Miscellaneous",
        path: "/miscellaneous",
        icon: I(FileIcon),
        group: "Encoder Modules",
        roles: ENCODER_ROLES,
        tag: "MSC",
      },
      {
        label: "BUS Verification",
        path: "/verification/bus",
        icon: I(Shield),
        group: "Verification",
        roles: VERIFIER_ROLES,
      },
      {
        label: "Global Records",
        path: "/records",
        icon: I(BookText),
        group: "Reports",
      },
      {
        label: "My Records",
        path: "/my-records",
        icon: I(FileText),
        group: "Reports",
      },
      {
        label: "Summary",
        path: "/summary",
        icon: I(ClipboardCheck),
        group: "Reports",
      },
      {
        label: "Ops Dashboard",
        path: "/operations/dashboard",
        icon: I(Home),
        group: "Operations",
        roles: [ROLES.ADMIN],
      },
      {
        label: "My Office",
        path: "/operations/my-office",
        icon: I(Building2),
        group: "Operations",
        roles: OPERATIONS_ROLES,
      },
      {
        label: "Staff",
        path: "/operations/staff",
        icon: I(Users),
        group: "Operations",
        roles: OPERATIONS_ROLES,
      },
      {
        label: "Register Account",
        path: "/admin/register",
        icon: I(UserPlus),
        group: "Admin",
        roles: ADMIN_ROLES,
      },
      {
        label: "Employees",
        path: "/admin/employees",
        icon: I(Users),
        group: "Admin",
        roles: ADMIN_ROLES,
      },
      {
        label: "Operations Office",
        path: "/admin/office",
        icon: I(Building2),
        group: "Admin",
        roles: ADMIN_ROLES,
      },
      {
        label: "LGU",
        path: "/admin/lgu",
        icon: I(Landmark),
        group: "Admin",
        roles: ADMIN_ROLES,
      },
      {
        label: "Barangay",
        path: "/admin/barangay",
        icon: I(MapPin),
        group: "Admin",
        roles: ADMIN_ROLES,
      },
      {
        label: "Delete Table",
        path: "/admin/delete-table",
        icon: I(Database),
        group: "Admin",
        roles: ADMIN_ROLES,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: I(Settings),
        group: "Account",
      },
      {
        label: "Logout",
        path: "/logout",
        icon: I(LogOut),
        group: "Account",
      },
    ],
  },
]

export const primaryApp = apps[0]

export const getVisibleNavItems = (role?: UserRole) =>
  primaryApp.items.filter((item) => !item.roles || (role ? item.roles.includes(role) : false))

export const getGroupedNavItems = (role?: UserRole) => {
  const groups = new Map<string, NavItemDef[]>()

  for (const item of getVisibleNavItems(role)) {
    const group = item.group ?? "General"
    const existing = groups.get(group) ?? []
    existing.push(item)
    groups.set(group, existing)
  }

  return groups
}

export function getRolesForPath(pathname: string): UserRole[] | undefined {
  const cleanPath = pathname.split("?")[0]
  const allItems = apps.flatMap((app) => app.items)

  for (const item of allItems) {
    if (item.path.split("?")[0] === cleanPath) return item.roles
  }

  const sorted = [...allItems].sort(
    (a, b) => b.path.split("?")[0].length - a.path.split("?")[0].length
  )

  for (const item of sorted) {
    const itemPath = item.path.split("?")[0]
    if (cleanPath.startsWith(`${itemPath}/`)) return item.roles
  }

  return undefined
}
