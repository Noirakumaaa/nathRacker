import CvsPage from "~/features/encoder/cvs/cvsMain";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "CVS Encoder | NathRacker" },
    { name: "description", content: "Encode CVS compliance verification forms" },
  ];
}

export default function CVSRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <CvsPage />;
}
