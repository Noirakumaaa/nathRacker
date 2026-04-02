import BarangayTab from "~/adminSettings/BarangayTab";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Barangay" },
    { name: "description", content: "Manage barangays" },
  ];
}

export default function AdminBarangayRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <BarangayTab />;
}
