import { useQuery } from "@tanstack/react-query"
import { useRouteLoaderData } from "react-router"
import { AUTH_GC_TIME_MS, AUTH_QUERY_KEY, AUTH_STALE_TIME_MS } from "~/features/auth/auth.shared"
import { authService } from "~/services/auth.service"
import type { me } from "~/types/authTypes"

type RootLoaderData = {
  user: me | null
  hasAccessTokenCookie: boolean
}

export function useAuth() {
  const rootData = useRouteLoaderData("root") as RootLoaderData | undefined
  const initialUser = rootData?.user ?? undefined

  const { data, isLoading, isError } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.checkAuth,
    retry: false,
    staleTime: AUTH_STALE_TIME_MS,
    gcTime: AUTH_GC_TIME_MS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: initialUser ? false : true,
    initialData: initialUser,
    enabled: true,
  })

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    isError,
  }
}
