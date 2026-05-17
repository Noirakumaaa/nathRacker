import { LogOut, Settings, Search, X } from "lucide-react"
import { useState, useRef, useLayoutEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import APIFETCH from "~/lib/axios/axiosConfig"
import { type Role } from "~/constants/roles"
import { useAuth } from "~/components/authGuard"
import { getGroupedNavItems, primaryApp, type NavItemDef } from "~/config/appNavigation"

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  updateSidebarOption: (option: string) => void
}

// Persists scroll position across layout remounts
let _savedScroll = 0

// ── Nav item ──────────────────────────────────────────────────
function NavItem({
  item,
  isActive,
  onClick,
  disabled,
}: {
  item: NavItemDef
  isActive: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
        text-[13px] font-medium transition-colors duration-100 cursor-pointer
        ${disabled ? "opacity-35 cursor-not-allowed" : ""}
        ${
          isActive
            ? "bg-(--color-ink) text-(--color-bg)"
            : "text-(--color-ink) hover:bg-(--color-subtle)"
        }
      `}
    >
      <span className={`shrink-0 ${isActive ? "opacity-90" : "opacity-40"}`}>{item.icon}</span>
      <span className="flex-1 leading-snug truncate">{item.label}</span>
      {item.status === "coming" && !isActive && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 shrink-0">
          Soon
        </span>
      )}
    </button>
  )
}

// ── Bottom action item ─────────────────────────────────────────
function BottomItem({
  icon,
  label,
  isActive,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
        text-[13px] font-medium transition-colors duration-100 cursor-pointer
        ${
          isActive
            ? "bg-(--color-ink) text-(--color-bg)"
            : danger
              ? "text-red-500 hover:bg-red-50"
              : "text-(--color-ink) hover:bg-(--color-subtle)"
        }
      `}
    >
      <span
        className={`shrink-0 ${isActive ? "opacity-90" : danger ? "opacity-70" : "opacity-40"}`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  )
}

// ── Section header ─────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <p className="px-1 pt-4 pb-1.5 text-[10.5px] font-bold text-(--color-muted) uppercase tracking-[0.2em] select-none">
      {label}
    </p>
  )
}

// ── Human-readable group name mapping ─────────────────────────
const GROUP_LABELS: Record<string, string> = {
  "Encoder Modules": "Encoder",
  Verification: "Verification",
  Reports: "Reports",
  Operations: "Operations",
  Admin: "Administration",
}

const PRIMARY_CODES = new Set(["BDM", "CVS", "GRS", "MNE", "OO8", "OOLEVEL"])
const SPECIAL_ROLE_CODES = new Set(["ACONLY", "SWOIII"])

