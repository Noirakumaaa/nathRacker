import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, X, CheckCircle2, Loader2 } from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { labelCls, inputCls } from "component/styleConfig";
import { Req } from "component/LabelStyle";
import { SectionHeader, PanelHeader, SubmitRow, ListItem } from "./shared";
import type { OperationsOffice } from "./types";

export default function OfficeTab() {
  const { show } = useToastStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const [importRows, setImportRows] = useState<string[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, refetch } = useQuery({
    queryKey: ["assignedArea"],
    queryFn: async () => (await APIFETCH.get("/admin/get/assignedArea")).data,
  });
  const offices: OperationsOffice[] = data?.operations ?? [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await APIFETCH.post("/admin/operations-office", { name: name.toUpperCase() });
      show("Operations Office created.", "success");
      setName("");
      refetch();
    } catch {
      show("Error creating office.", "error");
    } finally {
      setLoading(false);
    }
  };

  const parseFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target?.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const names = rows
        .map(r => String(r["name"] ?? r["Name"] ?? r["NAME"] ?? "").trim().toUpperCase())
        .filter(Boolean);
      setImportRows(names);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const clearImport = () => {
    setImportRows(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const runImport = async () => {
    if (!importRows?.length) return;
    setImporting(true);
    let ok = 0;
    let fail = 0;
    for (const n of importRows) {
      try {
        await APIFETCH.post("/admin/operations-office", { name: n });
        ok++;
      } catch {
        fail++;
      }
    }
    setImporting(false);
    clearImport();
    refetch();
    show(`Import done: ${ok} added${fail ? `, ${fail} failed` : ""}.`, fail ? "error" : "success");
  };

  const remove = async (id: number) => {
    try {
      await APIFETCH.delete(`/admin/operations-office/${id}`);
      show("Office removed.", "success");
      refetch();
    } catch {
      show("Error removing office.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">Admin Management</p>
        <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">Operations Office</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Manual Entry ─────────────────────────────────────────────────── */}
        <form onSubmit={submit} className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden">
          <PanelHeader label="Add Operations Office" />
          <div className="p-6 space-y-4">
            <SectionHeader title="Office Details" />
            <div className="space-y-3.5">
              <div>
                <label className={labelCls}>Office Name <Req /></label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="e.g. OPERATIONS OFFICE I"
                />
              </div>
              <SubmitRow loading={loading} submitLabel="Add Office" onCancel={() => setName("")} cancelLabel="Clear" />
            </div>
          </div>
        </form>

        {/* ── Excel Import ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden flex flex-col">
          <PanelHeader label="Import from Excel" legend={false} />
          <div className="p-6 flex flex-col gap-4 flex-1">

            {importRows === null ? (
              /* Drop Zone */
              <label
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors min-h-40 ${
                  dragOver
                    ? "border-[#1a1a18] bg-[#f0f0ec]"
                    : "border-[#d8d8d0] bg-[#f8f8f4] hover:border-[#a8a8a0] hover:bg-[#f2f2ee]"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFile}
                  className="sr-only"
                />
                <div className={`p-3 rounded-full ${dragOver ? "bg-[#e8e8e0]" : "bg-white border border-[#e8e8e0]"}`}>
                  <Upload size={20} className="text-[#8a8a80]" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[#1a1a18]">Drop your Excel file here</p>
                  <p className="text-[11px] text-[#8a8a80] mt-0.5">or click to browse</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#b8b8b0]">
                  <span className="font-mono bg-[#ececea] px-1.5 py-0.5 rounded">name</span>
                  <span>column required · .xlsx .xls .csv</span>
                </div>
              </label>
            ) : (
              /* Preview */
              <div className="flex flex-col gap-3">
                {/* File info bar */}
                <div className="flex items-center gap-3 px-3 py-2.5 bg-[#f5f5f2] rounded-lg border border-[#e8e8e0]">
                  <FileSpreadsheet size={16} className="text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-[#1a1a18] truncate">{fileName}</p>
                    <p className="text-[10px] text-[#8a8a80]">{importRows.length} row{importRows.length !== 1 ? "s" : ""} found</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearImport}
                    disabled={importing}
                    className="p-1 rounded-md hover:bg-[#e8e8e0] transition-colors text-[#8a8a80] hover:text-[#1a1a18] cursor-pointer border-none bg-transparent disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Preview list */}
                <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-[#e8e8e0] p-2">
                  {importRows.map((n, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-50">
                      <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                      <span className="text-[12px] font-medium text-emerald-800">{n}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={runImport}
                    disabled={importing || importRows.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#1a1a18] text-white text-[13px] font-semibold rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
                  >
                    {importing ? (
                      <><Loader2 size={14} className="animate-spin" /> Importing…</>
                    ) : (
                      `Import ${importRows.length} Office${importRows.length !== 1 ? "s" : ""} →`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearImport}
                    disabled={importing}
                    className="px-4 h-10 text-[13px] font-medium text-[#6a6a60] border border-[#e8e8e0] rounded-lg hover:border-[#1a1a18] hover:text-[#1a1a18] transition-colors cursor-pointer bg-transparent disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── List ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden lg:col-span-2">
          <PanelHeader label={`Operations Offices (${offices.length})`} legend={false} />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {offices.length === 0
              ? <p className="text-[12px] text-[#8a8a80] text-center py-6 col-span-full">No offices added yet.</p>
              : offices.map(o => (
                <ListItem key={o.id} label={o.name} sub={`ID: ${o.id}`} onDelete={() => remove(o.id)} />
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}
