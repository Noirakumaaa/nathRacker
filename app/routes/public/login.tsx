import { Login } from "~/features/auth/login"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "~/components/authGuard"

export default function LoginRoute() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true })
  }, [isAuthenticated, navigate])

  return <Login />
}