function getAaModuleSidebarGroups(
  modules: Array<{ id: string; code: string; name: string; isMonthly?: boolean }>
) {
  const primary = modules.filter((m) => PRIMARY_CODES.has(m.code))
  const monthly = modules.filter((m) => m.isMonthly)
  const specialRole = modules.filter((m) => SPECIAL_ROLE_CODES.has(m.code))
  const misc = modules
    .filter((m) => !PRIMARY_CODES.has(m.code) && !m.isMonthly && !SPECIAL_ROLE_CODES.has(m.code))
    .sort((a, b) => a.name.localeCompare(b.name))

  const result: [string, typeof modules][] = []
  if (primary.length > 0) result.push(["Quick Tracking", primary])
  if (monthly.length > 0) result.push(["Monthly Tracking", monthly])
  if (specialRole.length > 0) result.push(["Special Role", specialRole])
  if (misc.length > 0) result.push(["Other Modules", misc])
  return result
}

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose, updateSidebarOption }: SidebarProps) => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const activePath = location.pathname
  const navigate = useNavigate()
  const navRef = useRef<HTMLDivElement>(null)

  // Restore scroll on every render (including remounts)
  useLayoutEffect(() => {
    if (navRef.current) navRef.current.scrollTop = _savedScroll
  })

  const { user: User } = useAuth()

  const navGroups = new Map(
    [...getGroupedNavItems(User?.role).entries()].filter(([group]) => group !== "Account")
  )

  const groupOrder = ["Encoder Modules", "Verification", "Reports", "Operations", "Admin"]

  const sortedGroups = [...navGroups.entries()].sort(
    ([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  )

  const aaRoles = ["ADMIN", "BDM", "AC", "SWOIII", "SWA", "ENCODER"]
  const canSeeAa = User?.role && aaRoles.includes(User.role)

  const { data: aaModules } = useQuery({
    queryKey: ["aa-modules"],
    queryFn: () =>
      APIFETCH.get<Array<{ id: string; code: string; name: string; isMonthly?: boolean }>>(
        "/aa-modules"
      ).then((r) => r.data),
    staleTime: 60_000,
    enabled: !!canSeeAa,
  })

  const sortedAaModuleGroups = aaModules ? getAaModuleSidebarGroups(aaModules) : []

  const [search, setSearch] = useState("")
  const searchLower = search.toLowerCase()

  const go = (path: string) => {
    _savedScroll = navRef.current?.scrollTop ?? 0
    navigate(path)
    updateSidebarOption(path)
    onClose()
  }

  const logout = async () => {
    const res = await APIFETCH.get("/auth/logout")
    if (res.data.logout) {
      queryClient.clear()
      window.location.replace("/login")
    }
  }

  const isActive = (path: string) => activePath === path || activePath.startsWith(`${path}/`)

  const initials = (User?.govUsername?.[0] ?? "U").toUpperCase()

  const roleColors: Partial<Record<Role, string>> = {
    ADMIN: "bg-rose-100 text-rose-700",
    ENCODER: "bg-indigo-100 text-indigo-700",
    VERIFIER: "bg-emerald-100 text-emerald-700",
    SWA: "bg-violet-100 text-violet-700",
    AC: "bg-sky-100 text-sky-700",
    SWOIII: "bg-amber-100 text-amber-700",
    BDM: "bg-teal-100 text-teal-700",
  }

  const roleBadge = User?.role
    ? (roleColors[User.role] ?? "bg-(--color-subtle) text-(--color-muted)")
    : "bg-(--color-subtle) text-(--color-muted)"

  const hasDocTracking = canSeeAa && aaModules && aaModules.length > 0

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          role="presentation"
          className="fixed inset-0 bg-(--color-ink)/30 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-60 bg-(--color-bg) border-r border-(--color-border)
          z-40 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-(--color-border) shrink-0">
          <a href="/" className="flex items-center gap-2.5 no-underline group">
            <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-8 h-8" />
            <div>
              <span className="block text-[14px] font-bold tracking-tight text-(--color-ink) leading-tight">
                {primaryApp.name}
              </span>
              <span className="block text-[11px] text-(--color-muted) leading-tight">
                Case Management
              </span>
            </div>
          </a>
        </div>

        {/* Pinned search — does not scroll */}
        <div className="shrink-0 px-3 py-2.5 border-b border-(--color-border)">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--color-muted) pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-[12.5px] rounded-md bg-(--color-subtle) text-(--color-ink) placeholder:text-(--color-muted) focus:outline-none focus:ring-1 focus:ring-(--color-border-hover) border-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-(--color-muted) hover:text-(--color-ink)"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable nav */}
        <div
          ref={navRef}
          className="flex-1 overflow-y-auto px-3 py-2"
          style={{ overflowAnchor: "none" }}
        >
          {/* Regular nav groups */}
          {sortedGroups.map(([group, items]) => {
            const filtered = searchLower
              ? items.filter((item) => item.label.toLowerCase().includes(searchLower))
              : items
            if (filtered.length === 0) return null
            return (
              <div key={group}>
                <SectionHeader label={GROUP_LABELS[group] ?? group} />
                <div className="space-y-0.5">
                  {filtered.map((item) => (
                    <NavItem
                      key={item.path}
                      item={item}
                      isActive={isActive(item.path)}
                      onClick={() => go(item.path)}
                      disabled={item.status === "coming"}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* AA Tracking */}
          {hasDocTracking && (
            <div>
              <SectionHeader label="AA Tracking" />
              <div className="space-y-3">
                {sortedAaModuleGroups.map(([sectionLabel, modules]) => {
                  const filtered = searchLower
                    ? modules.filter(
                        (m) =>
                          m.name.toLowerCase().includes(searchLower) ||
                          m.code.toLowerCase().includes(searchLower)
                      )
                    : modules
                  if (filtered.length === 0) return null

                  return (
                    <div key={sectionLabel}>
                      <p className="px-1 pb-1 text-[10px] font-semibold text-(--color-muted)/60 uppercase tracking-widest select-none">
                        {sectionLabel}
                      </p>
                      <div className="space-y-0.5">
                        {filtered.map((mod) => {
                          const modPath = `/aa/${mod.code}`
                          const active = isActive(modPath)
                          return (
                            <button
                              key={mod.id}
                              onClick={() => go(modPath)}
                              className={`
                                w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left
                                text-[13px] font-medium transition-colors duration-100 cursor-pointer
                                ${active ? "bg-(--color-ink) text-(--color-bg)" : "text-(--color-ink) hover:bg-(--color-subtle)"}
                              `}
                            >
                              <span
                                className={`font-mono text-[9.5px] font-bold px-1 py-0.5 rounded shrink-0 tabular-nums ${
                                  active
                                    ? "bg-white/15 text-(--color-bg)"
                                    : "bg-(--color-subtle) text-(--color-muted)"
                                }`}
                              >
                                {mod.code}
                              </span>
                              <span className="flex-1 truncate leading-snug text-[12.5px]">
                                {mod.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Settings + Logout + User card */}
        <div className="shrink-0 border-t border-(--color-border) px-2 pt-2 pb-3 space-y-0.5">
          <BottomItem
            icon={<Settings size={15} />}
            label="Settings"
            isActive={isActive("/settings")}
            onClick={() => go("/settings")}
          />
          <BottomItem icon={<LogOut size={15} />} label="Logout" onClick={logout} danger />

          {User && (
            <div className="mt-2 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-(--color-surface) border border-(--color-border)">
              <div className="w-7 h-7 rounded-full bg-(--color-ink) flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-(--color-bg)">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-(--color-ink) truncate leading-tight">
                  {User.govUsername}
                </p>
                <span
                  className={`inline-block mt-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${roleBadge}`}
                >
                  {User.role ?? "ENCODER"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
