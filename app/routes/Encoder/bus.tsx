import type { MetaFunction } from "react-router"
import BusMain from "~/features/encoder/bus/busMain"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { AUTHORIZED_ROLES } from "~/types/authorizedUser"
import { useAuth } from "~/components/authGuard"
import { LoadingScreen } from "~/components/LoadingScreen"
import { ErrorBoundary } from "~/components/ErrorBoundary"

export const meta: MetaFunction = () => [
  { title: "BUS Encoder | NathRacker" },
  { name: "description", content: "Encode BUS household update forms" },
]

export default function BusRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!user) return <UnauthorizedPage statusCode={401} />
  if (!AUTHORIZED_ROLES.includes(user.role)) return <UnauthorizedPage statusCode={403} />

  return (
    <ErrorBoundary>
      <BusMain />
    </ErrorBoundary>
  )
}
