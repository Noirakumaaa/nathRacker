import { z } from "zod";

const lettersOnly = z
  .string()
  .regex(/^[a-zA-Z.,' ]+$/, "Letters only");

const numbersAndDashes = z
  .string()
  .regex(/^[0-9-]+$/, "Numbers and dashes only");

const remarksEnum = z.enum(["ENCODED", "ISSUE", "UPDATED"]);

// ── BUS ──────────────────────────────────────────────────────────────────────
export const BusFormSchema = z
  .object({
    lgu:             z.string().min(1, "LGU is required"),
    barangay:        z.string().min(1, "Barangay is required"),
    hhId:            numbersAndDashes.min(6, "Must be at least 6 characters").max(25),
    granteeName:     lettersOnly.min(6, "Must be at least 6 characters").max(40),
    subjectOfChange: lettersOnly.min(6, "Must be at least 6 characters").max(40),
    typeOfUpdate:    z.string().min(1, "Type of update is required"),
    updateInfo:      lettersOnly.min(6, "Must be at least 6 characters").max(50),
    remarks:         remarksEnum,
    cl:              lettersOnly.min(6, "Must be at least 6 characters").max(50),
    issue:           z.string().max(80),
    drn:             z.string(),
    note:            z.string().max(80),
  })
  .superRefine((data, ctx) => {
    if (data.remarks === "ISSUE" && !data.issue.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issue"],
        message: "Issue description is required when Remarks is ISSUE",
      });
    }
  });

export type BusFormValues = z.infer<typeof BusFormSchema>;

// ── SWDI ─────────────────────────────────────────────────────────────────────
export const SwdiFormSchema = z
  .object({
    lgu:       z.string().min(1, "LGU is required"),
    barangay:  z.string().min(1, "Barangay is required"),
    hhId:      numbersAndDashes.min(6, "Must be at least 6 characters").max(25),
    grantee:   lettersOnly.min(4, "Must be at least 4 characters").max(50),
    swdiScore: z.string().regex(/^\d*\.?\d+$/, "Must be a number between 1 and 3").min(1, "Required"),
    swdiLevel: z.string().min(1, "Level is required"),
    remarks:   remarksEnum,
    issue:     z.string().max(80).optional(),
    cl:        z.string().max(50).optional(),
    drn:       z.string().optional(),
    note:      z.string().max(80).optional(),
    date:      z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.remarks === "ISSUE" && !data.issue?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issue"],
        message: "Issue description is required when Remarks is ISSUE",
      });
    }
  });

export type SwdiFormValues = z.infer<typeof SwdiFormSchema>;

// ── LCN ──────────────────────────────────────────────────────────────────────
export const LcnFormSchema = z
  .object({
    lgu:             z.string().min(1, "LGU is required"),
    barangay:        z.string().min(1, "Barangay is required"),
    hhId:            numbersAndDashes.min(6, "Must be at least 6 characters").max(25),
    granteeName:     lettersOnly.min(6, "Must be at least 6 characters").max(40),
    subjectOfChange: lettersOnly.min(6, "Must be at least 6 characters").max(40),
    pcn:             z.string().optional(),
    lrn:             z.string().optional(),
    drn:             z.string().optional(),
    cl:              z.string().max(50).optional(),
    remarks:         remarksEnum,
    issue:           z.string().max(80).optional(),
    note:            z.string().max(80).optional(),
    date:            z.string().optional(),
    encodedBy:       z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.pcn?.trim() && !data.lrn?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pcn"],
        message: "At least one of PCN or LRN is required",
      });
    }
    if (data.remarks === "ISSUE" && !data.issue?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issue"],
        message: "Issue description is required when Remarks is ISSUE",
      });
    }
  });

export type LcnFormValues = z.infer<typeof LcnFormSchema>;

// ── CVS ──────────────────────────────────────────────────────────────────────
export const CvsFormSchema = z.object({
  idNumber:     z.string().min(1, "ID Number is required"),
  lgu:          z.string().min(1, "LGU is required"),
  barangay:     z.string().min(1, "Barangay is required"),
  facilityName: z.string().min(2, "Facility name is required"),
  formType:     z.string().min(1, "Form type is required"),
  period:       z.string().min(1, "Period is required"),
  remarks:      remarksEnum,
  issue:        z.string().max(80).optional(),
  date:         z.string().optional(),
});

export type CvsFormValues = z.infer<typeof CvsFormSchema>;

// ── MISC ─────────────────────────────────────────────────────────────────────
export const MiscFormSchema = z
  .object({
    lgu:             z.string().min(1, "LGU is required"),
    barangay:        z.string().min(1, "Barangay is required"),
    hhId:            numbersAndDashes.min(6, "Must be at least 6 characters").max(25),
    granteeName:     lettersOnly.min(6, "Must be at least 6 characters").max(40),
    subjectOfChange: lettersOnly.min(6, "Must be at least 6 characters").max(40),
    documentType:    z.string().min(1, "Document type is required"),
    cl:              lettersOnly.min(6, "Must be at least 6 characters").max(50),
    remarks:         z.enum(["ENCODED", "SCANNED", "TRACKED", "UPDATED", "VERIFIED", "ISSUE"]),
    issue:           z.string().max(80).optional(),
    drn:             z.string().optional(),
    note:            z.string().max(80).optional(),
    date:            z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.remarks === "ISSUE" && !data.issue?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["issue"],
        message: "Issue description is required when Remarks is ISSUE",
      });
    }
  });

export type MiscFormValues = z.infer<typeof MiscFormSchema>;
