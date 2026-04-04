import { Login } from "~/Login/login";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "component/authGuard";

export default function LoginRoute() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  return <Login />;
}