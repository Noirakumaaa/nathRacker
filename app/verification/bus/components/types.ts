export type VerifyPayload = { verified: "YES" | "ISSUE"; verificationIssue?: string };
export type DetailTab = "all" | "pending" | "verified" | "issue";

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
