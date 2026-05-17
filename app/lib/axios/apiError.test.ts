import { describe, it, expect } from "vitest"
import axios from "axios"
import { getApiErrorMessage } from "./apiError"

function makeAxiosError(message: unknown, status = 400) {
  return Object.assign(new axios.AxiosError("Request failed"), {
    response: { data: { message }, status, headers: {}, config: {} as never, statusText: "" },
  })
}

describe("getApiErrorMessage", () => {
  it("returns string message from axios response", () => {
    expect(getApiErrorMessage(makeAxiosError("Invalid credentials"))).toBe("Invalid credentials")
  })

  it("returns first item when message is an array", () => {
    expect(getApiErrorMessage(makeAxiosError(["Field required", "Other error"]))).toBe(
      "Field required"
    )
  })

  it("returns fallback for non-axios errors", () => {
    expect(getApiErrorMessage(new Error("network error"))).toBe("Something went wrong.")
  })

  it("returns fallback for null/undefined errors", () => {
    expect(getApiErrorMessage(null)).toBe("Something went wrong.")
    expect(getApiErrorMessage(undefined)).toBe("Something went wrong.")
  })

  it("returns custom fallback when provided", () => {
    expect(getApiErrorMessage(new Error("x"), "Custom fallback")).toBe("Custom fallback")
  })

  it("returns fallback when message is empty string", () => {
    expect(getApiErrorMessage(makeAxiosError(""))).toBe("Something went wrong.")
  })

  it("returns fallback when response has no message field", () => {
    const err = Object.assign(new axios.AxiosError("fail"), {
      response: { data: {}, status: 500, headers: {}, config: {} as never, statusText: "" },
    })
    expect(getApiErrorMessage(err)).toBe("Something went wrong.")
  })
})
