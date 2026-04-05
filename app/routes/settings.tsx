import SettingsPage from "../settings/settings";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Settings" },
    { name: "description", content: "User settings page" },
  ];
}

export default function SettingsRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <SettingsPage />;
}
