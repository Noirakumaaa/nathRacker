import APIFETCH from "~/lib/axios/axiosConfig"
import type { LoginInput, LoginResponse, me } from "~/types/authTypes"

export const authService = {
  checkAuth: () => APIFETCH.get<me>("/auth/check-auth").then((r) => r.data),
  login: (credentials: LoginInput) =>
    APIFETCH.post<LoginResponse>("/auth/login", credentials).then((r) => r.data),
  logout: () => APIFETCH.get("/auth/logout").then((r) => r.data),
  forgotPassword: (data: { email: string }) =>
    APIFETCH.post("/auth/forgot-password", data).then((r) => r.data),
}
