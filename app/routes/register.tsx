import type { MetaFunction } from "react-router"
import { useEffect } from "react"
import RegisterForm from "~/features/auth/register"
import { useNavigate } from "react-router"
import LayoutWrapper from "~/layouts/navLayout"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { AUTHORIZED_ROLES } from "~/types/authorizedUser"
import { LoadingScreen } from "~/components/LoadingScreen"
import { useAuth } from "~/components/authGuard"
import { ErrorBoundary } from "~/components/ErrorBoundary"

export const meta: MetaFunction = () => [
  { title: "Register | NathRacker" },
  { name: "description", content: "Register a new user account" },
]

export default function RegisterRoute() {
  const navigate = useNavigate()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login", { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated || !user) return null

  if (!AUTHORIZED_ROLES.includes(user.role)) {
    return (
      <LayoutWrapper>
        <UnauthorizedPage statusCode={403} />
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <ErrorBoundary>
        <RegisterForm />
      </ErrorBoundary>
    </LayoutWrapper>
  )
}
