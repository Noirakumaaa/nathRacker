import axios, { AxiosError } from "axios"
import type { AxiosResponse } from "axios"
import { getQueryClient } from "~/lib/queryClient"

const APIFETCH = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  timeout: 10_000,
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

let sessionCheckPromise: Promise<void> | null = null

APIFETCH.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const url = error.config?.url ?? ""

    if (error.response?.status === 401) {
      if (url.includes("/auth/check-auth")) {
        return Promise.reject(error)
      }

      if (!url.includes("/auth/") && typeof window !== "undefined") {
        if (!sessionCheckPromise) {
          sessionCheckPromise = APIFETCH.get("/auth/check-auth")
            .then(() => {
              // session still valid — this request just failed, don't logout
            })
            .catch(async () => {
              // session is truly dead — logout
              getQueryClient().clear()
              try {
                await APIFETCH.get("/auth/logout")
              } catch {
                /* best-effort */
              }
              window.location.replace("/login")
            })
            .finally(() => {
              sessionCheckPromise = null
            })
        }
        await sessionCheckPromise
      }
    }

    if (error.response?.status === 403 && typeof window !== "undefined") {
      window.location.href = "/404"
    }

    return Promise.reject(error)
  }
)

export default APIFETCH
