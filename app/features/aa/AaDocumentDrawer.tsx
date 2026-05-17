import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { X, Loader2, Edit2, Check, AlertCircle } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"
import AaRemarkTimeline from "./AaRemarkTimeline"
import AaAddRemarkForm from "./AaAddRemarkForm"
import AaMonthlyGrid from "./AaMonthlyGrid"
import { getAaModuleLabels } from "./aaModuleLabels"
import { AA_MONTHLY_CONFIGS } from "./aaMonthlyConfig"
import type { AaDocument, AaRemark } from "~/types/aaTypes"

interface Props {
  moduleCode: string
  documentId: string
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

export default function AaDocumentDrawer({ moduleCode, documentId }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const currentYear = new Date().getFullYear()

  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    staffName: "",
    subject: "",
    operationNum: "",
    year: currentYear,
    dateCreated: "",
    dateSubmittedJnt: "",
    oo8Level: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  // Optimistic remarks (real + temp)
  const [optimisticRemarks, setOptimisticRemarks] = useState<AaRemark[] | null>(null)

  const { data, isLoading, isError } = useQuery<AaDocument>({
    queryKey: ["aa-document", documentId],
    queryFn: () => APIFETCH.get<AaDocument>(`/aa-documents/${documentId}`).then((r) => r.data),
    enabled: !!documentId,
  })

  // Sync edit form when data loads
  useEffect(() => {
    if (data) {
      setEditValues({
        staffName: data.staffName,
        subject: data.subject,
        operationNum: data.operationNum ?? "",
        year: data.year,
        dateCreated: new Date(data.dateCreated).toISOString().slice(0, 10),
        dateSubmittedJnt: data.dateSubmittedJnt
          ? new Date(data.dateSubmittedJnt).toISOString().slice(0, 10)
          : "",
        oo8Level: data.oo8Level ?? "",
      })
      setOptimisticRemarks(null) // reset optimistic state on fresh data
    }
  }, [data])

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(`/aa/${moduleCode}`, { replace: true })
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [moduleCode, navigate])

  const handleClose = () => navigate(`/aa/${moduleCode}`, { replace: true })

