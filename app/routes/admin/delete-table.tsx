import DeleteTableTab from "~/features/admin/settings/DeleteTableTab";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Delete Table" },
    { name: "description", content: "Delete database tables" },
  ];
}

export default function AdminDeleteTableRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;
  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <DeleteTableTab />;
}
