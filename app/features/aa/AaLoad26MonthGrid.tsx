import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Save } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"
import type { AaLoad26Monthly } from "~/types/aaTypes"

// ─── Month definitions ────────────────────────────────────────────────────────

type MonthEntry = {
  label: string
  valueKey: keyof AaLoad26Monthly
  remarkKeys: Array<keyof AaLoad26Monthly>
}

const MONTHS: MonthEntry[] = [
  {
    label: "January",
    valueKey: "january",
    remarkKeys: ["janRemark1", "janRemark2", "janRemark3", "janRemark4", "janRemark5"],
  },
  {
    label: "February",
    valueKey: "february",
    remarkKeys: ["febRemark1", "febRemark2", "febRemark3", "febRemark4", "febRemark5"],
  },
  {
    label: "March",
    valueKey: "march",
    remarkKeys: ["marRemark1", "marRemark2", "marRemark3", "marRemark4", "marRemark5"],
  },
  {
    label: "April",
    valueKey: "april",
    remarkKeys: ["aprRemark1", "aprRemark2", "aprRemark3", "aprRemark4", "aprRemark5"],
  },
  {
    label: "May",
    valueKey: "may",
    remarkKeys: ["mayRemark1", "mayRemark2", "mayRemark3", "mayRemark4", "mayRemark5"],
  },
  {
    label: "June",
    valueKey: "june",
    remarkKeys: ["junRemark1", "junRemark2", "junRemark3", "junRemark4", "junRemark5"],
  },
  {
    label: "July",
    valueKey: "july",
    remarkKeys: ["julRemarks1", "julRemarks2", "julRemarks3", "julRemarks4", "julRemarks5"],
  },
  {
    label: "August",
    valueKey: "august",
    remarkKeys: ["augRemarks1", "augRemarks2", "augRemarks3", "augRemarks4", "augRemarks5"],
  },
  {
    label: "September",
    valueKey: "september",
    remarkKeys: ["sepRemarks1", "sepRemarks2", "sepRemarks3", "sepRemarks4", "sepRemarks5"],
  },
  {
    label: "October",
    valueKey: "october",
    remarkKeys: ["octRemarks1", "octRemarks2", "octRemarks3", "octRemarks4", "octRemarks5"],
  },
  {
    label: "November",
    valueKey: "november",
    remarkKeys: ["novRemarks1", "novRemarks2", "novRemarks3", "novRemarks4", "novRemarks5"],
  },
  {
    label: "December",
    valueKey: "december",
    remarkKeys: ["decRemarks1", "decRemarks2", "decRemarks3", "decRemarks4", "decRemarks5"],
  },
]

type FormState = Partial<Record<keyof AaLoad26Monthly, string>>

function buildInitialForm(data: AaLoad26Monthly | null | undefined): FormState {
  const state: FormState = {}
  for (const m of MONTHS) {
    state[m.valueKey] = data?.[m.valueKey] ?? ""
    for (const rk of m.remarkKeys) {
      state[rk] = (data?.[rk] as string | null) ?? ""
    }
  }
  return state
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  documentId: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AaLoad26MonthGrid({ documentId }: Props) {
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [isSaving, setIsSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const { data, isLoading } = useQuery<AaLoad26Monthly | null>({
    queryKey: ["aa-load26-monthly", documentId],
    queryFn: () =>
      APIFETCH.get<AaLoad26Monthly | null>(`/aa-documents/${documentId}/load26-monthly`).then(
        (r) => r.data
      ),
    enabled: !!documentId,
  })

  const [form, setForm] = useState<FormState>(() => buildInitialForm(null))

  // Sync form when data arrives (only once, not on every render)
  const [synced, setSynced] = useState(false)
  if (!synced && !isLoading) {
    setForm(buildInitialForm(data))
    setSynced(true)
  }

  const set = (key: keyof AaLoad26Monthly, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Convert empty strings to undefined so the backend stores null
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : v])
      )
      await APIFETCH.put(`/aa-documents/${documentId}/load26-monthly`, payload)
      queryClient.invalidateQueries({ queryKey: ["aa-load26-monthly", documentId] })
      queryClient.invalidateQueries({ queryKey: ["aa-document", documentId] })
      setDirty(false)
      show("Monthly data saved.", "success")
    } catch {
      show("Failed to save. Please try again.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-(--color-muted)">
        <Loader2 size={16} className="animate-spin mr-2" />
        <span className="text-[13px]">Loading monthly data…</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Save bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
          Monthly Remarks
        </h3>
        <button
          onClick={handleSave}
          disabled={isSaving || !dirty}
          className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium bg-(--color-ink) text-(--color-bg) rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Month grid — 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        {MONTHS.map((month) => (
          <MonthCard key={month.label} month={month} form={form} onChange={set} />
        ))}
      </div>
    </div>
  )
}

// ─── Month card ───────────────────────────────────────────────────────────────

interface CardProps {
  month: MonthEntry
  form: FormState
  onChange: (key: keyof AaLoad26Monthly, value: string) => void
}

function MonthCard({ month, form, onChange }: CardProps) {
  const hasContent = form[month.valueKey] || month.remarkKeys.some((rk) => form[rk])

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 transition-colors ${
        hasContent
          ? "border-(--color-border) bg-(--color-surface)"
          : "border-(--color-border) bg-(--color-subtle)"
      }`}
    >
      {/* Month header */}
      <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
        {month.label}
      </p>

      {/* Value field */}
      <div>
        <label htmlFor={`${month.valueKey}-value`} className={labelCls}>
          Value
        </label>
        <input
          id={`${month.valueKey}-value`}
          type="text"
          className={inputCls}
          placeholder="—"
          value={(form[month.valueKey] as string) ?? ""}
          onChange={(e) => onChange(month.valueKey, e.target.value)}
        />
      </div>

      {/* Remark slots */}
      <div className="space-y-1.5">
        {month.remarkKeys.map((rk, idx) => (
          <div key={rk}>
            <label htmlFor={`${rk}-input`} className={labelCls}>
              Remark {idx + 1}
            </label>
            <input
              id={`${rk}-input`}
              type="text"
              className={inputCls}
              placeholder="—"
              value={(form[rk] as string) ?? ""}
              onChange={(e) => onChange(rk, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
