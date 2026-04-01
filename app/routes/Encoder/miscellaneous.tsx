import { useEffect } from "react"
import MiscMain from "~/Encoder/miscellaneous/MiscMain"
import { useNavigate } from "react-router"
import LayoutWrapper from "layout/navLayout"
import UnauthorizedPage from "~/notAuthorized/notAuthorized"
import { AuthorizedUser } from "~/types/authorizedUser"
import { useAuth } from "component/authGuard"
import { LoadingScreen } from "component/LoadingScreen"

export function meta() {
  return [
    { title: "Miscellaneous" },
    { name: "description", content: "View your dashboard" },
  ]
}


export default function MiscellaneousRoute() {
   const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return null;

  if (!AuthorizedUser.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage />
      </LayoutWrapper>
    );
  }
  return (
    <LayoutWrapper>
      <MiscMain />
    </LayoutWrapper>
  )
}
