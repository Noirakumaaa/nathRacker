import SummaryPage from "~/features/summary/summary";
import UnauthorizedPage from "~/features/not-authorized/not-authorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "~/components/authGuard";

export function meta() {
  return [
    { title: "Summary | NathRacker" },
    { name: "description", content: "Monthly encoding summary and statistics" },
  ];
}

export default function SummaryRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <UnauthorizedPage />;

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <SummaryPage />;
}
