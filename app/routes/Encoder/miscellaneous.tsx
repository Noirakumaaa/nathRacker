import MiscMain from "~/Encoder/miscellaneous/MiscMain";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Miscellaneous" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function MiscellaneousRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <MiscMain />;
}
