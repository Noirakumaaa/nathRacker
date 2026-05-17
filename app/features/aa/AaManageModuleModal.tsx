import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"
import type { AaDocumentModule } from "~/types/aaTypes"

// ── Schemas ───────────────────────────────────────────────────
const createSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  name: z.string().min(1, "Name is required"),
  prefix: z.string().min(1, "Prefix is required"),
  description: z.string().optional(),
})

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prefix: z.string().min(1, "Prefix is required"),
  description: z.string().optional(),
})

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>

interface Props {
  onClose: () => void
  module?: AaDocumentModule
}

// ── Shared overlay wrapper ────────────────────────────────────
function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string
  subtitle: string
  onClose: () => void
  children: React.ReactNode
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      role="presentation"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
          <div>
            <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">
              AA Module
            </p>
            <h2 className="text-[15px] font-semibold text-(--color-ink)">{title}</h2>
            {subtitle && <p className="text-[12px] text-(--color-muted) mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-subtle) transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Create form ───────────────────────────────────────────────
function CreateForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { code: "", name: "", prefix: "", description: "" },
  })

  const code = watch("code")
  useEffect(() => {
    setValue("prefix", code)
  }, [code, setValue])

  const prefix = watch("prefix")

  const onSubmit = async (values: CreateValues) => {
    try {
      await APIFETCH.post("/aa-modules", values)
      show(`Module ${values.code} was created successfully! 🎉`, "success")
      queryClient.invalidateQueries({ queryKey: ["aa-modules"] })
      onClose()
    } catch {
      show(
        "Couldn't create the module. The code may already be in use — please try a different one.",
        "error"
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      {/* Code */}
      <div>
        <label htmlFor="module-code-create" className={labelCls}>
          Module Code <span className="text-red-500">*</span>
        </label>
        <input
          id="module-code-create"
          type="text"
          className={inputCls}
          placeholder="e.g. BDM, EDTMS, GRS"
          {...register("code", {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase()
            },
          })}
        />
        <p className="mt-1 text-[11px] text-(--color-muted)">
          Used in the URL and tracking numbers. Must be unique.
        </p>
        {errors.code && <p className="mt-1 text-[11px] text-red-500">{errors.code.message}</p>}
      </div>

      <SharedFields register={register} errors={errors} prefix={prefix} />

      <FormActions
        isSubmitting={isSubmitting}
        submitLabel="Create Module"
        loadingLabel="Creating…"
        onClose={onClose}
      />
    </form>
  )
}

// ── Edit form ─────────────────────────────────────────────────
function EditForm({ module, onClose }: { module: AaDocumentModule; onClose: () => void }) {
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: module.name,
      prefix: module.prefix,
      description: module.description ?? "",
    },
  })

  const prefix = watch("prefix")

  const onSubmit = async (values: EditValues) => {
    try {
      await APIFETCH.patch(`/aa-modules/${module.code}`, values)
      show(`Module ${module.code} has been updated successfully.`, "success")
      queryClient.invalidateQueries({ queryKey: ["aa-modules"] })
      onClose()
    } catch {
      show("Couldn't save your changes. Please try again in a moment.", "error")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      {/* Code — read-only in edit mode */}
      <div>
        <label htmlFor="module-code-edit" className={labelCls}>
          Module Code
        </label>
        <input
          id="module-code-edit"
          type="text"
          value={module.code}
          readOnly
          className={`${inputCls} opacity-60 cursor-not-allowed`}
        />
        <p className="mt-1 text-[11px] text-(--color-muted)">
          Code cannot be changed after creation.
        </p>
      </div>

      <SharedFields register={register} errors={errors} prefix={prefix} />

      <FormActions
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        loadingLabel="Saving…"
        onClose={onClose}
      />
    </form>
  )
}

// ── Shared fields (name, prefix, description) ─────────────────
function SharedFields({
  register,
  errors,
  prefix,
}: {
  register: ReturnType<typeof useForm<EditValues>>["register"]
  errors: ReturnType<typeof useForm<EditValues>>["formState"]["errors"]
  prefix: string
}) {
  return (
    <>
      {/* Name */}
      <div>
        <label htmlFor="module-name" className={labelCls}>
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="module-name"
          type="text"
          className={inputCls}
          placeholder="e.g. Barangay Document Monitoring"
          {...register("name")}
        />
        {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>}
      </div>

      {/* Prefix */}
      <div>
        <label htmlFor="module-prefix" className={labelCls}>
          Tracking Number Prefix <span className="text-red-500">*</span>
        </label>
        <div className="flex rounded-lg overflow-hidden border border-(--color-border) focus-within:ring-2 focus-within:ring-blue-500 bg-(--color-surface)">
          <input
            id="module-prefix"
            type="text"
            className="flex-1 px-3 py-2 text-[13px] text-(--color-ink) bg-(--color-surface) focus:outline-none font-mono"
            placeholder="BDM"
            {...register("prefix", {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase()
              },
            })}
          />
          <span className="px-3 flex items-center bg-(--color-subtle) text-(--color-muted) text-[12px] font-mono border-l border-(--color-border) shrink-0">
            -0001
          </span>
        </div>
        <p className="mt-1 text-[11px] text-(--color-muted)">
          Documents will be numbered as {prefix || "PREFIX"}-0001, {prefix || "PREFIX"}-0002…
        </p>
        {errors.prefix && <p className="mt-1 text-[11px] text-red-500">{errors.prefix.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="module-description" className={labelCls}>
          Description (optional)
        </label>
        <input
          id="module-description"
          type="text"
          className={inputCls}
          placeholder="Short description of this module"
          {...register("description")}
        />
      </div>
    </>
  )
}

// ── Submit + cancel buttons ───────────────────────────────────
function FormActions({
  isSubmitting,
  submitLabel,
  loadingLabel,
  onClose,
}: {
  isSubmitting: boolean
  submitLabel: string
  loadingLabel: string
  onClose: () => void
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        {isSubmitting ? loadingLabel : submitLabel}
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
  )
}

// ── Public component ──────────────────────────────────────────
export default function AaManageModuleModal({ onClose, module }: Props) {
  return (
    <ModalShell
      title={module ? `Edit ${module.code}` : "Add New Module"}
      subtitle={module ? module.name : ""}
      onClose={onClose}
    >
      {module ? <EditForm module={module} onClose={onClose} /> : <CreateForm onClose={onClose} />}
    </ModalShell>
  )
}
