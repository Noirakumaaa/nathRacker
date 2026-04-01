import BusVerificationDetail from "~/verification/bus/BusVerificationDetail";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { LoadingScreen } from "component/LoadingScreen";
import { useAuth } from "component/authGuard";

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"];

export function meta() {
  return [{ title: "BUS Verification" }];
}

export default function BusVerificationDetailRoute() {
  const navigate = useNavigate();
  const { cl } = useParams<{ cl: string }>();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  if (!ALLOWED_ROLES.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    );
  }

  if (!cl) {
    navigate("/verification/bus");
    return null;
  }

  return (
    <LayoutWrapper>
      <BusVerificationDetail bdm={decodeURIComponent(cl)} />
    </LayoutWrapper>
  );
}
