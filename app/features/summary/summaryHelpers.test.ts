import { describe, it, expect } from "vitest";
import { isWorkday, fmtDate } from "./summaryHelpers";

describe("isWorkday", () => {
  it("returns true for a Monday", () => {
    expect(isWorkday("2025-04-07")).toBe(true); // Monday
  });

  it("returns true for a Friday", () => {
    expect(isWorkday("2025-04-11")).toBe(true); // Friday
  });

  it("returns false for a Saturday", () => {
    expect(isWorkday("2025-04-12")).toBe(false); // Saturday
  });

  it("returns false for a Sunday", () => {
    expect(isWorkday("2025-04-13")).toBe(false); // Sunday
  });

  it("returns true for a Wednesday", () => {
    expect(isWorkday("2025-04-09")).toBe(true); // Wednesday
  });
});

describe("fmtDate", () => {
  it("formats a date to short month and day", () => {
    const result = fmtDate("2025-04-07");
    expect(result).toMatch(/Apr/);
    expect(result).toMatch(/7/);
  });

  it("returns a non-empty string", () => {
    expect(fmtDate("2025-01-01")).toBeTruthy();
  });
});
