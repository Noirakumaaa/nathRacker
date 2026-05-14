import type { MetaFunction } from "react-router"
import CvsPage from "~/features/encoder/cvs/cvsMain"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { AUTHORIZED_ROLES } from "~/types/authorizedUser"
import { useAuth } from "~/components/authGuard"
import { LoadingScreen } from "~/components/LoadingScreen"
import { ErrorBoundary } from "~/components/ErrorBoundary"

export const meta: MetaFunction = () => [
  { title: "CVS Encoder | NathRacker" },
  { name: "description", content: "Encode CVS compliance verification forms" },
]

export default function CVSRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!user) return <UnauthorizedPage statusCode={401} />
  if (!AUTHORIZED_ROLES.includes(user.role)) return <UnauthorizedPage statusCode={403} />

  return (
    <ErrorBoundary>
      <CvsPage />
    </ErrorBoundary>
  )
}
