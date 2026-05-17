import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { BusRecord, BusResponse } from "~/types/busTypes"
import { UPDATE_TYPE_KEYMAP } from "~/types/busTypes"
import { labelCls, inputCls } from "~/components/styleConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Opt, Req } from "~/components/LabelStyle"
import { useSelectedID } from "~/lib/zustand/selectedId"
import { BusFormSchema, type BusFormValues } from "~/lib/validation/schemas"

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

const EMPTY_FORM: BusFormValues = {
  lgu: "",
  barangay: "",
  hhId: "",
  granteeName: "",
  subjectOfChange: "",
  typeOfUpdate: "",
  updateInfo: "",
  remarks: "ENCODED",
  cl: "",
  issue: "",
  drn: "",
  note: "",
}

export default function BusForm() {
  const queryClient = useQueryClient()
  const busId = useSelectedID((s) => s.selectedIds.bus)
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId)
  const { show } = useToastStore()

  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const [bdmAvailable, setBdmAvailable] = useState(true)
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
    setError,
  } = useForm<BusFormValues>({
    resolver: zodResolver(BusFormSchema),
    defaultValues: EMPTY_FORM,
    mode: "onBlur",
  })

  const selectedLgu = watch("lgu")
  const selectedRemarks = watch("remarks")

  // ── Fetch selected record for edit ──────────────────────────────
  const { data } = useQuery({
    queryKey: ["SelectedBus", busId],
    queryFn: async () => {
      const res = await APIFETCH.get<BusRecord>(`/bus/records/${busId}`)
      return res.data ?? null
    },
    enabled: !!busId,
    retry: false,
  })

  // ── Fetch LGU list ──────────────────────────────────────────────
  const { data: lguList } = useQuery<LGU[]>({
    queryKey: ["LGU"],
    queryFn: () => APIFETCH.get<LGU[]>("/bus/lgu").then((r) => r.data),
  })

  const lguOptions: Option[] = lguList?.map((l) => ({ value: l.name, label: l.name })) ?? []

  // ── Cascade: update barangay options when LGU changes ───────────
  useEffect(() => {
    if (!lguList) return
    const found = lguList.find((l) => l.name === selectedLgu)
    const opts = found?.barangay.map((b) => ({ value: b.name, label: b.name })) ?? []
    setBarangayOptions(opts)
    setValue("barangay", "")
  }, [selectedLgu, lguList, setValue])

  // ── Populate form when editing an existing record ───────────────
  useEffect(() => {
    if (!data) return
    reset({
      lgu: data.lgu ?? "",
      barangay: data.barangay ?? "",
      hhId: data.hhId ?? "",
      granteeName: data.granteeName ?? "",
      subjectOfChange: data.subjectOfChange ?? "",
      typeOfUpdate: data.typeOfUpdate ?? "",
      updateInfo: data.updateInfo ?? "",
      remarks: (data.remarks as BusFormValues["remarks"]) ?? "ENCODED",
      cl: data.cl ?? "",
      issue: data.issue ?? "",
      drn: data.drn ?? "",
      note: data.note ?? "",
    })
    const hasDrn = !!(data.drn && data.drn.length > 0)
    setBdmAvailable(hasDrn)
    if (hasDrn) {
      const digits = (data.drn ?? "").replace("BDM-", "")
      checkDrn(digits)
    }
  }, [data, reset]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-set barangay after options load on edit ──────────────────
  useEffect(() => {
    if (!data || !barangayOptions.length) return
    setValue("barangay", data.barangay?.toString() ?? "")
  }, [barangayOptions, data, setValue])

  // ── Submit ──────────────────────────────────────────────────────
  const onSubmit = async (values: BusFormValues) => {
    const drnDigits = (values.drn ?? "").replace("BDM-", "").trim()
    if (bdmAvailable && !drnDigits) {
      setError("drn", { message: "DRN is required when BDM is available." })
      return
    }
    if (bdmAvailable && drnDigits) {
      if (drnStatus === "checking") {
        show("Please wait — still verifying the DRN.", "error")
        return
      }
      if (drnStatus !== "valid") {
        setError("drn", {
          message: "This DRN was not found in the AA tracking system. Please check the number.",
        })
        return
      }
    }
    try {
      const res = await APIFETCH.post<BusResponse>("/bus/upload", values)
      if (res.data.upload) {
        show(res.data.message, "success")
        queryClient.invalidateQueries({ queryKey: ["recentBus"] })
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
    setBdmAvailable(true)
    setDrnStatus("idle")
    clearSelectedId("bus")
  }

  const checkDrn = useCallback(
    (rawDigits: string) => {
      const full = `BDM-${rawDigits}`
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
      {/* Header */}
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          Fill in the form below
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
          Selected Item : {busId ?? "NONE"}
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 — Basic Info */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Basic Information
              </h3>
            </div>
            <div className="space-y-3.5">
              {/* LGU */}
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

              {/* Barangay */}
              <div>
                <label htmlFor="barangay" className={labelCls}>
                  Barangay <Req />
                </label>
                <select
                  id="barangay"
                  className={inputCls + (!selectedLgu ? " opacity-70 cursor-not-allowed" : "")}
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

              {/* HH ID */}
              <div>
                <label htmlFor="hhId" className={labelCls}>
                  HH ID Number <Req />
                </label>
                <input
                  type="text"
                  id="hhId"
                  className={inputCls}
                  placeholder="Enter HH ID"
                  maxLength={25}
                  {...register("hhId", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^0-9-]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.hhId?.message} />
              </div>

              {/* Grantee Name */}
              <div>
                <label htmlFor="granteeName" className={labelCls}>
                  Grantee Name <Req />
                </label>
                <input
                  type="text"
                  id="granteeName"
                  className={inputCls}
                  placeholder="Enter Name"
                  maxLength={40}
                  {...register("granteeName", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.granteeName?.message} />
              </div>

              {/* Subject of Change */}
              <div>
                <label htmlFor="subjectOfChange" className={labelCls}>
                  Subject of Change <Req />
                </label>
                <input
                  type="text"
                  id="subjectOfChange"
                  className={inputCls}
                  placeholder="Enter Subject"
                  maxLength={40}
                  {...register("subjectOfChange", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.subjectOfChange?.message} />
              </div>
            </div>
          </div>

          {/* Column 2 — Update Details */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Update Details
              </h3>
            </div>
            <div className="space-y-3.5">
              {/* Type of Update */}
              <div>
                <label htmlFor="typeOfUpdate" className={labelCls}>
                  Type of Update <Req />
                </label>
                <select id="typeOfUpdate" className={inputCls} {...register("typeOfUpdate")}>
                  <option value="">Select Type</option>
                  {Object.entries(UPDATE_TYPE_KEYMAP).map(([key, value]) => (
                    <option key={key} value={key}>
                      {key} - {value}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.typeOfUpdate?.message} />
              </div>

              {/* Update Info */}
              <div>
                <label htmlFor="updateInfo" className={labelCls}>
                  Update Info <Req />
                </label>
                <input
                  type="text"
                  id="updateInfo"
                  className={inputCls}
                  placeholder="Enter Update Info"
                  maxLength={50}
                  {...register("updateInfo", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.updateInfo?.message} />
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remarks" className={labelCls}>
                  REMARKS <Req />
                </label>
                <select id="remarks" className={inputCls} {...register("remarks")}>
                  <option value="">Select</option>
                  <option value="ENCODED">ENCODED</option>
                  <option value="ISSUE">ISSUE</option>
                  <option value="UPDATED">UPDATED</option>
                </select>
                <FieldError message={errors.remarks?.message} />
              </div>

              {/* City Link */}
              <div>
                <label htmlFor="cl" className={labelCls}>
                  Assigned City Link or SWA <Req />
                </label>
                <input
                  type="text"
                  id="cl"
                  className={inputCls}
                  placeholder="Enter City Link or SWA"
                  maxLength={50}
                  {...register("cl", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.cl?.message} />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className={labelCls}>
                  Date Accomplished <Req />
                </label>
                <input
                  type="date"
                  id="date"
                  readOnly
                  value={today}
                  className={inputCls + " cursor-default"}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Column 3 — Additional Info */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Additional Info
              </h3>
            </div>
            <div className="space-y-3.5">
              {/* Issue */}
              <div>
                <label htmlFor="issue" className={labelCls}>
                  Issues {selectedRemarks === "ISSUE" ? <Req /> : <Opt />}
                </label>
                <textarea
                  id="issue"
                  rows={2}
                  disabled={selectedRemarks !== "ISSUE"}
                  className={
                    inputCls +
                    " resize-none transition-opacity duration-200" +
                    (selectedRemarks !== "ISSUE" ? " opacity-50 cursor-not-allowed" : "")
                  }
                  placeholder={
                    selectedRemarks === "ISSUE"
                      ? "Enter issues..."
                      : "Select ISSUE in Remarks to enable"
                  }
                  maxLength={80}
                  {...register("issue", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z0-9. ]/g, "")
                    },
                  })}
                />
                <FieldError message={errors.issue?.message} />
              </div>

              {/* DRN */}
              <div
                className="rounded-lg border border-(--color-border) p-3 space-y-3 transition-colors duration-200"
                style={{
                  backgroundColor: bdmAvailable ? "var(--color-surface)" : "var(--color-subtle)",
                }}
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="drn" className={labelCls + " !mb-0"}>
                    DRN {bdmAvailable ? <Req /> : <Opt />}
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none group">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-(--color-muted) group-hover:text-(--color-ink) transition-colors">
                      BDM
                    </span>
                    <input
                      type="checkbox"
                      checked={bdmAvailable}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setBdmAvailable(checked)
                        if (!checked) setValue("drn", "")
                      }}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 rounded-full transition-colors duration-200 bg-gray-300 peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-(--color-ink)">
                      <div
                        className={
                          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 " +
                          (bdmAvailable ? "translate-x-4" : "translate-x-0")
                        }
                      />
                    </div>
                  </label>
                </div>

                <div
                  className="overflow-hidden transition-all duration-200 ease-in-out"
                  style={{
                    maxHeight: bdmAvailable ? "60px" : "0px",
                    opacity: bdmAvailable ? 1 : 0,
                  }}
                >
                  <div
                    className={`flex rounded-lg overflow-hidden border focus-within:ring-2 focus-within:border-transparent hover:border-(--color-border-hover) transition-colors bg-(--color-surface) ${
                      drnStatus === "valid"
                        ? "border-emerald-400 focus-within:ring-emerald-400"
                        : drnStatus === "invalid"
                          ? "border-red-400 focus-within:ring-red-400"
                          : "border-(--color-border) focus-within:ring-(--color-ink)"
                    }`}
                  >
                    <span className="px-3 flex items-center bg-(--color-subtle) text-(--color-muted) text-[13px] font-mono font-semibold border-r border-(--color-border) select-none shrink-0">
                      BDM-
                    </span>
                    <input
                      type="text"
                      id="drn"
                      disabled={!bdmAvailable}
                      className="flex-1 px-3 py-2 text-[13px] text-(--color-ink) bg-(--color-surface) focus:outline-none placeholder-(--color-placeholder)"
                      placeholder="0000"
                      maxLength={4}
                      value={drnValue.startsWith("BDM-") ? drnValue.slice(4) : drnValue}
                      onChange={(e) => {
                        const digits = e.target.value
                        setValue("drn", "BDM-" + digits)
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

                {!bdmAvailable && (
                  <p className="text-[11px] text-(--color-muted) italic">
                    No BDM document — DRN will be skipped.
                  </p>
                )}
                <FieldError message={errors.drn?.message} />
              </div>

              {/* Note */}
              <div>
                <label htmlFor="note" className={labelCls}>
                  Note <Opt />
                </label>
                <textarea
                  id="note"
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Enter note..."
                  maxLength={80}
                  {...register("note", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z0-9. ]/g, "")
                    },
                  })}
                />
              </div>

              {/* Submit / Reset */}
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
