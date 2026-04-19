import APIFETCH from "~/lib/axios/axiosConfig";

export const authService = {
  checkAuth: () => APIFETCH.get("/auth/check-auth").then((r) => r.data),
  login: (credentials: { govUsername: string; password: string }) =>
    APIFETCH.post("/auth/login", credentials).then((r) => r.data),
  logout: () => APIFETCH.get("/auth/logout").then((r) => r.data),
  forgotPassword: (data: { govUsername: string }) =>
    APIFETCH.post("/auth/forgot-password", data).then((r) => r.data),
};
