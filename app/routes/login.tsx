import { Login } from "~/Login/login";
import { LoadingScreen } from "component/LoadingScreen";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth
  
 } from "component/authGuard";
export default function LoginRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  if (isLoading) return <LoadingScreen />;

  return <Login />;
}