import { useEffect } from "react";
import { useNavigate } from "react-router";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { LoadingScreen } from "component/LoadingScreen";
import { useAuth } from "component/authGuard";
import OfficeTab from "~/adminSettings/OfficeTab";

export function meta() {
  return [
    { title: "Operations Office" },
    { name: "description", content: "Manage operations offices" },
  ];
}

export default function AdminOfficeRoute() {
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
      <OfficeTab />
    </LayoutWrapper>
  );
}
