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
    icon: <CheckCircle size={13} className="text-emerald-500" />,
  },
  ISSUE: {
    strip: "bg-red-50 border-b border-red-100",
    label: "Issue Flagged",
    labelCls: "text-red-500",
    border: "border-l-red-400",
    icon: <AlertTriangle size={13} className="text-red-400" />,
  },
} as const;

export function RecordCard({ rec, onVerify, isMutating }: Props) {
  const [issueText, setIssueText] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Uses rec.verified ("YES" | "ISSUE" | "NO") — not rec.remarks
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
    <div
      className={`bg-(--color-surface) rounded-xl border border-(--color-border) border-l-4 overflow-hidden ${config ? config.border : "border-l-amber-300"}`}
    >
      {/* ── Status strip ─────────────────────────────────────────────────── */}
      {config && (
        <div className={`flex items-center justify-between px-4 py-2 ${config.strip}`}>
          <div className="flex items-center gap-1.5">
            {config.icon}
            <span className={`text-[11px] font-semibold uppercase tracking-wide ${config.labelCls}`}>
              {config.label}
            </span>
            {rec.verifiedBy && (
              <span className="text-[10px] text-[#b8b8b0] font-mono">
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
                  className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-700 font-medium transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
                >
                  <RotateCcw size={10} />
                  Resolved
                </button>
              )}
              {rec.verified === "YES" && (
                <button
                  type="button"
                  onClick={() => setIssueText("")}
                  disabled={loading}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 font-medium transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
                >
                  <AlertCircle size={10} />
                  Add Issue
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="px-4 py-3.5">

        {/* Name + HH ID */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-(--color-ink) leading-snug">
              {rec.granteeName || <span className="text-(--color-placeholder)">No name</span>}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-mono text-[12px] bg-(--color-subtle) text-[#6a6a60] px-2 py-0.5 rounded">
                {rec.hhId || "—"}
              </span>
              {rec.subjectOfChange && (
                <span className="text-[11px] text-(--color-muted) bg-(--color-subtle) px-2 py-0.5 rounded">
                  {rec.subjectOfChange}
                </span>
              )}
            </div>
          </div>
          {isPendingReview && (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 shrink-0 whitespace-nowrap">
              Needs Review
            </span>
          )}
        </div>

        {/* Details grid */}
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-1">
          {rec.typeOfUpdate && (
            <div>
              <p className="text-[9px] text-[#b8b8b0] uppercase tracking-wider font-semibold">Update Type</p>
              <p className="text-[12px] text-(--color-ink) mt-0.5">
                {UPDATE_TYPE_KEYMAP[rec.typeOfUpdate] ?? rec.typeOfUpdate}
              </p>
            </div>
          )}
          {rec.updateInfo && (
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[9px] text-[#b8b8b0] uppercase tracking-wider font-semibold">Update Info</p>
              <p className="text-[12px] text-(--color-ink) mt-0.5">{rec.updateInfo}</p>
            </div>
          )}
          {rec.barangay && (
            <div>
              <p className="text-[9px] text-[#b8b8b0] uppercase tracking-wider font-semibold">Barangay</p>
              <p className="text-[12px] text-(--color-ink) mt-0.5">{rec.barangay}</p>
            </div>
          )}
          {rec.lgu && (
            <div>
              <p className="text-[9px] text-[#b8b8b0] uppercase tracking-wider font-semibold">LGU</p>
              <p className="text-[12px] text-(--color-ink) mt-0.5">{rec.lgu}</p>
            </div>
          )}
          {(rec.date || rec.createdAt) && (
            <div>
              <p className="text-[9px] text-[#b8b8b0] uppercase tracking-wider font-semibold">Date</p>
              <p className="text-[12px] text-(--color-ink) mt-0.5">{formatDate(rec.date || rec.createdAt)}</p>
            </div>
          )}
          {rec.encodedBy && (
            <div>
              <p className="text-[9px] text-[#b8b8b0] uppercase tracking-wider font-semibold">Encoded By</p>
              <p className="text-[12px] text-(--color-ink) font-mono mt-0.5">{rec.encodedBy}</p>
            </div>
          )}
        </div>

        {/* Encoding issue note (from encoder) */}
        {rec.issue && (
          <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
            <AlertCircle size={13} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-0.5">Encoder Issue</p>
              <p className="text-[12px] text-amber-700 leading-snug">{rec.issue}</p>
            </div>
          </div>
        )}

        {/* Verification issue note */}
        {rec.verificationIssue && (
          <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
            <AlertTriangle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-0.5">Verification Issue</p>
              <p className="text-[12px] text-red-600 leading-snug">{rec.verificationIssue}</p>
            </div>
          </div>
        )}

        {/* Issue textarea */}
        {issueText !== null && (
          <div className="mt-3 space-y-2">
            <p className="text-[11px] font-semibold text-[#6a6a60]">Describe the verification issue:</p>
            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder="e.g. Missing HH ID, incorrect grantee name, duplicate entry…"
              rows={3}
              autoFocus
              className="w-full text-[13px] border border-red-200 rounded-lg px-3 py-2.5 text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleIssueSubmit}
                disabled={loading}
                className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60 border-none shadow-sm"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <AlertCircle size={13} />}
                Submit Issue
              </button>
              <button
                type="button"
                onClick={() => setIssueText(null)}
                className="text-[13px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action buttons (pending only) */}
        {isPendingReview && issueText === null && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-white text-[13px] font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-sm"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Verified
            </button>
            <button
              type="button"
              onClick={() => setIssueText("")}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-(--color-surface) text-red-500 text-[13px] font-semibold hover:bg-red-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
            >
              <AlertCircle size={14} />
              Flag Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
