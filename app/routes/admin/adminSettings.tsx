import { useEffect } from "react";
import { useNavigate } from "react-router";
import AdminSettingsPage from "~/features/admin/settings/AdminSettingsPage";
import LayoutWrapper from "~/layouts/navLayout";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { LoadingScreen } from "~/components/LoadingScreen";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "BUS" },
    { name: "description", content: "Encoding Bus Forms" },
  ];
}

export default function RegisterRoute() {
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
      <AdminSettingsPage />
    </LayoutWrapper>
  );
}
