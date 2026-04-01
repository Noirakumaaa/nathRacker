import MyOfficeDashboard from "~/operations/myOffice/MyOfficeDashboard";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { LoadingScreen } from "component/LoadingScreen";
import { useAuth } from "component/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [
    { title: "My Office" },
    { name: "description", content: "Area management scoped to your operations office" },
  ];
}

export default function MyOfficeRoute() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  if (!ALLOWED_ROLES.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <MyOfficeDashboard userData={user} />
    </LayoutWrapper>
  );
}
