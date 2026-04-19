import { MyRecordsTable } from "~/features/records/my-records";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "My Records | NathRacker" },
    { name: "description", content: "View your personally encoded documents" },
  ];
}

export default function MyRecordsRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <MyRecordsTable />;
}
