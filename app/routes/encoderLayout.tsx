import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import LayoutWrapper from "layout/navLayout";
import { useAuth } from "component/authGuard";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";


const authorizedUser = ["ENCODER", "ADMIN"]

export default function AppLayout() {
  const navigate = useNavigate();
  const {user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);


  return (
    <LayoutWrapper>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-(--color-ink)" />
            <p className="text-[13px] text-(--color-muted)">Loading...</p>
          </div>
        </div>
      ) : !authorizedUser.includes(user?.role) ? (
        <UnauthorizedPage />
      ) : isAuthenticated ? (
        <Outlet />
      ) : null}
    </LayoutWrapper>
  );
}
