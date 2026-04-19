import MyOfficeDashboard from "~/features/operations/my-office/MyOfficeDashboard";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { useAuth } from "~/components/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [
    { title: "My Office" },
    { name: "description", content: "Area management scoped to your operations office" },
  ];
}

export default function MyOfficeRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage />;

  return <MyOfficeDashboard userData={user} />;
}
