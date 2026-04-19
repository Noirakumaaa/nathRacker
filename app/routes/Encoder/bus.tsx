import BusMain from "~/features/encoder/bus/busMain";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "BUS Encoder | NathRacker" },
    { name: "description", content: "Encode BUS household update forms" },
  ];
}

export default function BusRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <BusMain />;
}
