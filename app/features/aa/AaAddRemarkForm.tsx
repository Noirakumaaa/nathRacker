import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2, Plus } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import { labelCls, inputCls } from "~/components/styleConfig"
import type { AaRemark } from "~/types/aaTypes"

interface Props {
  documentId: string
  moduleCode: string
  /** Optimistic insert callback so the UI updates instantly */
  onOptimisticAdd: (remark: AaRemark) => void
  /** Called on error to roll back the optimistic insert */
  onRollback: (tempId: string) => void
}

export default function AaAddRemarkForm({
  documentId,
  moduleCode,
  onOptimisticAdd,
  onRollback,
}: Props) {
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const [content, setContent] = useState("")
  const [remarkDate, setRemarkDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const tempId = `temp-${Date.now()}`

    // Optimistic update — show remark immediately
    onOptimisticAdd({
      id: tempId,
      documentId,
      content: content.trim(),
      remarkDate: remarkDate || null,
      order: Date.now(),
      createdAt: new Date().toISOString(),
    })

    setContent("")
    setRemarkDate("")
    setIsSubmitting(true)

    try {
      await APIFETCH.post<AaRemark>(`/aa-documents/${documentId}/remarks`, {
        content: content.trim(),
        remarkDate: remarkDate || undefined,
      })

      // Refresh the real data to get the correct order value from the server
      queryClient.invalidateQueries({ queryKey: ["aa-document", documentId] })
      queryClient.invalidateQueries({ queryKey: ["aa-documents", moduleCode] })
    } catch {
      onRollback(tempId)
      show("Failed to add remark. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="remark-content" className={labelCls}>
          Remark content
        </label>
        <textarea
          id="remark-content"
          rows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g. received/endorsed to AC 1/7/26"
          className={inputCls + " resize-none"}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="remark-date" className={labelCls}>
            Date (optional)
          </label>
          <input
            id="remark-date"
            type="date"
            value={remarkDate}
            onChange={(e) => setRemarkDate(e.target.value)}
            className={inputCls}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="h-10 px-4 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
        >
          {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Add
        </button>
      </div>
    </form>
  )
}
