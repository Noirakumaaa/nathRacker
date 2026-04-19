import OfficeTab from "~/features/admin/settings/OfficeTab";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Operations Office" },
    { name: "description", content: "Manage operations offices" },
  ];
}

export default function AdminOfficeRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <OfficeTab />;
}
