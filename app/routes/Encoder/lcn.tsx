import LcnMain from "~/features/encoder/lcn/Lcn";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "LCN Encoder | NathRacker" },
    { name: "description", content: "Encode LCN change notification records" },
  ];
}

export default function LCNRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <LcnMain />;
}
