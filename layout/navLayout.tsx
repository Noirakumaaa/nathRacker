import { useState, type ReactNode } from "react";
import { useNavigation } from "react-router";
import { Loader2 } from "lucide-react";
import Sidebar from "../component/sideMenu";
import TopNavbar from "../component/navigation";

type LayoutWrapperProps = {
  children: ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const updateSidebarOption = (option: string) => {
    setActiveSection(option);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Fixed Top Navigation */}
      <TopNavbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          updateSidebarOption={updateSidebarOption}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto pt-16">
          {isNavigating ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={24} className="animate-spin text-[#1a1a18]" />
                <p className="text-[13px] text-[#8a8a80]">Loading...</p>
              </div>
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
