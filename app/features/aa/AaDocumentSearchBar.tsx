import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import type { DocumentQueryParams } from "~/types/aaTypes"

interface Props {
  onChange: (params: Partial<DocumentQueryParams>) => void
  initialValues?: Partial<DocumentQueryParams>
}

export default function AaDocumentSearchBar({ onChange, initialValues }: Props) {
  const [search, setSearch] = useState(initialValues?.search ?? "")
  const [dateFrom, setDateFrom] = useState(initialValues?.dateFrom ?? "")
  const [dateTo, setDateTo] = useState(initialValues?.dateTo ?? "")

  // Debounce the free-text search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [search, dateFrom, dateTo])

  const clear = () => {
    setSearch("")
    setDateFrom("")
    setDateTo("")
  }

  const hasFilter = search || dateFrom || dateTo

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Full-text search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tracking no, staff, subject…"
          className="w-full pl-9 pr-3 py-2 text-[13px] border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-ink) placeholder-(--color-muted) focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Date range */}
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="px-3 py-2 text-[13px] border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-ink) focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        title="From date"
      />
      <span className="text-[12px] text-(--color-muted)">to</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="px-3 py-2 text-[13px] border border-(--color-border) rounded-lg bg-(--color-surface) text-(--color-ink) focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        title="To date"
      />

      {/* Clear */}
      {hasFilter && (
        <button
          onClick={clear}
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-(--color-muted) hover:text-(--color-ink) border border-(--color-border) rounded-lg transition-colors"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  )
}
