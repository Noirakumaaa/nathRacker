import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import LayoutWrapper from "layout/navLayout";
import { useAuth } from "component/authGuard";

export default function AppLayout() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);

  return (
    <LayoutWrapper>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-[#1a1a18]" />
            <p className="text-[13px] text-[#8a8a80]">Loading...</p>
          </div>
        </div>
      ) : isAuthenticated ? (
        <Outlet />
      ) : null}
    </LayoutWrapper>
  );
}
