import EmployeesTab from "~/adminSettings/EmployeesTab";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

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