  const handleSaveEdit = async () => {
    setIsSaving(true)
    try {
      await APIFETCH.patch(`/aa-documents/${documentId}`, editValues)
      show("Document updated.", "success")
      queryClient.invalidateQueries({ queryKey: ["aa-document", documentId] })
      queryClient.invalidateQueries({ queryKey: ["aa-documents", moduleCode] })
      setIsEditing(false)
    } catch {
      show("Failed to update document. Please try again.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleOptimisticAdd = useCallback(
    (remark: AaRemark) => {
      setOptimisticRemarks((prev) => [...(prev ?? data?.remarks ?? []), remark])
    },
    [data?.remarks]
  )

  const handleRollback = useCallback((tempId: string) => {
    setOptimisticRemarks((prev) => (prev ?? []).filter((r) => r.id !== tempId))
  }, [])

  const displayedRemarks = optimisticRemarks ?? data?.remarks ?? []
  const labels = getAaModuleLabels(moduleCode, data?.module)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleClose()
          }
        }}
        role="button"
        tabIndex={0}
      />

      {/* Drawer panel — wider for monthly modules to fit the month grid */}
      <aside
        className={`fixed right-0 top-0 h-full w-full z-40 bg-(--color-surface) border-l border-(--color-border) shadow-2xl flex flex-col ${moduleCode in AA_MONTHLY_CONFIGS ? "max-w-2xl" : "max-w-md"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border) shrink-0">
          {isLoading ? (
            <div className="flex items-center gap-2 text-(--color-muted)">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[13px]">Loading…</span>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">
                {moduleCode}
              </p>
              <h2 className="text-[16px] font-semibold text-(--color-ink)">{data?.trackingNo}</h2>
            </div>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-subtle) transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {isError && (
            <div className="flex items-center gap-3 text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={14} />
              <span className="text-[13px]">Could not load document.</span>
            </div>
          )}

          {data && (
            <>
              {/* Document fields */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
                    Details
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Edit2 size={11} />
                      Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-[11px] text-(--color-muted) hover:text-(--color-ink)"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <Check size={11} />
                        )}
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>{labels.staff}</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={editValues.staffName}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, staffName: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>{labels.subject}</label>
                      <textarea
                        rows={3}
                        className={inputCls + " resize-none"}
                        value={editValues.subject}
                        onChange={(e) => setEditValues((v) => ({ ...v, subject: e.target.value }))}
                      />
                    </div>
                    <div>
                      <p className={labelCls}>Year</p>
                      <input
                        type="number"
                        min={2000}
                        max={2100}
                        className={inputCls}
                        value={editValues.year}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, year: Number(e.target.value) }))
                        }
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label htmlFor="doc-oo-number" className={labelCls}>
                          OO Number
                        </label>
                        <input
                          id="doc-oo-number"
                          type="text"
                          className={inputCls}
                          placeholder="e.g. OO-2026-001"
                          value={editValues.operationNum}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, operationNum: e.target.value }))
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <label className={labelCls}>{labels.date}</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={editValues.dateCreated}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, dateCreated: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="drawer-date-submitted-jnt" className={labelCls}>
                        Date Submitted to JNT
                      </label>
                      <input
                        id="drawer-date-submitted-jnt"
                        type="date"
                        className={inputCls}
                        value={editValues.dateSubmittedJnt}
                        onChange={(e) =>
                          setEditValues((v) => ({ ...v, dateSubmittedJnt: e.target.value }))
                        }
                      />
                    </div>
                    {moduleCode === "GRS" && (
                      <div>
                        <label htmlFor="drawer-oo8-level" className={labelCls}>
                          OO8 Level
                        </label>
                        <input
                          id="drawer-oo8-level"
                          type="text"
                          className={inputCls}
                          placeholder="e.g. Level 1"
                          value={editValues.oo8Level}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, oo8Level: e.target.value }))
                          }
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <dl className="space-y-2 text-[13px]">
                    <div className="flex gap-2">
                      <dt className="text-(--color-muted) shrink-0 w-24">{labels.staff}</dt>
                      <dd className="text-(--color-ink) font-medium">{data.staffName}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-(--color-muted) shrink-0 w-24">Year</dt>
                      <dd className="font-mono text-[12px] text-(--color-ink) font-semibold">
                        {data.year}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-(--color-muted) shrink-0 w-24">OO Number</dt>
                      <dd className="font-mono text-[12px] text-(--color-ink)">
                        {data.operationNum ?? (
                          <span className="text-(--color-muted) italic">—</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-(--color-muted) shrink-0 w-24">{labels.date}</dt>
                      <dd className="text-(--color-ink)">{formatDate(data.dateCreated)}</dd>
                    </div>
                    {data.dateSubmittedJnt && (
                      <div className="flex gap-2">
                        <dt className="text-(--color-muted) shrink-0 w-24">Subm. to JNT</dt>
                        <dd className="text-(--color-ink)">{formatDate(data.dateSubmittedJnt)}</dd>
                      </div>
                    )}
                    {moduleCode === "GRS" && (
                      <div className="flex gap-2">
                        <dt className="text-(--color-muted) shrink-0 w-24">OO8 Level</dt>
                        <dd className="text-(--color-ink) font-medium">
                          {data.oo8Level ?? <span className="text-(--color-muted) italic">—</span>}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-(--color-muted) mb-1">{labels.subject}</dt>
                      <dd className="text-(--color-ink) leading-relaxed">{data.subject}</dd>
                    </div>
                  </dl>
                )}
              </section>

              {/* Remarks — monthly modules get month grid, all others get timeline + add form */}
              <section className="space-y-4">
                {moduleCode in AA_MONTHLY_CONFIGS ? (
                  <div className="border-t border-(--color-border) pt-4">
                    <AaMonthlyGrid documentId={documentId} moduleCode={moduleCode} />
                  </div>
                ) : (
                  <>
                    <div className="border-t border-(--color-border) pt-4">
                      <AaRemarkTimeline remarks={displayedRemarks} />
                    </div>

                    <div className="border-t border-(--color-border) pt-4">
                      <h3 className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider mb-3">
                        Add Remark
                      </h3>
                      <AaAddRemarkForm
                        documentId={documentId}
                        moduleCode={moduleCode}
                        onOptimisticAdd={handleOptimisticAdd}
                        onRollback={handleRollback}
                      />
                    </div>
                  </>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
