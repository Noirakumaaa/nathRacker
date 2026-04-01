import { useEffect } from "react";
import { useNavigate } from "react-router";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { LoadingScreen } from "component/LoadingScreen";
import { useAuth } from "component/authGuard";
import BarangayTab from "~/adminSettings/BarangayTab";

export function meta() {
  return [
    { title: "Barangay" },
    { name: "description", content: "Manage barangays" },
  ];
}

export default function AdminBarangayRoute() {
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
      <BarangayTab />
    </LayoutWrapper>
  );
}
