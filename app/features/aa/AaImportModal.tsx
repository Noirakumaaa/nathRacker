import { useRef, useEffect, useState } from "react"
import {
  X,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import * as XLSX from "xlsx"
import type { AxiosError } from "axios"
import APIFETCH from "~/lib/axios/axiosConfig"
import { useToastStore } from "~/lib/zustand/ToastStore"

interface Props {
  moduleCode: string
  onClose: () => void
}

type ApiErrorPayload = { message?: string | string[] }

export default function AaImportModal({ moduleCode, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { show } = useToastStore()

  const currentYear = new Date().getFullYear()
  const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

  const [file, setFile] = useState<File | null>(null)
  const [sheets, setSheets] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<
    | { mode: "single"; imported: number; skipped: number; sheet?: string }
    | {
        mode: "workbook"
        imported: number
        skipped: number
        importedModules: Array<{
          moduleCode: string
          sheet: string
          imported: number
          skipped: number
        }>
        skippedSheets: Array<{ moduleCode: string; sheet: string; reason: string }>
        unmatchedSheets: string[]
      }
    | null
  >(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<ApiErrorPayload>
    const raw = axiosError.response?.data?.message

    if (typeof raw === "string") return raw
    if (Array.isArray(raw) && raw.every((item) => typeof item === "string")) return raw.join("\n")
    if (raw && typeof raw === "object" && "message" in raw) {
      const nested = (raw as { message?: unknown }).message
      if (typeof nested === "string") return nested
    }
    if (axiosError.code === "ECONNABORTED" || axiosError.message?.includes("timeout")) {
      return "The import is taking too long. The file may be too large — try importing a single sheet instead."
    }
    if (axiosError.message === "Network Error") {
      return "Couldn't reach the server. Please check your connection and try again."
    }

    return fallback.replace("{status}", String(axiosError.response?.status ?? "unknown error"))
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  // Read sheet names from file client-side
  const readSheets = (f: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: "array", bookSheets: true })
        setSheets(wb.SheetNames)
        setSelectedSheet(wb.SheetNames[0] ?? "")
      } catch {
        show(
          "Hmm, we couldn't read that file. Make sure it's a valid Excel file (.xlsx or .xls).",
          "error"
        )
      }
    }
    reader.readAsArrayBuffer(f)
  }

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".xlsx") && !f.name.endsWith(".xls")) {
      show("Only Excel files are supported. Please select a .xlsx or .xls file.", "error")
      return
    }
    setFile(f)
    setResult(null)
    setErrorMsg(null)
    readSheets(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleImport = async () => {
    if (!file || !selectedSheet) return
    setIsUploading(true)
    setErrorMsg(null)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("sheet", selectedSheet)
      form.append("year", String(selectedYear))
      const res = await APIFETCH.post<{ imported: number; skipped: number; sheet?: string }>(
        `/aa-modules/${moduleCode}/import`,
        form,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 120_000 }
      )
      setResult({
        mode: "single",
        imported: res.data.imported,
        skipped: res.data.skipped,
        sheet: res.data.sheet,
      })
      queryClient.invalidateQueries({ queryKey: ["aa-documents"] })
      show(
        `All done! ${res.data.imported} document${res.data.imported !== 1 ? "s" : ""} imported successfully.`,
        "success"
      )
    } catch (error: unknown) {
      setErrorMsg(
        getErrorMessage(
          error,
          "Import failed ({status}). Make sure the file is valid and that the selected sheet matches this module's expected headers."
        )
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleImportWorkbook = async () => {
    if (!file) return
    setIsUploading(true)
    setErrorMsg(null)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("year", String(selectedYear))
      const res = await APIFETCH.post<{
        imported: number
        skipped: number
        importedModules: Array<{
          moduleCode: string
          sheet: string
          imported: number
          skipped: number
        }>
        skippedSheets: Array<{ moduleCode: string; sheet: string; reason: string }>
        unmatchedSheets: string[]
      }>("/aa-imports/workbook", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120_000,
      })
      setResult({ mode: "workbook", ...res.data })
      queryClient.invalidateQueries({ queryKey: ["aa-documents"] })
      show(
        `Workbook imported. ${res.data.imported} document${res.data.imported !== 1 ? "s" : ""} added across ${res.data.importedModules.length} module${res.data.importedModules.length !== 1 ? "s" : ""}.`,
        "success"
      )
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error, "Workbook import failed ({status})."))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose()
      }}
      role="button"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
        {/* Header — always visible */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border) shrink-0">
          <div>
            <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">
              {moduleCode}
            </p>
            <h2 className="text-[15px] font-semibold text-(--color-ink)">Import from Excel</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-subtle) transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-0">
          {/* Year selector + drop zone side by side */}
          <div className="flex gap-4 items-start">
            {/* Year */}
            <div className="shrink-0">
              <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider mb-1.5">
                Import year
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-(--color-border) bg-(--color-bg) p-1">
                {YEAR_OPTIONS.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
                      selectedYear === yr
                        ? "bg-(--color-ink) text-(--color-bg)"
                        : "text-(--color-ink) hover:bg-(--color-subtle)"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  inputRef.current?.click()
                }
              }}
              role="button"
              tabIndex={0}
              className={`flex-1 flex items-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all px-4 py-3 ${
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : file
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-(--color-border) hover:border-blue-300 hover:bg-(--color-subtle)"
              }`}
            >
              <input
                id="aa-import-file"
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              {file ? (
                <>
                  <FileSpreadsheet size={22} className="text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-(--color-ink) truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-(--color-muted)">
                      {(file.size / 1024).toFixed(1)} KB · {sheets.length} sheet
                      {sheets.length !== 1 ? "s" : ""} · click to change
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-(--color-muted) shrink-0" />
                  <div>
                    <p className="text-[12px] font-medium text-(--color-ink)">
                      Drop Excel file here
                    </p>
                    <p className="text-[11px] text-(--color-muted)">
                      or click to browse · .xlsx / .xls
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sheet selector */}
          {sheets.length > 1 && (
            <div>
              <label
                htmlFor="aa-import-sheet"
                className="block text-[11px] font-medium text-(--color-muted) uppercase tracking-wider mb-1.5"
              >
                Select sheet
              </label>
              <div className="relative">
                <select
                  id="aa-import-sheet"
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="w-full appearance-none px-3 py-2.5 text-[13px] text-(--color-ink) bg-(--color-surface) border border-(--color-border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                >
                  {sheets.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-muted) pointer-events-none"
                />
              </div>
            </div>
          )}
          {sheets.length === 1 && (
            <p className="text-[12px] text-(--color-muted)">
              Sheet: <span className="font-medium text-(--color-ink)">{sheets[0]}</span>
            </p>
          )}

          {/* Single import result */}
          {result?.mode === "single" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 space-y-0.5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <p className="text-[13px] text-emerald-800 font-medium">
                  {result.imported} document{result.imported !== 1 ? "s" : ""} imported for{" "}
                  {selectedYear}.
                </p>
              </div>
              {result.skipped > 0 && (
                <p className="text-[12px] text-amber-700 pl-6">
                  {result.skipped} row{result.skipped !== 1 ? "s" : ""} skipped (duplicates).
                </p>
              )}
            </div>
          )}

          {/* Workbook result */}
          {result?.mode === "workbook" && (
            <div className="rounded-lg border border-(--color-border) overflow-hidden">
              {/* Summary bar */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border-b border-emerald-200">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <p className="text-[13px] text-emerald-800 font-medium">
                  {result.imported} document{result.imported !== 1 ? "s" : ""} imported across{" "}
                  {result.importedModules.length} module
                  {result.importedModules.length !== 1 ? "s" : ""} for {selectedYear}.
                  {result.skipped > 0 && (
                    <span className="text-amber-700">
                      {" "}
                      · {result.skipped} duplicate{result.skipped !== 1 ? "s" : ""} skipped.
                    </span>
                  )}
                </p>
              </div>

              {/* Scrollable detail list */}
              <div className="max-h-56 overflow-y-auto divide-y divide-(--color-border)">
                {result.importedModules.map((item) => (
                  <div
                    key={`${item.moduleCode}-${item.sheet}`}
                    className="flex items-center justify-between px-4 py-2.5 bg-(--color-surface)"
                  >
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold font-mono text-(--color-muted) uppercase mr-2">
                        {item.moduleCode}
                      </span>
                      <span className="text-[12px] text-(--color-muted) truncate">
                        {item.sheet}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[12px] font-medium text-emerald-700">
                        {item.imported} imported
                      </span>
                      {item.skipped > 0 && (
                        <span className="text-[11px] text-amber-600">{item.skipped} skipped</span>
                      )}
                    </div>
                  </div>
                ))}
                {result.skippedSheets.map((item) => (
                  <div
                    key={`skip-${item.moduleCode}-${item.sheet}`}
                    className="px-4 py-2.5 bg-amber-50"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-amber-800">{item.sheet}</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">{item.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {result.unmatchedSheets.map((sheet) => (
                  <div
                    key={`unmatched-${sheet}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-(--color-subtle)"
                  >
                    <span className="text-[12px] text-(--color-muted)">No match for sheet:</span>
                    <span className="text-[12px] font-medium text-(--color-ink)">{sheet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline error */}
          {errorMsg && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-700 whitespace-pre-line">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Footer — always visible */}
        <div className="shrink-0 border-t border-(--color-border) px-6 py-4 space-y-2.5">
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              disabled={!file || !selectedSheet || isUploading}
              className="flex-1 h-9 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading && <Loader2 size={13} className="animate-spin" />}
              {isUploading ? "Importing…" : "Import This Sheet"}
            </button>
            <button
              onClick={handleImportWorkbook}
              disabled={!file || isUploading}
              className="flex-1 h-9 border border-(--color-border) text-(--color-ink) text-[13px] font-medium rounded-lg hover:border-(--color-ink) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import Whole Workbook
            </button>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-full h-9 text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50"
          >
            {result ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  )
}
