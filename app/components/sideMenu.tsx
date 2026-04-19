import {
  Home,
  FileText,
  Settings,
  FileInput,
  LogOut,
  IdCard,
  BookText,
  ClipboardCheck,
  FileIcon,
  ChevronDown,
  Construction,
  UserPlus,
  Users,
  Building2,
  MapPin,
  Landmark,
  Database,
  Shield,
  Layers,
} from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "~/lib/axios/axiosConfig";
import { queryClient } from "~/root";
import { ROLES, ENCODER_ROLES, VERIFIER_ROLES, OPERATIONS_ROLES } from "~/constants/roles";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  updateSidebarOption: (option: string) => void;
};

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  {
    id: "bus",
    label: "BUS",
    icon: FileText,
    tag: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "swdi",
    label: "SWDI",
    icon: FileInput,
    tag: "bg-emerald-100 text-emerald-700",
  },
  { id: "LCN", label: "LCN", icon: IdCard, tag: "bg-rose-100 text-rose-600" },
  {
    id: "cvs",
    label: "CVS",
    icon: FileText,
    tag: "bg-violet-100 text-violet-600",
  },
  {
    id: "msc",
    label: "Miscellaneous",
    icon: FileIcon,
    tag: "bg-sky-100 text-sky-600",
  },
];

const verificationMenuItems = [
  {
    id: "verification/bus",
    label: "BUS Verification",
    icon: FileText,
    enabled: true,
  },
];

const bottomItems = [
  { id: "records", label: "Global Records", icon: BookText },
  { id: "my-records", label: "My Records", icon: FileText },
  { id: "summary", label: "Summary", icon: ClipboardCheck },
];

const adminItems = [
  { id: "operations/dashboard", label: "Ops Dashboard", icon: Home },
  { id: "admin/register", label: "Register Account", icon: UserPlus },
  { id: "admin/employees", label: "Employees", icon: Users },
  { id: "admin/office", label: "Operations Office", icon: Building2 },
  { id: "admin/lgu", label: "LGU", icon: Landmark },
  { id: "admin/barangay", label: "Barangay", icon: MapPin },
  { id: "admin/delete-table", label: "Delete Table", icon: Database },
];

const operationsItems = [
  { id: "operations/my-office", label: "My Office", icon: Building2 },
  { id: "operations/staff", label: "Staff", icon: Users },
];

const AccountItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Logout", icon: LogOut },
];

// ── Section header with accordion ────────────────────────────
function NavSection({
  label,
  icon: SectionIcon,
  children,
  defaultExpanded = false,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  useLayoutEffect(() => {
    if (defaultExpanded) setExpanded(true);
  }, [defaultExpanded]);

  return (
    <div className="pt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg focus:outline-none cursor-pointer hover:bg-(--color-subtle) transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          {SectionIcon && (
            <SectionIcon size={13} className="text-(--color-placeholder) shrink-0" />
          )}
          <span className="text-[11px] font-bold text-(--color-muted) uppercase tracking-widest select-none">
            {label}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-(--color-placeholder) transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"
            }`}
        />
      </button>

      <div
        className={`grid transition-all duration-200 ease-in-out ${expanded
            ? "grid-rows-[1fr] opacity-100 mt-0.5"
            : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden space-y-0.5 px-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Nav item ──────────────────────────────────────────────────
function NavItem({
  item,
  isActive,
  onClick,
  disabled,
}: {
  item: { id: string; label: string; icon: React.ElementType; tag?: string };
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
        text-[14px] font-medium transition-all duration-150 cursor-pointer
        ${disabled ? "opacity-35 cursor-not-allowed" : ""}
        ${isActive
          ? "bg-(--color-ink) text-(--color-bg) shadow-sm"
          : "text-(--color-ink) hover:bg-(--color-subtle)"
        }
      `}
    >
      <Icon
        size={17}
        className={`shrink-0 ${isActive ? "opacity-90" : "opacity-50"}`}
      />
      <span className="flex-1 leading-snug truncate">{item.label}</span>
      {item.tag && !isActive && (
        <span
          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide ${item.tag}`}
        >
          {item.id.toUpperCase()}
        </span>
      )}
    </button>
  );
}

