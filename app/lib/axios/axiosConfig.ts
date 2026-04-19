import axios, { AxiosError } from "axios"
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

const APIFETCH = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// APIFETCH.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null
//     if (token) config.headers.Authorization = `Bearer ${token}`
//     return config
//   },
//   (error: AxiosError) => Promise.reject(error)
// )

let isLoggingOut = false

APIFETCH.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const url = error.config?.url ?? ""

    if (error.response?.status === 401) {
      if (url.includes("/auth/check-auth")) {
        return Promise.reject(error)
      }

      if (!url.includes("/auth/") && typeof window !== "undefined" && !isLoggingOut) {
        try {
          await APIFETCH.get("/auth/check-auth")
          // session is still valid — just this request failed, don't logout
        } catch {
          // session is truly dead — logout
          isLoggingOut = true
          queryClient.removeQueries({ queryKey: ["me"] })
          await APIFETCH.post("/auth/logout")
          window.location.href = "/login"
        }
      }
    }

    if (error.response?.status === 403 && typeof window !== "undefined") {
      window.location.href = "/404"
    }

    return Promise.reject(error)
  }
)

export default APIFETCH