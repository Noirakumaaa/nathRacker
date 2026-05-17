import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, Save, Plus, Minus } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"

const MIN_REMARKS = 3

const MONTHS = [
  { label: "January", key: "january" },
  { label: "February", key: "february" },
  { label: "March", key: "march" },
  { label: "April", key: "april" },
  { label: "May", key: "may" },
  { label: "June", key: "june" },
  { label: "July", key: "july" },
  { label: "August", key: "august" },
  { label: "September", key: "september" },
  { label: "October", key: "october" },
  { label: "November", key: "november" },
  { label: "December", key: "december" },
]

type MonthState = { value: string; remarks: string[] }
type FormState = Record<string, MonthState>

function ensureMin(arr: string[]): string[] {
  const out = [...arr]
  while (out.length < MIN_REMARKS) out.push("")
  return out
}

function buildForm(raw: Record<string, unknown> | null | undefined): FormState {
  const state: FormState = {}
  for (const { key } of MONTHS) {
    const value = typeof raw?.[key] === "string" ? (raw[key] as string) : ""
    const remarksRaw = raw?.[`${key}_remarks`]
    const remarks = Array.isArray(remarksRaw)
      ? ensureMin(remarksRaw.map((r) => (typeof r === "string" ? r : "")))
      : ensureMin([])
    state[key] = { value, remarks }
  }
  return state
}

function buildPayload(form: FormState): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  for (const { key } of MONTHS) {
    payload[key] = form[key].value
    payload[`${key}_remarks`] = form[key].remarks
  }
  return payload
}

interface Props {
  documentId: string
  moduleCode: string
}

export default function AaMonthlyGrid({ documentId, moduleCode }: Props) {
  const queryClient = useQueryClient()
  const { show } = useToastStore()
  const [isSaving, setIsSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const queryKey = ["aa-monthly", moduleCode, documentId]
  const endpoint = `/aa-documents/${documentId}/monthly`

  const { data: rawData, isLoading } = useQuery<Record<string, unknown> | null>({
    queryKey,
    queryFn: () =>
      APIFETCH.get<{ data: Record<string, unknown> } | null>(endpoint).then(
        (r) => (r.data as { data?: Record<string, unknown> })?.data ?? r.data
      ),
    enabled: !!documentId,
  })

  const [form, setForm] = useState<FormState>(() => buildForm(null))
  const [synced, setSynced] = useState(false)
  if (!synced && !isLoading) {
    setForm(buildForm(rawData as Record<string, unknown> | null))
    setSynced(true)
  }

  const setVal = (monthKey: string, value: string) => {
    setForm((prev) => ({ ...prev, [monthKey]: { ...prev[monthKey], value } }))
    setDirty(true)
  }

  const setRemark = (monthKey: string, idx: number, value: string) => {
    setForm((prev) => {
      const remarks = [...prev[monthKey].remarks]
      remarks[idx] = value
      return { ...prev, [monthKey]: { ...prev[monthKey], remarks } }
    })
    setDirty(true)
  }

  const addRemark = (monthKey: string) => {
    setForm((prev) => ({
      ...prev,
      [monthKey]: { ...prev[monthKey], remarks: [...prev[monthKey].remarks, ""] },
    }))
    setDirty(true)
  }

  const removeRemark = (monthKey: string) => {
    setForm((prev) => {
      const remarks = prev[monthKey].remarks
      if (remarks.length <= MIN_REMARKS) return prev
      return { ...prev, [monthKey]: { ...prev[monthKey], remarks: remarks.slice(0, -1) } }
    })
    setDirty(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await APIFETCH.put(endpoint, buildPayload(form))
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

      <div className="grid grid-cols-2 gap-3">
        {MONTHS.map(({ label, key }) => (
          <MonthCard
            key={key}
            label={label}
            monthKey={key}
            state={form[key]}
            onValueChange={(v) => setVal(key, v)}
            onRemarkChange={(i, v) => setRemark(key, i, v)}
            onAddRemark={() => addRemark(key)}
            onRemoveRemark={() => removeRemark(key)}
          />
        ))}
      </div>
    </div>
  )
}

interface CardProps {
  label: string
  monthKey: string
  state: MonthState
  onValueChange: (v: string) => void
  onRemarkChange: (idx: number, v: string) => void
  onAddRemark: () => void
  onRemoveRemark: () => void
}

function MonthCard({
  label,
  monthKey,
  state,
  onValueChange,
  onRemarkChange,
  onAddRemark,
  onRemoveRemark,
}: CardProps) {
  const hasContent = state.value || state.remarks.some((r) => r)

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 transition-colors ${
        hasContent
          ? "border-(--color-border) bg-(--color-surface)"
          : "border-(--color-border) bg-(--color-subtle)"
      }`}
    >
      <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
        {label}
      </p>

      <div>
        <label htmlFor={`${monthKey}-value`} className={labelCls}>
          Value
        </label>
        <input
          id={`${monthKey}-value`}
          type="text"
          className={inputCls}
          placeholder="—"
          value={state.value}
          onChange={(e) => onValueChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        {state.remarks.map((remark, idx) => (
          <div key={idx}>
            <label htmlFor={`${monthKey}-remark-${idx}`} className={labelCls}>
              Remark {idx + 1}
            </label>
            <input
              id={`${monthKey}-remark-${idx}`}
              type="text"
              className={inputCls}
              placeholder="—"
              value={remark}
              onChange={(e) => onRemarkChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={onAddRemark}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus size={11} />
          Add remark
        </button>
        {state.remarks.length > MIN_REMARKS && (
          <button
            type="button"
            onClick={onRemoveRemark}
            className="flex items-center gap-1 text-[11px] text-(--color-muted) hover:text-red-500 font-medium"
          >
            <Minus size={11} />
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
