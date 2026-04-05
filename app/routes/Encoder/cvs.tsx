import CvsPage from "~/Encoder/cvs/cvsMain";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "CVS" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function CVSRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <CvsPage />;
}
