import Dashboard from "~/features/encoder/dashboard/dashboard";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Dashboard" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function DashboardRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <Dashboard userData={user} />;
}
