// lib/axios/axiosConfig.ts
import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { queryClient } from "./../../app/root"; // ← import the instance directly

const APIFETCH = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

APIFETCH.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
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
      if (!url.includes('/auth/')) {
        queryClient.removeQueries({ queryKey: ["me"] }); // ← clear cache
        await fetch(`/api/auth/logout`, {
          credentials: "include",
        });
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }
    return Promise.reject(error);
  },
);

export default APIFETCH;