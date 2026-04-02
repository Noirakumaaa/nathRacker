import LcnMain from "~/Encoder/lcn/Lcn";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "LCN" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function LCNRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <LcnMain />;
}
