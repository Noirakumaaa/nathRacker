import { useEffect } from "react";
import LcnMain from "~/lcn/Lcn";
import { useNavigate } from "react-router";
import LayoutWrapper from "layout/navLayout";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import {AuthorizedUser} from "~/types/authorizedUser";
import { LoadingScreen } from "component/LoadingScreen";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "LCN" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function LCNRoute() {
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
      <LcnMain />
    </LayoutWrapper>
  );
}
