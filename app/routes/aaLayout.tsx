import { Outlet, useNavigate } from "react-router"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import LayoutWrapper from "~/layouts/navLayout"
import { useAuth } from "~/components/authGuard"

export default function AaLayout() {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login", { replace: true })
  }, [isAuthenticated, isLoading, navigate])

  return (
    <LayoutWrapper>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-(--color-ink)" />
            <p className="text-[13px] text-(--color-muted)">Loading...</p>
          </div>
        </div>
      ) : isAuthenticated ? (
        <Outlet />
      ) : null}
    </LayoutWrapper>
  )
}
