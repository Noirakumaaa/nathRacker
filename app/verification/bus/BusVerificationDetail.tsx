import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Loader2, CheckCircle, AlertCircle, ChevronLeft } from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type { BusRecord } from "~/types/busTypes";
import { useToastStore } from "lib/zustand/ToastStore";
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

  // ── Data ───────────────────────────────────────────────────────────────────
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

  // ── Mutation ───────────────────────────────────────────────────────────────
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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="p-6 bg-(--color-bg) min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-(--color-muted)">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[13px]">Loading records…</span>
        </div>
      </main>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="p-6 bg-(--color-bg) min-h-screen font-sans antialiased">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/verification/bus")}
            className="flex items-center gap-1 text-[12px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none mb-2"
          >
            <ChevronLeft size={13} />
            BUS Verification
          </button>
          <p className="text-[11px] text-[#b8b8b0] uppercase tracking-wider font-semibold mb-0.5">
            BDM Number
          </p>
          <h1 className="text-[24px] font-bold text-(--color-ink) font-mono tracking-tight">
            {bdm}
          </h1>
        </div>

        {/* Progress */}
        <ProgressCard
          pending={counts.pending}
          verified={counts.verified}
          issue={counts.issue}
        />

        {/* Tabs */}
        <FilterTabs
          tabs={TABS}
          active={activeTab}
          counts={counts}
          onChange={setActiveTab}
        />

        {/* Records */}
        {tabRecords.length === 0 ? (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-16 flex flex-col items-center gap-2">
            {activeTab === "pending" ? (
              <>
                <CheckCircle size={28} className="text-emerald-400" />
                <p className="text-[14px] font-semibold text-emerald-500">All records reviewed!</p>
                <p className="text-[12px] text-(--color-placeholder)">Nothing left to verify for this BDM</p>
              </>
            ) : (
              <>
                <AlertCircle size={26} className="text-(--color-placeholder)" />
                <p className="text-[13px] text-(--color-placeholder)">No records in this category</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeTab === "pending" && (
              <p className="text-[12px] text-(--color-muted) px-1">
                {counts.pending} record{counts.pending !== 1 ? "s" : ""} need review — mark each as{" "}
                <strong>Verified</strong> or <strong>Flag Issue</strong>
              </p>
            )}
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
    </main>
  );
}
