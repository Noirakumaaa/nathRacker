// lib/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useNavigate } from "react-router";
export function useAuth() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await APIFETCH.get(`/auth/check-auth`);
        if (res.data?.error || res.data?.statusCode === 401) {
          navigate("/login");
          throw new Error("Unauthorized");
        }
        return res.data;
      } catch (err: any) {
        // Covers HTTP 401/403 status codes that Axios throws as errors
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          navigate("/login");
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  // When the query errors (expired cookie, 401, etc.) keep isLoading true
  // so AppLayout never renders <Outlet /> with an undefined user while
  // the navigation to /login is in flight.
  return {
    user: data,
    isLoading: isLoading || isError,
    isAuthenticated: !!data && !isError,
    isError,
  };
}