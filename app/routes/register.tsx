
import { Register } from "~/Register/register";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "component/authGuard";
import { LoadingScreen } from "component/LoadingScreen";

export function meta() {
  return [
    { title: "Register" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  if (isLoading) return <LoadingScreen />;

  return <Register />;
}
