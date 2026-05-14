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

  const [file, setFile] = useState<File | null>(null)
  const [sheets, setSheets] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<
    | { mode: "single"; imported: number; sheet?: string }
    | {
        mode: "workbook"
        imported: number
        importedModules: Array<{ moduleCode: string; sheet: string; imported: number }>
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
    if (Array.isArray(raw)) return raw.join("\n")
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
      const res = await APIFETCH.post<{ imported: number; sheet?: string }>(
        `/aa-modules/${moduleCode}/import`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      setResult({ mode: "single", imported: res.data.imported, sheet: res.data.sheet })
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
      const res = await APIFETCH.post<{
        imported: number
        importedModules: Array<{ moduleCode: string; sheet: string; imported: number }>
        skippedSheets: Array<{ moduleCode: string; sheet: string; reason: string }>
        unmatchedSheets: string[]
      }>("/aa-imports/workbook", form, { headers: { "Content-Type": "multipart/form-data" } })
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
      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
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

        <div className="p-6 space-y-4">
          {/* Format hint */}
          <div className="text-[12px] text-(--color-muted) bg-(--color-subtle) rounded-lg px-4 py-3 space-y-1">
            <p className="font-semibold text-(--color-ink)">Module-specific import</p>
            <p className="text-[11px]">
              Each AA module has its own schema. Upload the sheet that matches this module&apos;s
              exact headers, or import the whole workbook and let the system route each sheet to its
              matching module.
            </p>
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
            className={`
              flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
              cursor-pointer transition-all py-8 px-4
              ${
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : file
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-(--color-border) hover:border-blue-300 hover:bg-(--color-subtle)"
              }
            `}
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
                <FileSpreadsheet size={28} className="text-emerald-500" />
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-(--color-ink)">{file.name}</p>
                  <p className="text-[11px] text-(--color-muted) mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · {sheets.length} sheet
                    {sheets.length !== 1 ? "s" : ""} · Click to change
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload size={24} className="text-(--color-muted)" />
                <div className="text-center">
                  <p className="text-[13px] font-medium text-(--color-ink)">
                    Drop your Excel file here
                  </p>
                  <p className="text-[11px] text-(--color-muted) mt-0.5">
                    or click to browse · .xlsx / .xls
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Sheet selector — shown only when file has multiple sheets */}
          {sheets.length > 1 && (
            <div>
              <label
                htmlFor="aa-import-sheet"
                className="block text-[12px] font-medium text-(--color-muted) mb-1.5"
              >
                Select sheet to import
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
              <p className="mt-1 text-[11px] text-(--color-muted)">
                This file has {sheets.length} sheets. Choose which one contains the document data.
              </p>
            </div>
          )}

          {/* Single sheet info */}
          {sheets.length === 1 && (
            <p className="text-[12px] text-(--color-muted)">
              Sheet: <span className="font-medium text-(--color-ink)">{sheets[0]}</span>
            </p>
          )}

          {/* Success result */}
          {result?.mode === "single" && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <p className="text-[13px] text-emerald-800 font-medium">
                {result.imported} document{result.imported !== 1 ? "s" : ""} imported successfully.
              </p>
            </div>
          )}

          {result?.mode === "workbook" && (
            <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <p className="text-[13px] text-emerald-800 font-medium">
                  {result.imported} document{result.imported !== 1 ? "s" : ""} imported across{" "}
                  {result.importedModules.length} module
                  {result.importedModules.length !== 1 ? "s" : ""}.
                </p>
              </div>
              <div className="space-y-1 text-[12px] text-emerald-900">
                {result.importedModules.map((item) => (
                  <p key={`${item.moduleCode}-${item.sheet}`}>
                    {item.moduleCode}: {item.imported} from {item.sheet}
                  </p>
                ))}
                {result.skippedSheets.map((item) => (
                  <p key={`skip-${item.moduleCode}-${item.sheet}`} className="text-amber-800">
                    Skipped {item.sheet}: {item.reason}
                  </p>
                ))}
                {result.unmatchedSheets.map((sheet) => (
                  <p key={`unmatched-${sheet}`} className="text-slate-700">
                    Unmatched sheet: {sheet}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Inline error */}
          {errorMsg && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-700 whitespace-pre-line">{errorMsg}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleImport}
              disabled={!file || !selectedSheet || isUploading}
              className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading && <Loader2 size={14} className="animate-spin" />}
              {isUploading ? "Importing…" : "Import This Sheet"}
            </button>
            <button
              onClick={handleImportWorkbook}
              disabled={!file || isUploading}
              className="flex-1 h-10 border border-(--color-border) text-(--color-ink) text-[13px] font-medium rounded-lg hover:border-(--color-ink) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import Whole Workbook
            </button>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-full h-10 text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50"
          >
            {result ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  )
}
