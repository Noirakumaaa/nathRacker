import BusMain from "~/Encoder/bus/busMain";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "BUS" },
    { name: "description", content: "Encoding Bus Forms" },
  ];
}

export default function BusRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <BusMain />;
}
