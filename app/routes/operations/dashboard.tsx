import OperationsDashboard from "~/operations/dashboard/OperationsDashboard";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Operations Dashboard" },
    { name: "description", content: "Operations head overview dashboard" },
  ];
}

export default function OperationsDashboardRoute() {
  const { user } = useAuth();

  if (user.role !== "ADMIN") return <UnauthorizedPage />;

  return <OperationsDashboard userData={user} />;
}
