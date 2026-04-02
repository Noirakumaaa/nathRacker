import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { Menu, X, Search } from "lucide-react";
import type { me } from "~/types/authTypes";

type TopNavbarProps = {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
};

const TopNavbar = ({ onMenuToggle, isSidebarOpen }: TopNavbarProps) => {

  const { data : user } = useQuery({
    queryKey : ["me"],
    queryFn : async () => {
      const res = await APIFETCH.get<me>("/auth/check-auth")
      return res.data
    },
    retry : false
  })

  if (!user) {
    return (
      <nav className="bg-(--color-bg) border-b border-(--color-border) fixed top-0 left-0 right-0 z-50 h-15 font-sans antialiased">
        <div className="flex items-center justify-between h-full px-5">
          <div className="flex items-center gap-2.5">
            <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-10 h-10" />
            <span className="text-[16px] font-semibold tracking-tight text-(--color-ink)">NathRacker</span>
          </div>
          <div className="w-24 h-5 bg-(--color-subtle) rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-(--color-bg) border-b border-(--color-border) fixed top-0 left-0 right-0 z-50 h-15 font-sans antialiased">
      <div className="flex items-center justify-between h-full px-5">

        {/* Left — hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-(--color-muted) hover:bg-(--color-border) hover:text-(--color-ink) transition-colors lg:hidden cursor-pointer"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 no-underline"
          >
            <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-10 h-10" />
            <span className="text-[16px] font-semibold tracking-tight text-(--color-ink)">
              NathRacker
            </span>
          </a>
        </div>

        {/* Center — search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-placeholder)"
            />
            <input
              type="text"
              placeholder="Search… (under development)"
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-ink) placeholder-(--color-placeholder) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors"
            />
          </div>
        </div>

        {/* Right — user */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pl-3 border-l border-(--color-border)">
            <div className="w-7 h-7 rounded-full bg-(--color-subtle) border border-(--color-border) flex items-center justify-center">
              <span className="text-[11px] font-semibold text-(--color-muted)">
                {(user.govUsername?.[0] ?? "U").toUpperCase()}
              </span>
            </div>
            <span className="hidden md:block text-[13px] font-medium text-(--color-ink)">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default TopNavbar;