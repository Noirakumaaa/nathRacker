import { describe, it, expect } from "vitest";
import { ROLES, ENCODER_ROLES, ADMIN_ROLES, VERIFIER_ROLES, OPERATIONS_ROLES } from "./roles";

describe("ROLES constants", () => {
  it("ENCODER_ROLES includes ENCODER, ADMIN, and SWA", () => {
    expect(ENCODER_ROLES).toContain(ROLES.ENCODER);
    expect(ENCODER_ROLES).toContain(ROLES.ADMIN);
    expect(ENCODER_ROLES).toContain(ROLES.SWA);
  });

  it("ADMIN_ROLES only contains ADMIN", () => {
    expect(ADMIN_ROLES).toEqual([ROLES.ADMIN]);
  });

  it("VERIFIER_ROLES includes VERIFIER and ADMIN", () => {
    expect(VERIFIER_ROLES).toContain(ROLES.VERIFIER);
    expect(VERIFIER_ROLES).toContain(ROLES.ADMIN);
  });

  it("OPERATIONS_ROLES includes AC, SWOIII, and ADMIN", () => {
    expect(OPERATIONS_ROLES).toContain(ROLES.AC);
    expect(OPERATIONS_ROLES).toContain(ROLES.SWOIII);
    expect(OPERATIONS_ROLES).toContain(ROLES.ADMIN);
  });

  it("role values match their keys", () => {
    expect(ROLES.ADMIN).toBe("ADMIN");
    expect(ROLES.ENCODER).toBe("ENCODER");
    expect(ROLES.VERIFIER).toBe("VERIFIER");
  });
});
