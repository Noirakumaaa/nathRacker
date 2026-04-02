import StaffPage from "~/operations/myOffice/StaffPage";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useAuth } from "component/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [{ title: "Staff" }];
}

export default function StaffRoute() {
  const { user } = useAuth();

  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage />;

  return <StaffPage userData={user} />;
}
