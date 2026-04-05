import MyOfficeDashboard from "~/operations/myOffice/MyOfficeDashboard";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useAuth } from "component/authGuard";

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
