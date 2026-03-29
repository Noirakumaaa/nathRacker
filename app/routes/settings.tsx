import SettingsPage from "../settings/settings";
import LayoutWrapper from "layout/navLayout";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";
import { LoadingScreen } from "component/LoadingScreen";


export function Meta() {
  return [
    { title: "Settings" },
    { name: "description", content: "User settings page" },
  ];
}



export default function SettingsRoute() {
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
      <SettingsPage />;
    </LayoutWrapper>
  )

}