import type { MetaFunction } from "react-router"
import MiscMain from "~/features/encoder/miscellaneous/MiscMain"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { AUTHORIZED_ROLES } from "~/types/authorizedUser"
import { useAuth } from "~/components/authGuard"
import { LoadingScreen } from "~/components/LoadingScreen"
import { ErrorBoundary } from "~/components/ErrorBoundary"

export const meta: MetaFunction = () => [
  { title: "Miscellaneous Encoder | NathRacker" },
  { name: "description", content: "Encode miscellaneous document records" },
]

export default function MiscellaneousRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!user) return <UnauthorizedPage statusCode={401} />
  if (!AUTHORIZED_ROLES.includes(user.role)) return <UnauthorizedPage statusCode={403} />

  return (
    <ErrorBoundary>
      <MiscMain />
    </ErrorBoundary>
  )
}