// ── Divider ───────────────────────────────────────────────────
function NavDivider() {
  return <div className="my-1.5 mx-3 border-t border-(--color-border)" />;
}

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose, updateSidebarOption }: SidebarProps) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    location.pathname.replace("/", ""),
  );
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);

  useLayoutEffect(() => {
    if (navRef.current) navRef.current.scrollTop = scrollPos.current;
  });

  const { data: User } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await APIFETCH.get("/auth/check-auth");
      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const updateSidebar = (option: string) => {
    scrollPos.current = navRef.current?.scrollTop ?? 0;
    setActiveItem(option);
    if (option === "logout") {
      logout();
    } else if (option === "msc") {
      navigate("/miscellaneous");
    } else {
      navigate(`/${option}`);
    }
    updateSidebarOption(option);
  };

  const authorizedEncoderModule = ENCODER_ROLES;
  const authorizedOpsStaffModule = OPERATIONS_ROLES;
  const authorizedVerifierModule = VERIFIER_ROLES;

  const logout = async () => {
    const res = await APIFETCH.get("/auth/logout");
    if (res.data.logout) {
      queryClient.clear();
      window.location.href = "/login";
    }
  };

  const initials = (User?.govUsername?.[0] ?? "U").toUpperCase();

  const roleColors: Record<string, string> = {
    ADMIN: "bg-rose-100 text-rose-700",
    ENCODER: "bg-indigo-100 text-indigo-700",
    VERIFIER: "bg-emerald-100 text-emerald-700",
    SWA: "bg-violet-100 text-violet-700",
    AC: "bg-sky-100 text-sky-700",
    SWOIII: "bg-amber-100 text-amber-700",
  };

  const roleBadge =
    roleColors[User?.role] ?? "bg-(--color-subtle) text-(--color-muted)";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-(--color-ink)/30 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={onClose}
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
            <img
              src="/nathracker_icon_v9.svg"
              alt="NathRacker"
              className="w-9 h-9"
            />
            <div>
              <span className="block text-[15px] font-bold tracking-tight text-(--color-ink) leading-tight">
                NathRacker
              </span>
              <span className="block text-[11px] text-(--color-muted) leading-tight">
                Case Management
              </span>
            </div>
          </a>
        </div>

        {/* Nav */}
        <div
          ref={navRef}
          className="flex-1 overflow-y-auto py-3 px-2 space-y-0"
          style={{ overflowAnchor: "none" }}
        >
          {authorizedEncoderModule.includes(User?.role) && (
            <>
              <NavSection
                label="Encoder Modules"
                icon={Layers}
                defaultExpanded={menuItems.some((i) => activeItem === i.id)}
              >
                {menuItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => updateSidebar(item.id)}
                  />
                ))}
              </NavSection>
              <NavDivider />
            </>
          )}

          {authorizedVerifierModule.includes(User?.role) && (
            <>
              <NavSection
                label="Verification"
                icon={Shield}
                defaultExpanded={verificationMenuItems.some(
                  (i) => activeItem === i.id,
                )}
              >
                {verificationMenuItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() =>
                      item.enabled
                        ? updateSidebar(item.id)
                        : console.log("UNDERDEVELOPMENT")
                    }
                    disabled={!item.enabled}
                  />
                ))}
                {verificationMenuItems.some((i) => !i.enabled) && (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Construction
                      size={12}
                      className="text-(--color-placeholder) shrink-0"
                    />
                    <span className="text-[11px] text-(--color-placeholder) leading-snug">
                      Some modules are under development
                    </span>
                  </div>
                )}
              </NavSection>
              <NavDivider />
            </>
          )}

          <NavSection
            label="Reports"
            icon={BookText}
            defaultExpanded={bottomItems.some((i) => activeItem === i.id)}
          >
            {bottomItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => updateSidebar(item.id)}
              />
            ))}
          </NavSection>

          {authorizedOpsStaffModule.includes(User?.role) && (
            <>
              <NavDivider />
              <NavSection
                label="Operations"
                icon={Building2}
                defaultExpanded={operationsItems.some(
                  (i) => activeItem === i.id,
                )}
              >
                {operationsItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => updateSidebar(item.id)}
                  />
                ))}
              </NavSection>
            </>
          )}

          {User?.role === ROLES.ADMIN && (
            <>
              <NavDivider />
              <NavSection
                label="Admin"
                icon={Shield}
                defaultExpanded={adminItems.some((i) => activeItem === i.id)}
              >
                {adminItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => updateSidebar(item.id)}
                  />
                ))}
              </NavSection>
            </>
          )}

          <NavDivider />

          <NavSection
            label="Account"
            icon={Settings}
            defaultExpanded={AccountItems.some((i) => activeItem === i.id)}
          >
            {AccountItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => updateSidebar(item.id)}
              />
            ))}
          </NavSection>
        </div>

        {/* Footer — user card */}
        <div className="border-t border-(--color-border) p-3 shrink-0">
          {User && (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-(--color-surface) border border-(--color-border)">
              <div className="w-9 h-9 rounded-full bg-(--color-ink) flex items-center justify-center shrink-0">
                <span className="text-[13px] font-bold text-(--color-bg)">
                  {initials}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-(--color-ink) truncate leading-tight">
                  {User.govUsername}
                </p>
                <span
                  className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${roleBadge}`}
                >
                  {User.role ?? "ENCODER"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
