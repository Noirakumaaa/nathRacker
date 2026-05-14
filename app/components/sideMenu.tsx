import { ChevronDown, LogOut, Settings } from "lucide-react"
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

// ── Section label (non-clickable) ─────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-(--color-muted) uppercase tracking-widest select-none">
      {label}
    </p>
  )
}

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

// ── Collapsible section (for Document Tracking) ───────────────
function CollapsibleSection({
  label,
  defaultExpanded,
  children,
}: {
  label: string
  defaultExpanded: boolean
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  useLayoutEffect(() => {
    if (defaultExpanded) setExpanded(true)
  }, [defaultExpanded])

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 pt-4 pb-1 cursor-pointer group"
      >
        <p className="text-[10px] font-bold text-(--color-muted) uppercase tracking-widest select-none group-hover:text-(--color-ink) transition-colors">
          {label}
        </p>
        <ChevronDown
          size={13}
          className={`text-(--color-muted) transition-transform duration-200 group-hover:text-(--color-ink) ${
            expanded ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────
function Divider() {
  return <div className="mx-3 my-2 border-t border-(--color-border)" />
}

// ── Bottom action item (Settings, Logout) ─────────────────────
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

// ── Human-readable group name mapping ─────────────────────────
const GROUP_LABELS: Record<string, string> = {
  "Encoder Modules": "My Work",
  Verification: "Verification",
  Reports: "Reports",
  Operations: "Operations",
  Admin: "Administration",
}

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose, updateSidebarOption }: SidebarProps) => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const activePath = location.pathname
  const navigate = useNavigate()
  const navRef = useRef<HTMLDivElement>(null)
  const scrollPos = useRef(0)

  useLayoutEffect(() => {
    if (navRef.current) navRef.current.scrollTop = scrollPos.current
  })

  const { user: User } = useAuth()

  // Filter out "Account" group — Settings/Logout are pinned at bottom
  const navGroups = new Map(
    [...getGroupedNavItems(User?.role).entries()].filter(([group]) => group !== "Account")
  )

  const aaRoles = ["ADMIN", "BDM", "AC", "SWOIII", "SWA", "ENCODER"]
  const canSeeAa = User?.role && aaRoles.includes(User.role)

  const { data: aaModules } = useQuery({
    queryKey: ["aa-modules"],
    queryFn: () =>
      APIFETCH.get<{ id: string; code: string; name: string }[]>("/aa-modules").then((r) => r.data),
    staleTime: 60_000,
    enabled: !!canSeeAa,
  })

  const go = (path: string) => {
    scrollPos.current = navRef.current?.scrollTop ?? 0
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

  const groups = [...navGroups.entries()]
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

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-62 bg-(--color-bg) border-r border-(--color-border)
          z-40 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-(--color-border) shrink-0">
          <a href="/" className="flex items-center gap-3 no-underline group">
            <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-9 h-9" />
            <div>
              <span className="block text-[15px] font-bold tracking-tight text-(--color-ink) leading-tight">
                {primaryApp.name}
              </span>
              <span className="block text-[11px] text-(--color-muted) leading-tight">
                Case Management
              </span>
            </div>
          </a>
        </div>

        {/* Scrollable nav */}
        <div
          ref={navRef}
          className="flex-1 overflow-y-auto px-2 pb-2"
          style={{ overflowAnchor: "none" }}
        >
          {groups.map(([group, items], idx) => (
            <div key={group}>
              {idx > 0 && <Divider />}
              <SectionLabel label={GROUP_LABELS[group] ?? group} />
              <div className="space-y-0.5">
                {items.map((item) => (
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
          ))}

          {/* Document Tracking */}
          {hasDocTracking && (
            <>
              {groups.length > 0 && <Divider />}
              <CollapsibleSection
                label="Document Tracking"
                defaultExpanded={activePath.startsWith("/aa")}
              >
                <div className="space-y-0.5 pb-1">
                  {aaModules!.map((mod) => {
                    const modPath = `/aa/${mod.code}`
                    const active = isActive(modPath)
                    return (
                      <button
                        key={mod.id}
                        onClick={() => go(modPath)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
                          text-[13px] font-medium transition-colors duration-100 cursor-pointer
                          ${
                            active
                              ? "bg-(--color-ink) text-(--color-bg)"
                              : "text-(--color-ink) hover:bg-(--color-subtle)"
                          }
                        `}
                      >
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                            active
                              ? "bg-white/20 text-(--color-bg)"
                              : "bg-(--color-subtle) text-(--color-muted)"
                          }`}
                        >
                          {mod.code}
                        </span>
                        <span className="flex-1 truncate leading-snug">{mod.name}</span>
                      </button>
                    )
                  })}
                </div>
              </CollapsibleSection>
            </>
          )}
        </div>

        {/* Bottom: Settings + Logout + User card */}
        <div className="shrink-0 border-t border-(--color-border) px-2 pt-2 pb-3 space-y-0.5">
          <BottomItem
            icon={<Settings size={16} />}
            label="Settings"
            isActive={isActive("/settings")}
            onClick={() => go("/settings")}
          />
          <BottomItem icon={<LogOut size={16} />} label="Logout" onClick={logout} danger />

          {/* User card */}
          {User && (
            <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-(--color-surface) border border-(--color-border)">
              <div className="w-8 h-8 rounded-full bg-(--color-ink) flex items-center justify-center shrink-0">
                <span className="text-[12px] font-bold text-(--color-bg)">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-(--color-ink) truncate leading-tight">
                  {User.govUsername}
                </p>
                <span
                  className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${roleBadge}`}
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
