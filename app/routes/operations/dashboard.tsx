import OperationsDashboard from "~/operations/dashboard/OperationsDashboard";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { LoadingScreen } from "component/LoadingScreen";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Operations Dashboard" },
    { name: "description", content: "Operations head overview dashboard" },
  ];
}

export default function OperationsDashboardRoute() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  if (user.role !== "ADMIN") {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <OperationsDashboard userData={user} />
    </LayoutWrapper>
  );
}
