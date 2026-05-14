import { useState } from "react"
import { useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Plus, Download, Upload, FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"
import Skeleton from "~/components/Skeleton"
import AaDocumentSearchBar from "./AaDocumentSearchBar"
import AaNewDocumentModal from "./AaNewDocumentModal"
import AaImportModal from "./AaImportModal"
import { getAaModuleLabels } from "./aaModuleLabels"
import type { AaDocumentListResponse, AaDocumentModule, DocumentQueryParams } from "~/types/aaTypes"

interface Props {
  moduleCode: string
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export default function AaModuleTable({ moduleCode }: Props) {
  const navigate = useNavigate()
  const { show } = useToastStore()

  const [showModal, setShowModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const YEAR_OPTIONS = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

  const [queryParams, setQueryParams] = useState<DocumentQueryParams>({
    page: 1,
    pageSize: 25,
    year: currentYear,
  })

  const { data, isLoading, isError } = useQuery<AaDocumentListResponse>({
    queryKey: ["aa-documents", moduleCode, queryParams],
    queryFn: () =>
      APIFETCH.get<AaDocumentListResponse>(`/aa-modules/${moduleCode}/documents`, {
        params: queryParams,
      }).then((r) => r.data),
    enabled: !!moduleCode,
    staleTime: 30_000,
  })

  const { data: moduleMeta } = useQuery<AaDocumentModule>({
    queryKey: ["aa-module", moduleCode],
    queryFn: () => APIFETCH.get<AaDocumentModule>(`/aa-modules/${moduleCode}`).then((r) => r.data),
    enabled: !!moduleCode,
    staleTime: 60_000,
  })

  const labels = getAaModuleLabels(moduleCode, moduleMeta)

  const handleSearchChange = (params: Partial<DocumentQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...params, page: 1 }))
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    setQueryParams((prev) => ({ ...prev, year, page: 1 }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await APIFETCH.get(`/aa-modules/${moduleCode}/export`, {
        responseType: "blob",
      })
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = `${moduleCode}-export.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      show("Export failed. Please try again in a moment.", "error")
    } finally {
      setIsExporting(false)
    }
  }

  const { meta } = data ?? {}

  return (
    <div className="bg-(--color-subtle) px-4 py-8 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-1">
            Document Tracking
          </p>
          <h1 className="text-2xl font-semibold text-(--color-ink) tracking-tight">
            {labels.moduleName}
          </h1>
          {meta && (
            <p className="mt-0.5 text-[12px] text-(--color-muted)">
              {meta.total} document{meta.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Year selector */}
          <div className="flex items-center gap-1 rounded-lg border border-(--color-border) bg-(--color-surface) p-1">
            {YEAR_OPTIONS.map((yr) => (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`px-3 py-1 text-[12px] font-medium rounded-md transition-colors ${
                  selectedYear === yr
                    ? "bg-(--color-ink) text-(--color-bg)"
                    : "text-(--color-muted) hover:text-(--color-ink)"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 h-9 px-4 text-[13px] font-medium text-(--color-ink) border border-(--color-border) rounded-lg hover:border-(--color-border-hover) transition-colors"
          >
            <Upload size={13} />
            Import
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 h-9 px-4 text-[13px] font-medium text-(--color-ink) border border-(--color-border) rounded-lg hover:border-(--color-border-hover) transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Export
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 h-9 px-4 text-[13px] font-medium bg-(--color-ink) text-(--color-bg) rounded-lg hover:opacity-85 transition-opacity"
          >
            <Plus size={13} />
            New Document
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <AaDocumentSearchBar onChange={handleSearchChange} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface)">
        <div className="max-h-[calc(100vh-18rem)] min-h-96 overflow-auto">
          <table className="w-full min-w-255 text-[13px]">
            <thead>
              <tr className="border-b border-(--color-border) bg-(--color-subtle)">
                <th className="sticky top-0 z-10 bg-(--color-subtle) text-left px-4 py-3 text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider whitespace-nowrap">
                  Tracking No
                </th>
                <th className="sticky top-0 z-10 bg-(--color-subtle) text-left px-4 py-3 text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider whitespace-nowrap">
                  OO No.
                </th>
                <th className="sticky top-0 z-10 bg-(--color-subtle) text-left px-4 py-3 text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider whitespace-nowrap">
                  {labels.staff}
                </th>
                <th className="sticky top-0 z-10 bg-(--color-subtle) text-left px-4 py-3 text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
                  {labels.subject}
                </th>
                <th className="sticky top-0 z-10 bg-(--color-subtle) text-left px-4 py-3 text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider whitespace-nowrap">
                  {labels.date}
                </th>
                <th className="sticky top-0 z-10 bg-(--color-subtle) text-left px-4 py-3 text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
                  {labels.latestRemark}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-border)">
              {isLoading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 rounded" />
                      </td>
                    ))}
                  </tr>
                ))}

              {isError && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-red-500 text-[13px]">
                    Failed to load documents. Please try again.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && data?.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <FileText size={32} className="mx-auto mb-3 text-(--color-muted) opacity-30" />
                    <p className="text-[14px] text-(--color-muted)">
                      No documents yet — create your first one.
                    </p>
                  </td>
                </tr>
              )}

              {data?.data.map((doc) => {
                const sortedRemarks = [...doc.remarks].sort((a, b) => b.order - a.order)
                const latestRemark = sortedRemarks[0]
                const extraCount = sortedRemarks.length - 1

                return (
                  <tr
                    key={doc.id}
                    onClick={() => navigate(`/aa/${moduleCode}/${doc.id}`)}
                    className="hover:bg-(--color-subtle) cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-(--color-ink) whitespace-nowrap">
                      {doc.trackingNo}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-(--color-muted) whitespace-nowrap">
                      {doc.operationNum ?? <span className="italic opacity-40">—</span>}
                    </td>
                    <td className="px-4 py-3 text-(--color-ink) whitespace-nowrap">
                      {doc.staffName}
                    </td>
                    <td className="px-4 py-3 text-(--color-ink) max-w-xs">
                      <span className="block truncate" title={doc.subject}>
                        {doc.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-(--color-muted) whitespace-nowrap">
                      {formatDate(doc.dateCreated)}
                    </td>
                    <td className="px-4 py-3">
                      {latestRemark ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="text-(--color-muted) truncate max-w-45"
                            title={latestRemark.content}
                          >
                            {latestRemark.content}
                          </span>
                          {extraCount > 0 && (
                            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-(--color-subtle) text-(--color-muted) border border-(--color-border)">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-(--color-muted) italic">No remarks</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-(--color-border) bg-(--color-subtle)">
            <p className="text-[12px] text-(--color-muted)">
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueryParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                disabled={meta.page <= 1}
                className="p-1.5 rounded-lg border border-(--color-border) text-(--color-muted) hover:text-(--color-ink) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setQueryParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                disabled={meta.page >= meta.totalPages}
                className="p-1.5 rounded-lg border border-(--color-border) text-(--color-muted) hover:text-(--color-ink) disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New document modal */}
      {showImport && <AaImportModal moduleCode={moduleCode} onClose={() => setShowImport(false)} />}

      {showModal && (
        <AaNewDocumentModal
          moduleCode={moduleCode}
          defaultYear={selectedYear}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
