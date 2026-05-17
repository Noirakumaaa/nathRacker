import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"
import { useQuery } from "@tanstack/react-query"
import { getAaModuleLabels } from "./aaModuleLabels"
import type { AaDocument, AaDocumentModule } from "~/types/aaTypes"

const schema = z.object({
  staffName: z.string().min(1, "Staff name is required"),
  subject: z.string().min(1, "Subject is required"),
  operationNum: z.string().optional(),
  year: z.number().int().min(2000).max(2100),
  dateCreated: z.string().min(1, "Date is required"),
})

type FormValues = z.infer<typeof schema>

interface Props {
  moduleCode: string
  defaultYear?: number
  onClose: () => void
}

export default function AaNewDocumentModal({ moduleCode, defaultYear, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const { data: moduleMeta } = useQuery<AaDocumentModule>({
    queryKey: ["aa-module", moduleCode],
    queryFn: () => APIFETCH.get<AaDocumentModule>(`/aa-modules/${moduleCode}`).then((r) => r.data),
    enabled: !!moduleCode,
    staleTime: 60_000,
  })

  const labels = getAaModuleLabels(moduleCode, moduleMeta)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: defaultYear ?? new Date().getFullYear(),
      dateCreated: new Date().toISOString().slice(0, 10),
    },
  })

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const onSubmit = async (values: FormValues) => {
    try {
      await APIFETCH.post<AaDocument>(`/aa-modules/${moduleCode}/documents`, values)
      show("Document created successfully.", "success")
      queryClient.invalidateQueries({ queryKey: ["aa-documents", moduleCode] })
      onClose()
    } catch {
      show("Failed to create document. Please try again.", "error")
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
        if ((e.key === "Enter" || e.key === " ") && e.target === overlayRef.current) {
          e.preventDefault()
          onClose()
        }
      }}
      role="button"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
          <div>
            <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">
              {moduleCode}
            </p>
            <h2 className="text-[15px] font-semibold text-(--color-ink)">{labels.moduleName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-subtle) transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className={labelCls}>
              {labels.staff} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. MARY GRACE P. MARTIN"
              {...register("staffName")}
            />
            {errors.staffName && (
              <p className="mt-1 text-[11px] text-red-500">{errors.staffName.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              {labels.subject} <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              className={inputCls + " resize-none"}
              placeholder="Describe the document or request…"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="mt-1 text-[11px] text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="new-doc-year" className={labelCls}>
              Year <span className="text-red-500">*</span>
            </label>
            <input
              id="new-doc-year"
              type="number"
              min={2000}
              max={2100}
              className={inputCls}
              {...register("year", { valueAsNumber: true })}
            />
            {errors.year && <p className="mt-1 text-[11px] text-red-500">{errors.year.message}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="new-doc-oo-number" className={labelCls}>
                OO Number <span className="text-(--color-muted)">(optional)</span>
              </label>
              <input
                id="new-doc-oo-number"
                type="text"
                className={inputCls}
                placeholder="e.g. OO-2026-001"
                {...register("operationNum")}
              />
            </div>
            <div className="flex-1">
              <label className={labelCls}>
                {labels.date} <span className="text-red-500">*</span>
              </label>
              <input type="date" className={inputCls} {...register("dateCreated")} />
              {errors.dateCreated && (
                <p className="mt-1 text-[11px] text-red-500">{errors.dateCreated.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? "Creating…" : "Create Document"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-10 bg-transparent text-(--color-ink) text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
