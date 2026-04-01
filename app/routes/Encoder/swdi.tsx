import { useEffect } from "react";
import SWDIMainContent from "~/Encoder/swdi/swdiMain";
import { useNavigate } from "react-router";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";
import { LoadingScreen } from "component/LoadingScreen";


export function meta() {
  return [
    { title: "SWDI" },
    { name: "description", content: "View your dashboard" },
  ];
}



export default function DashboardRoute() {
 const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  if (!AuthorizedUser.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <SWDIMainContent />
    </LayoutWrapper>
  );
}
