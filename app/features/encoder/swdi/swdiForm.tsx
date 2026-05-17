import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { SwdiRecord, SwdiResponse } from "~/types/swdiTypes"
import { labelCls, inputCls } from "~/components/styleConfig"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Req } from "~/components/LabelStyle"
import { useSelectedID } from "~/lib/zustand/selectedId"
import { SwdiFormSchema, type SwdiFormValues } from "~/lib/validation/schemas"

interface LGU {
  id: string | number
  name: string
  barangay: { id: string | number; name: string }[]
}

interface Option {
  value: string
  label: string
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-[11px] text-red-500">{message}</p>
}

function computeSwdiLevel(score: string): string {
  const num = parseFloat(score)
  if (!score || isNaN(num)) return "Not Assessed"
  if (num >= 1.0 && num <= 1.83) return "Survival - Level 1"
  if (num >= 1.84 && num <= 2.83) return "Subsistence - Level 2"
  if (num >= 2.84 && num <= 3.0) return "Self-Sufficient - Level 3"
  return "Not Assessed"
}

const today = new Date().toISOString().split("T")[0]

const EMPTY_FORM: SwdiFormValues = {
  hhId: "",
  lgu: "",
  barangay: "",
  grantee: "",
  swdiScore: "",
  swdiLevel: "",
  remarks: "ENCODED",
  issue: "",
  cl: "",
  drn: "",
  note: "",
  date: today,
}

