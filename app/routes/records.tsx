import { RecordsTable } from "~/features/records/records";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Global Records | NathRacker" },
    { name: "description", content: "View all encoded records across all modules" },
  ];
}

export default function RecordsRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <RecordsTable />;
}
