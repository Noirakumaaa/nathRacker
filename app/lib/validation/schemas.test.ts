import { describe, it, expect } from "vitest";
import { BusFormSchema, SwdiFormSchema, CvsFormSchema } from "./schemas";

const validBus = {
  lgu: "Manila",
  barangay: "Malate",
  hhId: "123456",
  granteeName: "Juan Dela Cruz",
  subjectOfChange: "Address Change",
  typeOfUpdate: "2",
  updateInfo: "New Address Info",
  remarks: "ENCODED" as const,
  cl: "City Link SWA",
  issue: "",
  drn: "",
  note: "",
};

describe("BusFormSchema", () => {
  it("accepts a fully valid form", () => {
    const result = BusFormSchema.safeParse(validBus);
    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = BusFormSchema.safeParse({ ...validBus, lgu: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("lgu");
    }
  });

  it("rejects hhId with letters", () => {
    const result = BusFormSchema.safeParse({ ...validBus, hhId: "ABC123" });
    expect(result.success).toBe(false);
  });

  it("rejects hhId shorter than 6 characters", () => {
    const result = BusFormSchema.safeParse({ ...validBus, hhId: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects granteeName with numbers", () => {
    const result = BusFormSchema.safeParse({ ...validBus, granteeName: "Juan123" });
    expect(result.success).toBe(false);
  });

  it("requires issue when remarks is ISSUE", () => {
    const result = BusFormSchema.safeParse({
      ...validBus,
      remarks: "ISSUE",
      issue: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("issue");
    }
  });

  it("accepts ISSUE remarks with a non-empty issue", () => {
    const result = BusFormSchema.safeParse({
      ...validBus,
      remarks: "ISSUE",
      issue: "Missing document",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid remarks value", () => {
    const result = BusFormSchema.safeParse({ ...validBus, remarks: "WRONG" as never });
    expect(result.success).toBe(false);
  });
});

describe("SwdiFormSchema", () => {
  const validSwdi = {
    lgu: "Manila",
    barangay: "Malate",
    hhId: "123456",
    grantee: "Maria Santos",
    swdiScore: "42",
    swdiLevel: "LOW" as const,
    remarks: "ENCODED" as const,
    issue: "",
    cl: "",
    drn: "",
    note: "",
    date: "",
  };

  it("accepts valid SWDI form", () => {
    expect(SwdiFormSchema.safeParse(validSwdi).success).toBe(true);
  });

  it("rejects non-numeric swdiScore", () => {
    const result = SwdiFormSchema.safeParse({ ...validSwdi, swdiScore: "high" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid swdiLevel", () => {
    const result = SwdiFormSchema.safeParse({ ...validSwdi, swdiLevel: "EXTREME" as never });
    expect(result.success).toBe(false);
  });
});

describe("CvsFormSchema", () => {
  const validCvs = {
    idNumber: "CVS-001",
    lgu: "Manila",
    barangay: "Malate",
    facilityName: "Health Center",
    formType: "Type A",
    period: "Q1 2025",
    remarks: "ENCODED" as const,
    issue: "",
    date: "",
  };

  it("accepts valid CVS form", () => {
    expect(CvsFormSchema.safeParse(validCvs).success).toBe(true);
  });

  it("rejects empty idNumber", () => {
    const result = CvsFormSchema.safeParse({ ...validCvs, idNumber: "" });
    expect(result.success).toBe(false);
  });
});