export default function SWDIForm() {
  const queryClient = useQueryClient()
  const swdiId = useSelectedID((s) => s.selectedIds.swdi)
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId)
  const { show } = useToastStore()

  const [barangayOptions, setBarangayOptions] = useState<Option[]>([])
  const [drnStatus, setDrnStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle")
  const [drnTimer, setDrnTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<SwdiFormValues>({
    resolver: zodResolver(SwdiFormSchema),
    defaultValues: EMPTY_FORM,
    mode: "onBlur",
  })

  const selectedLgu = watch("lgu")
  const selectedRemarks = watch("remarks")
  const swdiScoreValue = watch("swdiScore")

  // ── Fetch selected record ────────────────────────────────────
  const { data } = useQuery({
    queryKey: ["SelectedSwdi", swdiId],
    queryFn: () => APIFETCH.get<SwdiRecord>(`/swdi/record/${swdiId}`).then((r) => r.data),
    enabled: !!swdiId,
  })

  // ── Fetch LGU list ───────────────────────────────────────────
  const { data: lguList } = useQuery<LGU[]>({
    queryKey: ["LGU"],
    queryFn: () => APIFETCH.get<LGU[]>("/bus/lgu").then((r) => r.data),
  })

  const lguOptions: Option[] =
    lguList?.map((l) => ({ value: l.id.toString(), label: l.name })) ?? []

  // ── Cascade: barangay options when LGU changes ───────────────
  useEffect(() => {
    if (!lguList) return
    const found = lguList.find((l) => l.id.toString() === selectedLgu)
    const opts = found?.barangay.map((b) => ({ value: b.id.toString(), label: b.name })) ?? []
    setBarangayOptions(opts)
    setValue("barangay", "")
  }, [selectedLgu, lguList, setValue])

  // ── Auto-compute SWDI level from score ───────────────────────
  useEffect(() => {
    setValue("swdiLevel", computeSwdiLevel(swdiScoreValue))
  }, [swdiScoreValue, setValue])

  // ── Populate form on edit ────────────────────────────────────
  useEffect(() => {
    if (!data) return
    reset({
      hhId: data.hhId ?? "",
      lgu: data.lgu ?? "",
      barangay: data.barangay ?? "",
      grantee: data.grantee ?? "",
      swdiScore: String(data.swdiScore),
      swdiLevel: data.swdiLevel ?? "",
      remarks: (data.remarks as SwdiFormValues["remarks"]) ?? "ENCODED",
      issue: data.issue ?? "",
      cl: data.cl ?? "",
      drn: data.drn ?? "",
      note: data.note ?? "",
      date: today,
    })
    if (data.drn && data.drn.trim()) {
      const digits = data.drn.replace("M&E-", "")
      checkDrn(digits)
    }
  }, [data, reset]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-set barangay after options load on edit ───────────────
  useEffect(() => {
    if (!data || !barangayOptions.length) return
    setValue("barangay", data.barangay?.toString() ?? "")
  }, [barangayOptions, data, setValue])

  // ── Submit ───────────────────────────────────────────────────
  const onSubmit = async (values: SwdiFormValues) => {
    const drnDigits = (values.drn ?? "").replace("M&E-", "").trim()
    if (drnDigits) {
      if (drnStatus === "checking") {
        show("Please wait — still verifying the DRN.", "error")
        return
      }
      if (drnStatus !== "valid") {
        show(
          "This DRN was not found in the AA tracking system. Please check the number and try again.",
          "error"
        )
        return
      }
    }
    const payload = { ...values, swdiScore: parseFloat(values.swdiScore) || 0 }
    try {
      const res = await APIFETCH.post<SwdiResponse>("/swdi/upload", payload)
      if (res.data.upload) {
        show(res.data.message, "success")
        queryClient.invalidateQueries({ queryKey: ["recentSwdi"] })
        queryClient.invalidateQueries({ queryKey: ["allDocuments"] })
        handleReset()
      } else {
        show(res.data.message, "error")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message
      show(
        typeof msg === "string" ? msg : "An unexpected error occurred. Please try again.",
        "error"
      )
    }
  }

  const handleReset = () => {
    reset(EMPTY_FORM)
    setDrnStatus("idle")
    clearSelectedId("swdi")
  }

  const checkDrn = useCallback(
    (rawDigits: string) => {
      const full = `M&E-${rawDigits}`
      if (!rawDigits.trim()) {
        setDrnStatus("idle")
        return
      }
      setDrnStatus("checking")
      if (drnTimer) clearTimeout(drnTimer)
      const t = setTimeout(async () => {
        try {
          const res = await APIFETCH.get<{ exists: boolean }>("/aa-documents/check-drn", {
            params: { trackingNo: full },
          })
          setDrnStatus(res.data.exists ? "valid" : "invalid")
        } catch {
          setDrnStatus("idle")
        }
      }, 500)
      setDrnTimer(t)
    },
    [drnTimer]
  )

  const drnValue = watch("drn") ?? ""

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          Fill in the form below
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
          Selected Item : {swdiId ?? "NONE"}
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 — Household Information */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Household Information
              </h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="lgu" className={labelCls}>
                  LGU <Req />
                </label>
                <select id="lgu" className={inputCls} {...register("lgu")}>
                  <option value="">--Select LGU--</option>
                  {lguOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.lgu?.message} />
              </div>

              <div>
                <label htmlFor="barangay" className={labelCls}>
                  Barangay <Req />
                </label>
                <select
                  id="barangay"
                  className={inputCls + (!selectedLgu ? " opacity-80 cursor-not-allowed" : "")}
                  disabled={!selectedLgu}
                  {...register("barangay")}
                >
                  <option value="">--Select Barangay--</option>
                  {barangayOptions.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.barangay?.message} />
              </div>

              <div>
                <label htmlFor="hhId" className={labelCls}>
                  HH ID <Req />
                </label>
                <input
                  type="text"
                  id="hhId"
                  className={inputCls}
                  placeholder="Enter HH ID"
                  {...register("hhId")}
                />
                <FieldError message={errors.hhId?.message} />
              </div>

              <div>
                <label htmlFor="grantee" className={labelCls}>
                  Grantee <Req />
                </label>
                <input
                  type="text"
                  id="grantee"
                  className={inputCls}
                  placeholder="Enter Grantee Name"
                  {...register("grantee", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.grantee?.message} />
              </div>
            </div>
          </div>

          {/* Column 2 — Assessment Details */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Assessment Details
              </h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="remarks" className={labelCls}>
                  Remarks <Req />
                </label>
                <select id="remarks" className={inputCls} {...register("remarks")}>
                  <option value="">Select</option>
                  <option value="ENCODED">ENCODED</option>
                  <option value="ISSUE">ISSUE</option>
                  <option value="UPDATED">UPDATED</option>
                </select>
                <FieldError message={errors.remarks?.message} />
              </div>

              <div>
                <label htmlFor="swdiScore" className={labelCls}>
                  SWDI Score <Req />
                </label>
                <input
                  type="text"
                  id="swdiScore"
                  className={
                    inputCls +
                    " appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  }
                  placeholder="Enter SWDI Score (1–3)"
                  {...register("swdiScore", {
                    onChange: (e) => {
                      const raw = e.target.value
                      if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) {
                        e.target.value = raw.slice(0, -1)
                      }
                      const num = parseFloat(e.target.value)
                      if (!isNaN(num) && (num < 1 || num > 3)) {
                        e.target.value = raw.slice(0, -1)
                      }
                    },
                  })}
                />
                <FieldError message={errors.swdiScore?.message} />
              </div>

              <div>
                <label htmlFor="swdi-level" className={labelCls}>
                  SWDI Level
                </label>
                <input
                  id="swdi-level"
                  type="text"
                  disabled
                  value={computeSwdiLevel(swdiScoreValue)}
                  className={inputCls + " bg-(--color-bg) cursor-default text-(--color-muted)"}
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="date" className={labelCls}>
                  Date <Req />
                </label>
                <input
                  type="date"
                  id="date"
                  disabled
                  value={today}
                  className={inputCls + " bg-(--color-bg) cursor-default"}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Column 3 — Issues & Actions */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Issues & Actions
              </h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="issue" className={labelCls}>
                  Issue {selectedRemarks === "ISSUE" ? <Req /> : null}
                </label>
                <textarea
                  id="issue"
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Describe any issues..."
                  {...register("issue")}
                />
                <FieldError message={errors.issue?.message} />
              </div>

              <div>
                <label htmlFor="cl" className={labelCls}>
                  Assigned City Link or SWA <Req />
                </label>
                <input
                  type="text"
                  id="cl"
                  className={inputCls}
                  placeholder="Enter Facilitator"
                  {...register("cl")}
                />
                <FieldError message={errors.cl?.message} />
              </div>

              <div>
                <label htmlFor="swdi-drn" className={labelCls}>
                  DRN
                </label>
                <div
                  className={`flex rounded-lg overflow-hidden border focus-within:ring-2 focus-within:border-transparent hover:border-(--color-border-hover) transition-colors ${
                    drnStatus === "valid"
                      ? "border-emerald-400 focus-within:ring-emerald-400"
                      : drnStatus === "invalid"
                        ? "border-red-400 focus-within:ring-red-400"
                        : "border-(--color-border) focus-within:ring-(--color-ink)"
                  }`}
                >
                  <span className="px-3 flex items-center bg-(--color-subtle) text-(--color-muted) text-[13px] font-mono font-semibold border-r border-(--color-border) select-none shrink-0">
                    M&E-
                  </span>
                  <input
                    id="swdi-drn"
                    type="text"
                    className="flex-1 px-3 py-2 text-[13px] text-(--color-ink) bg-(--color-surface) focus:outline-none placeholder-(--color-placeholder)"
                    placeholder="0000"
                    value={drnValue.startsWith("M&E-") ? drnValue.slice(4) : drnValue}
                    onChange={(e) => {
                      const digits = e.target.value
                      setValue("drn", "M&E-" + digits)
                      checkDrn(digits)
                    }}
                  />
                  <span className="px-3 flex items-center shrink-0">
                    {drnStatus === "checking" && (
                      <Loader2 size={14} className="animate-spin text-(--color-muted)" />
                    )}
                    {drnStatus === "valid" && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                    {drnStatus === "invalid" && <XCircle size={14} className="text-red-500" />}
                  </span>
                </div>
                {drnStatus === "invalid" && (
                  <p className="mt-1 text-[11px] text-red-500">
                    This DRN was not found in the AA tracking system.
                  </p>
                )}
                {drnStatus === "valid" && (
                  <p className="mt-1 text-[11px] text-emerald-600">DRN found in AA tracking.</p>
                )}
              </div>

              <div>
                <label htmlFor="swdi-note" className={labelCls}>
                  Note
                </label>
                <textarea
                  id="swdi-note"
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Enter note..."
                  {...register("note")}
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Submitting…" : "Submit →"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-transparent text-(--color-ink) text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
