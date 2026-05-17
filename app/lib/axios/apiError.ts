import { isAxiosError } from "axios"

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message
    if (Array.isArray(msg)) return String(msg[0])
    if (typeof msg === "string" && msg.trim()) return msg

    if (error.code === "ECONNABORTED") {
      return "The server took too long to respond. Please try again."
    }

    if (!error.response) {
      const axiosMessage = (error.message ?? "").toLowerCase()
      if (
        axiosMessage.includes("network error") ||
        axiosMessage.includes("failed to fetch") ||
        axiosMessage.includes("load failed")
      ) {
        return "Unable to reach the API. This is usually a CORS or connection issue. Check that the frontend origin is allowed and the API is running."
      }
    }
  }
  return fallback
}
