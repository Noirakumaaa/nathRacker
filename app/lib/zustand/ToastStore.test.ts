import { describe, it, expect, vi, beforeEach } from "vitest";
import { useToastStore } from "./ToastStore";

beforeEach(() => {
  useToastStore.setState({ open: false, statusMessage: "", toastStatus: "success" });
});

describe("ToastStore", () => {
  it("starts with toast closed", () => {
    const { open } = useToastStore.getState();
    expect(open).toBe(false);
  });

  it("show() opens the toast with correct message and status", () => {
    useToastStore.getState().show("Saved successfully", "success");
    const { open, statusMessage, toastStatus } = useToastStore.getState();
    expect(open).toBe(true);
    expect(statusMessage).toBe("Saved successfully");
    expect(toastStatus).toBe("success");
  });

  it("show() works with error status", () => {
    useToastStore.getState().show("Something went wrong", "error");
    const { toastStatus, statusMessage } = useToastStore.getState();
    expect(toastStatus).toBe("error");
    expect(statusMessage).toBe("Something went wrong");
  });

  it("hide() closes the toast", () => {
    useToastStore.getState().show("Test", "success");
    useToastStore.getState().hide();
    expect(useToastStore.getState().open).toBe(false);
  });

  it("show() auto-hides after 3 seconds", async () => {
    vi.useFakeTimers();
    useToastStore.getState().show("Auto hide test", "success");
    expect(useToastStore.getState().open).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(useToastStore.getState().open).toBe(false);
    vi.useRealTimers();
  });
});
