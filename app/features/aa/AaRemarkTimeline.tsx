import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import type { AaRemark } from "~/types/aaTypes"

interface Props {
  remarks: AaRemark[]
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function AaRemarkTimeline({ remarks }: Props) {
  const [order, setOrder] = useState<"asc" | "desc">("asc")

  const sorted = [...remarks].sort((a, b) =>
    order === "asc" ? a.order - b.order : b.order - a.order
  )

  if (remarks.length === 0) {
    return (
      <p className="text-[12px] text-(--color-muted) italic py-2">
        No remarks yet. Add the first one below.
      </p>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
          {remarks.length} Remark{remarks.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
          className="flex items-center gap-1 text-[11px] text-(--color-muted) hover:text-(--color-ink) transition-colors"
          title={order === "asc" ? "Showing oldest first" : "Showing newest first"}
        >
          <ArrowUpDown size={11} />
          {order === "asc" ? "Oldest first" : "Newest first"}
        </button>
      </div>

      <ol className="relative border-l border-(--color-border) ml-2 space-y-4">
        {sorted.map((remark) => (
          <li key={remark.id} className="ml-4">
            <div className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-(--color-surface) bg-(--color-muted)" />
            <div className="bg-(--color-subtle) border border-(--color-border) rounded-lg px-3 py-2.5">
              <p className="text-[13px] text-(--color-ink) leading-snug">{remark.content}</p>
              {remark.remarkDate && (
                <p className="mt-1 text-[11px] text-(--color-muted)">
                  {formatDate(remark.remarkDate)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
