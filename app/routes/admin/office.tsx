import OfficeTab from "~/adminSettings/OfficeTab";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Operations Office" },
    { name: "description", content: "Manage operations offices" },
  ];
}

export default function AdminOfficeRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <OfficeTab />;
}
