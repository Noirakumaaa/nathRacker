import StaffDashboard from "~/operations/myOffice/StaffDashboard";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useAuth } from "component/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [{ title: "Staff Member" }];
}

export default function StaffMemberRoute() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  useEffect(() => {
    if (!username) navigate("/operations/staff");
  }, [username]);

  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage />;
  if (!username) return null;

  return <StaffDashboard govUsername={username} />;
}
