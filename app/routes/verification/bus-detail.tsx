import BusVerificationDetail from "~/features/verification/bus/BusVerificationDetail"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { useNavigate, useParams } from "react-router"
import { useEffect } from "react"
import { useAuth } from "~/components/authGuard"
import { LoadingScreen } from "~/components/LoadingScreen"

const ALLOWED_ROLES = ["AREA_COORDINATOR", "SOCIAL_WORKER_III", "ADMIN"]

export function meta() {
  return [{ title: "BUS Verification" }]
}

export default function BusVerificationDetailRoute() {
  const navigate = useNavigate()
  const { cl } = useParams<{ cl: string }>()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!cl) navigate("/verification/bus")
  }, [cl, navigate])

  if (isLoading) return <LoadingScreen />
  if (!user) return <UnauthorizedPage statusCode={401} />
  if (!ALLOWED_ROLES.includes(user.role)) return <UnauthorizedPage statusCode={403} />
  if (!cl) return null

  return <BusVerificationDetail bdm={decodeURIComponent(cl)} />
}
