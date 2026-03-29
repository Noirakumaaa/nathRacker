// lib/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";

export function useAuth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await APIFETCH.get(`/auth/check-auth`);
      if (res.data?.error || res.data?.statusCode === 401) {
        throw new Error("Unauthorized"); // ✅ force isError = true
      }
      return res.data;
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data && !isError,
    isError,
  };
}