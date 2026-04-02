import SummaryPage from "~/summary/summary ";
import UnauthorizedPage from "~/notAuthorized/notAuthorized";
import { AuthorizedUser } from "~/types/authorizedUser";
import { useAuth } from "component/authGuard";

export function meta() {
  return [
    { title: "Summary" },
    { name: "description", content: "View your dashboard" },
  ];
}

export default function SummaryRoute() {
  const { user } = useAuth();

  if (!AuthorizedUser.includes(user.role)) return <UnauthorizedPage />;

  return <SummaryPage />;
}
