import OperationsDashboard from "~/features/operations/dashboard/OperationsDashboard";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Operations Dashboard" },
    { name: "description", content: "Operations head overview dashboard" },
  ];
}

export default function OperationsDashboardRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (user.role !== "ADMIN") return <UnauthorizedPage />;

  return <OperationsDashboard userData={user} />;
}
