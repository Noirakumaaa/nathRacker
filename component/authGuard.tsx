// lib/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useNavigate } from "react-router";
export function useAuth() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await APIFETCH.get(`/auth/check-auth`);
      if (res.data?.error || res.data?.statusCode === 401) {
        navigate("/login")
        throw new Error("Unauthorized"); 
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