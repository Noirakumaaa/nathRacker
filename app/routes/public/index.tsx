import IndexPage from "~/index";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from 'component/authGuard';

export function meta() {
  return [
    { title: "NathRacker" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated]);

  return (<IndexPage />)
}
