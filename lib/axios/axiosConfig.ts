// lib/axios/axiosConfig.ts
import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { queryClient } from "./../../app/root";

const APIFETCH = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

APIFETCH.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

APIFETCH.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      if (url.includes('/auth/check-auth')) {
        return { data: null }; // ✅ return axios-like shape so res.data works
      }
      if (!url.includes('/auth/') && typeof window !== "undefined") {
        queryClient.removeQueries({ queryKey: ["me"] });
        await APIFETCH.post('/auth/logout');
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403 && typeof window !== "undefined") {
      window.location.href = "/unauthorized";
    }
    return Promise.reject(error);
  },
);

export default APIFETCH;