import { useEffect } from "react"
import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Loader2, AlertCircle } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import type { AaDocumentModule } from "~/types/aaTypes"
import AaModuleTable from "./AaModuleTable"

export default function AaMonthlyHub() {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    data: modules,
    isLoading,
    isError,
  } = useQuery<AaDocumentModule[]>({
    queryKey: ["aa-modules"],
    queryFn: () => APIFETCH.get<AaDocumentModule[]>("/aa-modules").then((r) => r.data),
    staleTime: 60_000,
  })

  const monthlyModules = modules?.filter((m) => m.isMonthly && m.isActive) ?? []
  const activeCode = searchParams.get("module") ?? ""

  // Set default tab to first monthly module once loaded
  useEffect(() => {
    if (monthlyModules.length > 0 && !searchParams.get("module")) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set("module", monthlyModules[0].code)
          return next
        },
        { replace: true }
      )
    }
  }, [monthlyModules.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const setActiveCode = (code: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set("module", code)
        return next
      },
      { replace: true }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-(--color-muted)">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-[13px]">Loading monthly modules…</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 m-4">
        <AlertCircle size={16} />
        <span className="text-[13px]">Couldn't load modules. Please refresh and try again.</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-(--color-subtle) flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 bg-(--color-surface) border-b border-(--color-border)">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">
          AA Module
        </p>
        <h1 className="text-lg font-semibold text-(--color-ink) tracking-tight">
          Monthly Tracking
        </h1>
      </div>

      {/* Scrollable tab strip */}
      <div className="bg-(--color-surface) border-b border-(--color-border) sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {monthlyModules.map((mod) => (
            <button
              key={mod.code}
              type="button"
              onClick={() => setActiveCode(mod.code)}
              className={`shrink-0 px-5 py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeCode === mod.code
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-(--color-muted) hover:text-(--color-ink)"
              }`}
            >
              {mod.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active module table */}
      <div className="flex-1">
        {activeCode ? (
          <AaModuleTable key={activeCode} moduleCode={activeCode} />
        ) : (
          <div className="flex items-center justify-center h-48 text-(--color-muted) text-[13px]">
            No monthly modules found.
          </div>
        )}
      </div>
    </div>
  )
}
