import RegisterTab from "~/adminSettings/RegisterTab";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Register Account" },
    { name: "description", content: "Register a new account" },
  ];
}

export default function AdminRegisterRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <RegisterTab />;
}
