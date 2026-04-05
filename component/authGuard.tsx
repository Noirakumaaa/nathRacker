import { useQuery } from "@tanstack/react-query"
import APIFETCH from "lib/axios/axiosConfig"

export function useAuth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await APIFETCH.get("/auth/check-auth")
      return res.data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    isError,
  }
}