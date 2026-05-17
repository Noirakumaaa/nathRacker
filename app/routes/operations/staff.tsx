import StaffPage from "~/features/operations/my-office/StaffPage"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { useAuth } from "~/components/authGuard"
import { LoadingScreen } from "~/components/LoadingScreen"

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"]

export function meta() {
  return [{ title: "Staff" }]
}

export default function StaffRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!user) return <UnauthorizedPage />

  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage />

  return <StaffPage userData={user} />
}
