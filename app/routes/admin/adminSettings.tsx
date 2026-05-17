import type { MetaFunction } from "react-router"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import AdminSettingsPage from "~/features/admin/settings/AdminSettingsPage"
import LayoutWrapper from "~/layouts/navLayout"
import UnauthorizedPage from "~/features/not-authorized/not-authorized"
import { AUTHORIZED_ROLES } from "~/types/authorizedUser"
import { LoadingScreen } from "~/components/LoadingScreen"
import { useAuth } from "~/components/authGuard"
import { ErrorBoundary } from "~/components/ErrorBoundary"

export const meta: MetaFunction = () => [
  { title: "Admin Settings | NathRacker" },
  { name: "description", content: "Manage admin settings and configuration" },
]

export default function AdminSettingsRoute() {
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
        <AdminSettingsPage />
      </ErrorBoundary>
    </LayoutWrapper>
  )
}
