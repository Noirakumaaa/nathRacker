import {
  Home,
  FileText,
  Settings,
  FileInput,
  LogOut,
  IdCard,
  BookText,
  ClipboardCheck,
  HelpCircle,
  FileIcon,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "./fetchComponent";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "redux/store";
import { setLogout } from "redux/slice/user/userSlice";

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
  { id: "LCN", label: "LCN", 
    icon: IdCard, 
    tag: "bg-rose-50 text-rose-500" },
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
    tag: "bg-violet-50 text-sky-500",
  },
];

const verificationMenuItems = [
  {
    id: "busVer",
    label: "BUS Verification",
    icon: FileText,
  },
  {
    id: "cvsVer",
    label: "CVS Verification",
    icon: FileText,

  },
];

const bottomItems = [
  { id: "records", label: "Records", icon: BookText },
  { id: "summary", label: "Summary", icon: ClipboardCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold text-[#c4c4b8] uppercase tracking-widest px-3 pt-4 pb-1.5">
      {label}
    </p>
  );
}

// ── Nav button ────────────────────────────────────────────────────────────────
function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof menuItems)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
        text-[13px] font-medium transition-all duration-150 cursor-pointer group
        ${
          isActive
            ? "bg-[#1a1a18] text-white shadow-sm"
            : "text-[#6a6a60] hover:text-[#1a1a18] hover:bg-[#f0f0ec]"
        }
      `}
    >
      <Icon size={14} className="shrink-0 opacity-80" />
      <span className="flex-1 leading-none">{item.label}</span>
      {"tag" in item && item.tag && !isActive ? (
        <span
          className={`font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wider ${item.tag}`}
        >
          {item.id.toUpperCase()}
        </span>
      ) : isActive ? (
        <ChevronRight size={11} className="opacity-40" />
      ) : null}
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose, updateSidebarOption }: SidebarProps) => {
  const dispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    location.pathname.replace("/", ""),
  );
  const navigate = useNavigate();

  const updateSidebar = (option: string) => {
    setActiveItem(option);
    if (option === "logout") {
      logout();
      dispatch(setLogout());
    } else if (option === "msc") {
      navigate(`/miscellaneous`);
    } else {
      navigate(`/${option}`);
    }
    updateSidebarOption(option);
  };

  const logout = async () => {
    const data = await get(
      `${import.meta.env.VITE_BACKEND_API_URL}/auth/logout`,
    );
    if (!data) return;
    navigate("/login");
  };

  const allItems = [...menuItems, ...bottomItems];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#1a1a18]/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[220px] bg-[#fafaf8] border-r border-[#e8e8e0]
          z-40 flex flex-col transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-0
        `}
      >
        {/* Logo */}
        <div className="h-[60px] flex items-center px-5 border-b border-[#e8e8e0] flex-shrink-0">
          <a href="/" className="flex items-center gap-2 no-underline">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="text-[16px] font-semibold tracking-tight text-[#1a1a18]">
              NathRacker
            </span>
          </a>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5">
          <SectionLabel label="ENCODER MODULES" />
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

          <SectionLabel label="VERIFICATION MODULES - UNDERDEVELOPMENT" /> 
          <nav className="space-y-0.5">
            {verificationMenuItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={() => console.log("UNDERDEVELOPMENT")}
                // onClick={() => updateSidebar(item.id)}
              />
            ))}
          </nav>

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
        </div>

        {/* Footer */}
        <div className="border-t border-[#e8e8e0] p-2.5 flex-shrink-0 space-y-1">
          {/* User card */}
          {User && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white border border-[#e8e8e0]">
              <div className="w-7 h-7 rounded-full bg-[#1a1a18] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-white">
                  {(User.govUsername?.[0] ?? "U").toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-[#1a1a18] truncate leading-tight">
                  {User.govUsername}
                </p>
                <p className="text-[10px] text-[#8a8a80] font-mono uppercase tracking-wide">
                  {User.role ?? "ENCODER"}
                </p>
              </div>
            </div>
          )}

          {/* Quick links row */}
          <div className="flex gap-1">
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] text-[#8a8a80] hover:text-[#1a1a18] no-underline transition-colors rounded-lg hover:bg-[#f0f0ec]"
            >
              <HelpCircle size={12} />
              Help
            </a>
            <a
              href="#"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] text-[#8a8a80] hover:text-[#1a1a18] no-underline transition-colors rounded-lg hover:bg-[#f0f0ec]"
            >
              <FileIcon size={12} />
              Docs
            </a>
            <button
              onClick={() => updateSidebar("logout")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg cursor-pointer"
            >
              <LogOut size={12} />
              Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
