import { useState } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import type { BusRecord } from "~/types/busTypes";
import { UPDATE_TYPE_KEYMAP } from "~/types/busTypes";
import type { VerifyPayload } from "./types";
import { formatDate } from "./types";

type Props = {
  rec: BusRecord;
  onVerify: (id: string, payload: VerifyPayload) => void;
  isMutating: boolean;
};

const STATUS_CONFIG = {
  YES: {
    strip: "bg-emerald-50 border-b border-emerald-100",
    label: "Verified",
    labelCls: "text-emerald-600",
    border: "border-l-emerald-400",
    icon: <CheckCircle size={15} className="text-emerald-500" />,
  },
  ISSUE: {
    strip: "bg-red-50 border-b border-red-100",
    label: "Issue Flagged",
    labelCls: "text-red-500",
    border: "border-l-red-400",
    icon: <AlertTriangle size={15} className="text-red-400" />,
  },
} as const;

const field = (label: string, value: React.ReactNode) =>
  value ? (
    <div>
      <p className="text-xs font-semibold text-(--color-muted) uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-(--color-ink) font-medium">{value}</p>
    </div>
  ) : null;

export function RecordCard({ rec, onVerify, isMutating }: Props) {
  const [issueText, setIssueText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isPendingReview = rec.verified !== "YES" && rec.verified !== "ISSUE";
  const config = STATUS_CONFIG[rec.verified as keyof typeof STATUS_CONFIG];
  const loading = busy && isMutating;

  const handleVerify = () => {
    setBusy(true);
    setIssueText(null);
    onVerify(rec.id, { verified: "YES" });
  };

  const handleIssueSubmit = () => {
    setBusy(true);
    onVerify(rec.id, { verified: "ISSUE", verificationIssue: issueText?.trim() });
    setIssueText(null);
  };

  return (
    <div className={`bg-(--color-surface) rounded-xl border border-(--color-border) border-l-4 overflow-hidden ${config ? config.border : "border-l-amber-300"}`}>

      {/* ── Status strip ───────────────────────────────────────────────────── */}
      {config && (
        <div className={`flex items-center justify-between px-5 py-2.5 ${config.strip}`}>
          <div className="flex items-center gap-2">
            {config.icon}
            <span className={`text-sm font-semibold ${config.labelCls}`}>
              {config.label}
            </span>
            {rec.verifiedBy && (
              <span className="text-xs text-(--color-muted) font-mono">
                by {rec.verifiedBy}
              </span>
            )}
          </div>
          {issueText === null && (
            <>
              {rec.verified === "ISSUE" && (
                <button
                  type="button"
                  onClick={() => onVerify(rec.id, { verified: "YES" })}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-700 font-semibold transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
                >
                  <RotateCcw size={13} />
                  Mark Resolved
                </button>
              )}
              {rec.verified === "YES" && (
                <button
                  type="button"
                  onClick={() => setIssueText("")}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 font-semibold transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
                >
                  <AlertCircle size={13} />
                  Add Issue
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Card body ──────────────────────────────────────────────────────── */}
      <div className="px-5 py-4">

        {/* Name + HH ID header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <p className="text-lg font-bold text-(--color-ink) leading-tight">
              {rec.granteeName || <span className="text-(--color-placeholder) font-normal">No name</span>}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="font-mono text-sm bg-(--color-subtle) text-(--color-muted) px-2.5 py-0.5 rounded-lg">
                {rec.hhId || "—"}
              </span>
              {rec.subjectOfChange && (
                <span className="text-xs text-(--color-muted) bg-(--color-subtle) px-2.5 py-0.5 rounded-lg">
                  {rec.subjectOfChange}
                </span>
              )}
            </div>
          </div>
          {isPendingReview && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shrink-0 whitespace-nowrap">
              Needs Review
            </span>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3 pb-4 border-b border-(--color-border)">
          {field("Update Type", rec.typeOfUpdate ? (UPDATE_TYPE_KEYMAP[rec.typeOfUpdate] ?? rec.typeOfUpdate) : null)}
          {field("Update Info", rec.updateInfo)}
          {field("Barangay", rec.barangay)}
          {field("LGU", rec.lgu)}
          {field("Date", rec.date || rec.createdAt ? formatDate(rec.date || rec.createdAt) : null)}
          {field("Encoded By", rec.encodedBy ? <span className="font-mono">{rec.encodedBy}</span> : null)}
        </div>

        {/* Encoder issue note */}
        {rec.issue && (
          <div className="mt-3 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">Encoder Issue</p>
              <p className="text-sm text-amber-700 leading-snug">{rec.issue}</p>
            </div>
          </div>
        )}

        {/* Verification issue note */}
        {rec.verificationIssue && (
          <div className="mt-3 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-0.5">Verification Issue</p>
              <p className="text-sm text-red-600 leading-snug">{rec.verificationIssue}</p>
            </div>
          </div>
        )}

        {/* Issue textarea */}
        {issueText !== null && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-(--color-ink)">Describe the verification issue:</p>
            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="e.g. Missing HH ID, incorrect grantee name, duplicate entry…"
              rows={3}
              autoFocus
              className="w-full text-sm border-2 border-red-200 rounded-xl px-4 py-3 text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleIssueSubmit}
                disabled={loading}
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60 border-none shadow-sm"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <AlertCircle size={14} />}
                Submit Issue
              </button>
              <button
                type="button"
                onClick={() => setIssueText(null)}
                className="text-sm font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Action buttons ─────────────────────────────────────────────── */}
        {isPendingReview && issueText === null && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-sm shadow-emerald-200"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Verified
            </button>
            <button
              type="button"
              onClick={() => setIssueText("")}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-red-500 text-sm font-bold hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-200 hover:border-red-300"
            >
              <AlertCircle size={16} />
              Flag Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
