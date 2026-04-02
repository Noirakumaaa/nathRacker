import LguTab from "~/adminSettings/LguTab";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "LGU" },
    { name: "description", content: "Manage LGUs" },
  ];
}

export default function AdminLguRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <LguTab />;
}
