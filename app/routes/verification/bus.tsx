import BusVerificationList from "~/verification/bus/BusVerificationList";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useAuth } from "component/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [{ title: "BUS Verification" }];
}

export default function BusVerificationRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage />;

  return <BusVerificationList />;
}
