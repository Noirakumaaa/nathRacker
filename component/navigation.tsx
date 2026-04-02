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
      <nav className="bg-[#fafaf8] border-b border-[#e8e8e0] fixed top-0 left-0 right-0 z-50 h-15 font-sans antialiased">
        <div className="flex items-center justify-between h-full px-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="text-[16px] font-semibold tracking-tight text-[#1a1a18]">NathRacker</span>
          </div>
          <div className="w-24 h-5 bg-[#f0f0ec] rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#fafaf8] border-b border-[#e8e8e0] fixed top-0 left-0 right-0 z-50 h-15 font-sans antialiased">
      <div className="flex items-center justify-between h-full px-5">

        {/* Left — hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-[#8a8a80] hover:bg-[#e8e8e0] hover:text-[#1a1a18] transition-colors lg:hidden cursor-pointer"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 no-underline"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="text-[16px] font-semibold tracking-tight text-[#1a1a18]">
              NathRacker
            </span>
          </a>
        </div>

        {/* Center — search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4c4b8]"
            />
            <input
              type="text"
              placeholder="Search… (under development)"
              className="w-full pl-9 pr-4 py-2 text-[13px] border border-[#e8e8e0] rounded-lg bg-white text-[#1a1a18] placeholder-[#c4c4b8] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors"
            />
          </div>
        </div>

        {/* Right — user */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#e8e8e0]">
            <div className="w-7 h-7 rounded-full bg-[#f5f5f2] border border-[#e8e8e0] flex items-center justify-center">
              <span className="text-[11px] font-semibold text-[#8a8a80]">
                {(user.govUsername?.[0] ?? "U").toUpperCase()}
              </span>
            </div>
            <span className="hidden md:block text-[13px] font-medium text-[#1a1a18]">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default TopNavbar;