import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";
import { ProgressCardSkeleton, RecordCardSkeleton } from "~/components/Skeleton";
import APIFETCH from "~/lib/axios/axiosConfig";
import type { BusRecord } from "~/types/busTypes";
import { useToastStore } from "~/lib/zustand/ToastStore";
import { RecordCard } from "./components/RecordCard";
import { ProgressCard } from "./components/ProgressCard";
import { FilterTabs } from "./components/FilterTabs";
import type { DetailTab, VerifyPayload } from "./components/types";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "pending",  label: "Pending"  },
  { id: "verified", label: "Verified" },
  { id: "issue",    label: "Issues"   },
  { id: "all",      label: "All"      },
];

export default function BusVerificationDetail({ bdm }: { bdm: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const [activeTab, setActiveTab] = useState<DetailTab>("pending");

  const { data: records = [], isLoading } = useQuery<BusRecord[]>({
    queryKey: ["busAll"],
    queryFn: async () => {
      const res = await APIFETCH.get("/bus/verification");
      return res.data;
    },
  });

  const bdmRecords = useMemo(
    () =>
      records
        .filter((r) => (r.drn?.trim() || "(No DRN)") === bdm)
        .sort((a, b) => {
          const aReviewed = a.verified === "YES" || a.verified === "ISSUE" ? 1 : 0;
          const bReviewed = b.verified === "YES" || b.verified === "ISSUE" ? 1 : 0;
          if (aReviewed !== bReviewed) return aReviewed - bReviewed;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
    [records, bdm],
  );

  const counts: Record<DetailTab, number> = useMemo(
    () => ({
      all:      bdmRecords.length,
      pending:  bdmRecords.filter((r) => r.verified !== "YES" && r.verified !== "ISSUE").length,
      verified: bdmRecords.filter((r) => r.verified === "YES").length,
      issue:    bdmRecords.filter((r) => r.verified === "ISSUE").length,
    }),
    [bdmRecords],
  );

  const tabRecords = useMemo(() => {
    switch (activeTab) {
      case "pending":  return bdmRecords.filter((r) => r.verified !== "YES" && r.verified !== "ISSUE");
      case "verified": return bdmRecords.filter((r) => r.verified === "YES");
      case "issue":    return bdmRecords.filter((r) => r.verified === "ISSUE");
      default:         return bdmRecords;
    }
  }, [bdmRecords, activeTab]);

  const { mutate: verify, isPending: isMutating } = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: VerifyPayload }) => {
      const res = await APIFETCH.patch(`/bus/verify/${id}`, payload);
      return res.data;
    },
    onSuccess: (_, { payload }) => {
      queryClient.invalidateQueries({ queryKey: ["busAll"] });
      show(
        payload.verified === "YES" ? "Marked as Verified" : "Marked as Issue",
        payload.verified === "YES" ? "success" : "error",
      );
    },
    onError: () => show("Failed to update status", "error"),
  });

  if (isLoading) {
    return (
      <main className="bg-(--color-bg) min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse bg-gray-200 rounded-xl mb-6" />
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <ProgressCardSkeleton />
            <div className="bg-white border border-gray-100 rounded-xl p-1.5 space-y-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <RecordCardSkeleton key={i} />)}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-(--color-bg) min-h-screen px-4 py-6 sm:px-6 lg:px-8">

      {/* ── Back + Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/verification/bus")}
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-(--color-surface) border border-(--color-border) hover:border-(--color-ink) hover:bg-(--color-subtle) text-sm font-semibold text-(--color-ink) rounded-xl transition-all cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back to BUS Verification
        </button>
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
          BDM Number
        </p>
        <h1 className="text-2xl font-bold text-(--color-ink) font-mono tracking-tight">
          {bdm}
        </h1>
      </div>

      {/* ── Two-column layout on large screens ───────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── Left panel: progress + tabs ──────────────────────────────────── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">
          <ProgressCard
            pending={counts.pending}
            verified={counts.verified}
            issue={counts.issue}
          />
          <FilterTabs
            tabs={TABS}
            active={activeTab}
            counts={counts}
            onChange={setActiveTab}
          />
          {activeTab === "pending" && counts.pending > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-amber-700 mb-0.5">
                {counts.pending} record{counts.pending !== 1 ? "s" : ""} to review
              </p>
              <p className="text-xs text-amber-600">
                Mark each as <strong>Verified</strong> or <strong>Flag Issue</strong>
              </p>
            </div>
          )}
        </div>

        {/* ── Right panel: records ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {tabRecords.length === 0 ? (
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-20 flex flex-col items-center gap-3">
              {activeTab === "pending" ? (
                <>
                  <CheckCircle size={32} className="text-emerald-400" />
                  <p className="text-base font-semibold text-emerald-500">All records reviewed!</p>
                  <p className="text-sm text-(--color-placeholder)">Nothing left to verify for this BDM</p>
                </>
              ) : (
                <>
                  <AlertCircle size={30} className="text-(--color-placeholder)" />
                  <p className="text-sm text-(--color-placeholder)">No records in this category</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tabRecords.map((rec) => (
                <RecordCard
                  key={rec.id}
                  rec={rec}
                  onVerify={(id, payload) => verify({ id, payload })}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
