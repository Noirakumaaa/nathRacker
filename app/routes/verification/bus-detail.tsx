import BusVerificationDetail from "~/verification/bus/BusVerificationDetail";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { useAuth } from "component/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [{ title: "BUS Verification" }];
}

export default function BusVerificationDetailRoute() {
  const navigate = useNavigate();
  const { cl } = useParams<{ cl: string }>();
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  useEffect(() => {
    if (!cl) navigate("/verification/bus");
  }, [cl]);

  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage />;
  if (!cl) return null;

  return <BusVerificationDetail bdm={decodeURIComponent(cl)} />;
}
