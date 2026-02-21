import { useState, type ReactNode } from "react";
import Sidebar from "../component/sidebar";
import TopNavbar from "../component/navigation";

type LayoutWrapperProps = {
  children: ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

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
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
