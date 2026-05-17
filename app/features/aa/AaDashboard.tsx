import { useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { FileText, Loader2, AlertCircle, CalendarDays } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import type { AaDocumentModule } from "~/types/aaTypes"

const MODULE_COLORS: Record<string, string> = {
  BDM: "bg-indigo-50 text-indigo-600 border-indigo-200",
  CVS: "bg-sky-50 text-sky-600 border-sky-200",
  EDTMS: "bg-emerald-50 text-emerald-600 border-emerald-200",
  GRS: "bg-amber-50 text-amber-600 border-amber-200",
  OOLEVEL: "bg-rose-50 text-rose-600 border-rose-200",
  MNE: "bg-purple-50 text-purple-600 border-purple-200",
}

const moduleColor = (code: string) =>
  MODULE_COLORS[code] ?? "bg-gray-50 text-gray-600 border-gray-200"

export default function AaDashboard() {
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery<AaDocumentModule[]>({
    queryKey: ["aa-modules"],
    queryFn: () => APIFETCH.get<AaDocumentModule[]>("/aa-modules").then((r) => r.data),
    staleTime: 60_000,
  })

  return (
    <div className="min-h-screen bg-(--color-subtle) px-4 py-8 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
            Document Tracking
          </p>
          <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">AA Module</h1>
          <p className="mt-1 text-[13px] text-(--color-muted)">
            Select an existing module to open its document tracking log.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-(--color-muted)">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-[13px]">Loading modules…</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} />
          <span className="text-[13px]">
            Couldn't load modules. Please refresh the page and try again.
          </span>
        </div>
      )}

      {data &&
        (() => {
          const regular = data.filter((m) => !m.isMonthly)
          const monthly = data.filter((m) => m.isMonthly)
          return (
            <div className="space-y-8">
              {/* Monthly Tracking — combined card */}
              {monthly.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-semibold text-(--color-muted) uppercase tracking-widest mb-3">
                    Monthly Tracking
                  </h2>
                  <div
                    className="bg-(--color-surface) border border-(--color-border) rounded-xl hover:border-(--color-border-hover) hover:shadow-sm transition-all group flex flex-col cursor-pointer"
                    onClick={() => navigate("/aa/monthly")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") navigate("/aa/monthly")
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="p-5 pb-4 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider bg-blue-50 text-blue-600 border-blue-200">
                          <CalendarDays size={12} />
                          Monthly
                        </span>
                        <span className="text-[12px] font-semibold text-(--color-muted) tabular-nums">
                          {monthly.length} modules
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold text-(--color-ink) group-hover:text-blue-600 transition-colors mb-2">
                        Monthly Tracking
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {monthly.map((m) => (
                          <span
                            key={m.code}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-(--color-subtle) text-(--color-muted) border border-(--color-border)"
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center px-5 py-2.5 border-t border-(--color-border) bg-(--color-subtle) rounded-b-xl">
                      <span className="text-[11px] text-blue-600 font-medium group-hover:underline">
                        Open combined view →
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular modules */}
              {regular.length > 0 && (
                <div>
                  <h2 className="text-[12px] font-semibold text-(--color-muted) uppercase tracking-widest mb-3">
                    Document Modules
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regular.map((mod) => (
                      <div
                        key={mod.id}
                        className="bg-(--color-surface) border border-(--color-border) rounded-xl hover:border-(--color-border-hover) hover:shadow-sm transition-all group flex flex-col"
                      >
                        <button
                          onClick={() => navigate(`/aa/${mod.code}`)}
                          className="flex-1 text-left p-5 pb-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${moduleColor(mod.code)}`}
                            >
                              <FileText size={12} />
                              {mod.code}
                            </span>
                            <span className="text-[12px] font-semibold text-(--color-muted) tabular-nums">
                              {mod._count?.documents ?? 0} docs
                            </span>
                          </div>
                          <p className="text-[14px] font-semibold text-(--color-ink) group-hover:text-blue-600 transition-colors mb-1">
                            {mod.name}
                          </p>
                          {mod.description && (
                            <p className="text-[12px] text-(--color-muted) line-clamp-2">
                              {mod.description}
                            </p>
                          )}
                        </button>
                        <div className="flex items-center justify-between px-5 py-2.5 border-t border-(--color-border) bg-(--color-subtle) rounded-b-xl">
                          <button
                            onClick={() => navigate(`/aa/${mod.code}`)}
                            className="text-[11px] text-blue-600 font-medium hover:underline"
                          >
                            Open module →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

      {data?.length === 0 && (
        <div className="text-center py-16 text-(--color-muted)">
          <FileText size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-[14px]">No AA modules are available yet.</p>
        </div>
      )}
    </div>
  )
}
