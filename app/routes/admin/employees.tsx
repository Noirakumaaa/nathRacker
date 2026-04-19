import EmployeesTab from "~/features/admin/settings/EmployeesTab";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Employees" },
    { name: "description", content: "Manage employees" },
  ];
}

export default function AdminEmployeesRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <EmployeesTab />;
}
