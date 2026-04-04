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
  ChevronRight,
  Construction,
  UserPlus,
  Users,
  Building2,
  MapPin,
  Landmark,
} from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { queryClient } from "~/root";

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
    tag: "bg-indigo-50 text-indigo-500",
  },
  {
    id: "swdi",
    label: "SWDI",
    icon: FileInput,
    tag: "bg-emerald-50 text-emerald-600",
  },
  { id: "LCN", label: "LCN", icon: IdCard, tag: "bg-rose-50 text-rose-500" },
  {
    id: "cvs",
    label: "CVS",
    icon: FileText,
    tag: "bg-violet-50 text-violet-500",
  },
  {
    id: "msc",
    label: "Miscellaneous",
    icon: FileIcon,
    tag: "bg-sky-50 text-sky-500",
  },
];

const verificationMenuItems = [
  {
    id: "verification/bus",
    label: "BUS Verification",
    icon: FileText,
    enabled: true,
  },
  { id: "cvsVer", label: "CVS Verification", icon: FileText, enabled: false },
];

const bottomItems = [
  { id: "records", label: "Records", icon: BookText },
  { id: "summary", label: "Summary", icon: ClipboardCheck },
];

const adminItems = [
  { id: "operations/dashboard", label: "Ops Dashboard", icon: Home },
  { id: "admin/register", label: "Register Account", icon: UserPlus },
  { id: "admin/employees", label: "Employees", icon: Users },
  { id: "admin/office", label: "Operations Office", icon: Building2 },
  { id: "admin/lgu", label: "LGU", icon: Landmark },
  { id: "admin/barangay", label: "Barangay", icon: MapPin },
];

const operationsItems = [
  { id: "operations/my-office", label: "My Office", icon: Building2 },
  { id: "operations/staff", label: "Staff", icon: Users },
];

const AccountItems = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "logout", label: "Logout", icon: LogOut },
];

// ── Section label ─────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[9.5px] font-semibold text-(--color-placeholder) uppercase tracking-widest px-3 pt-5 pb-1.5 select-none">
      {label}
    </p>
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
        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
        text-[13px] font-medium transition-all duration-150 cursor-pointer
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        ${
          isActive
            ? "bg-(--color-ink) text-(--color-bg)"
            : "text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-subtle)"
        }
      `}
    >
      <Icon
        size={14}
        className={`shrink-0 ${isActive ? "opacity-90" : "opacity-60"}`}
      />
      <span className="flex-1 leading-none truncate">{item.label}</span>
      {item.tag && !isActive && (
        <span
          className={`font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wider ${item.tag}`}
        >
          {item.id.toUpperCase()}
        </span>
      )}
      {isActive && <ChevronRight size={11} className="opacity-30 shrink-0" />}
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose, updateSidebarOption }: SidebarProps) => {
  const { show } = useToastStore();
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

  const authorizedEncoderModule = ["ADMIN", "ENCODER"];
  const authorizedVerifiedModule = ["ADMIN", "VERIFIER"];
  const authorizedOpsStaffModule = ["AC", "SWOIII", "ADMIN"];
  const authorizedVerifierModule = ["ADMIN", "VERIFIER"];

  const logout = async () => {
    const res = await APIFETCH.get("/auth/logout");
    if (res.data.logout) {
      queryClient.clear();
      window.location.href = "/login";

    }
  };

  const initials = (User?.govUsername?.[0] ?? "U").toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-(--color-ink)/25 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-55 bg-(--color-bg) border-r border-(--color-border)
          z-40 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-0
        `}
      >
        {/* Logo */}
        <div className="h-15 flex items-center px-5 border-b border-(--color-border) shrink-0">
          <a href="/" className="flex items-center gap-2.5 no-underline group">
            <img
              src="/nathracker_icon_v9.svg"
              alt="NathRacker"
              className="w-10 h-10"
            />
            <span className="text-[15px] font-semibold tracking-tight text-(--color-ink)">
              NathRacker
            </span>
          </a>
        </div>

        {/* Nav */}
        <div
          ref={navRef}
          className="flex-1 overflow-y-auto py-2 px-2.5 space-y-0"
          style={{ overflowAnchor: "none" }}
        >
          {authorizedEncoderModule.includes(User?.role) && (
            <>
              <SectionLabel label="Encoders Modules" />
              <nav className="space-y-0.5">
                {menuItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => updateSidebar(item.id)}
                  />
                ))}
              </nav>
            </>
          )}

          {authorizedVerifiedModule.includes(User?.role) && (
            <>
              <SectionLabel label="Verification Modules" />
              <nav className="space-y-0.5">
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
                  <div className="flex items-center gap-1.5 px-3 py-1">
                    <Construction
                      size={10}
                      className="text-(--color-placeholder)"
                    />
                    <span className="text-[10px] text-(--color-placeholder)">
                      Some modules under development
                    </span>
                  </div>
                )}
              </nav>
            </>
          )}

          <SectionLabel label="Reports" />
          <nav className="space-y-0.5">
            {bottomItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => updateSidebar(item.id)}
              />
            ))}
          </nav>

          {authorizedOpsStaffModule.includes(User?.role) && (
            <>
              <SectionLabel label="Operations" />
              <nav className="space-y-0.5">
                {operationsItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => updateSidebar(item.id)}
                  />
                ))}
              </nav>
            </>
          )}

          {User?.role === "ADMIN" && (
            <>
              <SectionLabel label="Admin" />
              <nav className="space-y-0.5">
                {adminItems.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeItem === item.id}
                    onClick={() => updateSidebar(item.id)}
                  />
                ))}
              </nav>
            </>
          )}

          <SectionLabel label="Account" />
          <nav className="space-y-0.5">
            {AccountItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => updateSidebar(item.id)}
              />
            ))}
          </nav>
        </div>

        {/* Footer — user card */}
        <div className="border-t border-(--color-border) p-2.5 shrink-0">
          {User && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-(--color-surface) border border-(--color-border)">
              <div className="w-7 h-7 rounded-full bg-(--color-ink) flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-(--color-bg)">
                  {initials}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-(--color-ink) truncate leading-tight">
                  {User.govUsername}
                </p>
                <p className="text-[10px] text-(--color-muted) font-mono uppercase tracking-wide">
                  {User.role ?? "ENCODER"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
