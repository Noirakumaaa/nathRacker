import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Save } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"
import { AA_MONTHLY_CONFIGS, type MonthDef } from "./aaMonthlyConfig"

type MonthlyData = Record<string, string | null | undefined>
type FormState = Record<string, string>

function buildInitialForm(months: MonthDef[], data: MonthlyData | null | undefined): FormState {
  const state: FormState = {}
  for (const m of months) {
    state[m.valueKey] = data?.[m.valueKey] ?? ""
    for (const rk of m.remarkKeys) {
      state[rk] = data?.[rk] ?? ""
    }
  }
  return state
}

interface Props {
  documentId: string
  moduleCode: string
}

export default function AaMonthlyGrid({ documentId, moduleCode }: Props) {
  const config = AA_MONTHLY_CONFIGS[moduleCode]
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [isSaving, setIsSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const queryKey = ["aa-monthly", moduleCode, documentId]
  const endpoint = `/aa-documents/${documentId}/${config.endpoint}`

  const { data, isLoading } = useQuery<MonthlyData | null>({
    queryKey,
    queryFn: () => APIFETCH.get<MonthlyData | null>(endpoint).then((r) => r.data),
    enabled: !!documentId,
  })

  const [form, setForm] = useState<FormState>(() => buildInitialForm(config.months, null))
  const [synced, setSynced] = useState(false)
  if (!synced && !isLoading) {
    setForm(buildInitialForm(config.months, data))
    setSynced(true)
  }

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === "" ? undefined : v])
      )
      await APIFETCH.put(endpoint, payload)
      queryClient.invalidateQueries({ queryKey })
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
        {config.months.map((month) => (
          <MonthCard key={month.valueKey} month={month} form={form} onChange={set} />
        ))}
      </div>
    </div>
  )
}

// ─── Month card ───────────────────────────────────────────────────────────────

interface CardProps {
  month: MonthDef
  form: FormState
  onChange: (key: string, value: string) => void
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
      <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
        {month.label}
      </p>

      <div>
        <label htmlFor={`${month.valueKey}-value`} className={labelCls}>
          Value
        </label>
        <input
          id={`${month.valueKey}-value`}
          type="text"
          className={inputCls}
          placeholder="—"
          value={form[month.valueKey] ?? ""}
          onChange={(e) => onChange(month.valueKey, e.target.value)}
        />
      </div>

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
              value={form[rk] ?? ""}
              onChange={(e) => onChange(rk, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
