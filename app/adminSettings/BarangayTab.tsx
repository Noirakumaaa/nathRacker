import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { labelCls, inputCls } from "component/styleConfig";
import { Req } from "component/LabelStyle";
import { SectionHeader, PanelHeader, SubmitRow, ListItem } from "./shared";
import type { OperationsOffice, Lgu, Barangay } from "./types";

export default function BarangayTab() {
  const { show } = useToastStore();
  const [form, setForm] = useState({ name: "", lguId: "" as number | "" });
  const [loading, setLoading] = useState(false);

  const [importRows, setImportRows] = useState<{ name: string; lgu: string }[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, refetch } = useQuery({
    queryKey: ["assignedArea"],
    queryFn: async () => (await APIFETCH.get("/admin/get/assignedArea")).data,
  });
  const offices: OperationsOffice[] = data?.operations ?? [];
  const lgus: Lgu[] = data?.lgu ?? [];
  const barangays: Barangay[] = data?.barangay ?? [];

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await APIFETCH.post("/admin/barangay", {
        name: form.name.toUpperCase(),
        lguId: Number(form.lguId),
      });
      show("Barangay created.", "success");
      setForm({ name: "", lguId: "" });
      refetch();
    } catch {
      show("Error creating barangay.", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await APIFETCH.delete(`/admin/barangay/${id}`);
      show("Barangay removed.", "success");
      refetch();
    } catch {
      show("Error removing barangay.", "error");
    }
  };

  const lguName    = (id: number) => lgus.find(l => l.id === id)?.name ?? `LGU ${id}`;
  const officeName = (id: number) => offices.find(o => o.id === id)?.name ?? "";

  const parseFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target?.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const parsed = rows
        .map(r => ({
          name: String(r["name"] ?? r["Name"] ?? r["NAME"] ?? "").trim().toUpperCase(),
          lgu:  String(r["lgu"]  ?? r["LGU"]  ?? r["Lgu"]  ?? "").trim().toUpperCase(),
        }))
        .filter(r => r.name);
      setImportRows(parsed);
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
    let ok = 0, fail = 0;
    for (const row of importRows) {
      const lgu = lgus.find(l => l.name.toUpperCase() === row.lgu);
      if (!lgu) { fail++; continue; }
      try {
        await APIFETCH.post("/admin/barangay", { name: row.name, lguId: lgu.id });
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

  const matchable = importRows?.filter(r => lgus.find(l => l.name.toUpperCase() === r.lgu)).length ?? 0;

  return (
    <div className="px-6 py-6 space-y-5">

      {/* Page header */}
      <div>
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">Admin Management</p>
        <h1 className="text-[20px] font-semibold text-(--color-ink) tracking-tight">Barangay</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Manual Entry ── */}
        <form onSubmit={submit} className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">
          <PanelHeader label="Add Barangay" />
          <div className="p-5 space-y-4">
            <SectionHeader title="Barangay Details" />
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Barangay Name <Req /></label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required className={inputCls} placeholder="e.g. BARANGAY 1"
                />
              </div>
              <div>
                <label className={labelCls}>LGU <Req /></label>
                <select
                  value={form.lguId}
                  onChange={e => setForm(p => ({ ...p, lguId: Number(e.target.value) }))}
                  required className={inputCls}
                >
                  <option value="">Select LGU</option>
                  {lgus.map(l => (
                    <option key={l.id} value={l.id}>{l.name} — {officeName(l.operationsOfficeNumId)}</option>
                  ))}
                </select>
              </div>
              <SubmitRow loading={loading} submitLabel="Add Barangay" onCancel={() => setForm({ name: "", lguId: "" })} />
            </div>
          </div>
        </form>

        {/* ── Excel Import ── */}
        <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden flex flex-col">
          <PanelHeader label="Import from Excel" legend={false} />
          <div className="p-5 flex flex-col gap-4 flex-1">
            {importRows === null ? (
              <label
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex-1 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors min-h-36 ${
                  dragOver
                    ? "border-(--color-ink) bg-(--color-subtle)"
                    : "border-(--color-border) bg-(--color-subtle) hover:border-(--color-muted)"
                }`}
              >
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="sr-only" />
                <div className="p-3 rounded-full bg-(--color-surface) border border-(--color-border)">
                  <Upload size={18} className="text-(--color-muted)" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-medium text-(--color-ink)">Drop Excel file here</p>
                  <p className="text-[11px] text-(--color-muted) mt-0.5">or click to browse · .xlsx .xls .csv</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-(--color-placeholder)">
                  <span className="font-mono bg-(--color-border) px-1.5 py-0.5 rounded">name</span>
                  <span>+</span>
                  <span className="font-mono bg-(--color-border) px-1.5 py-0.5 rounded">lgu</span>
                  <span>columns required</span>
                </div>
              </label>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-(--color-subtle) rounded-lg border border-(--color-border)">
                  <FileSpreadsheet size={15} className="text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-(--color-ink) truncate">{fileName}</p>
                    <p className="text-[10px] text-(--color-muted)">
                      {importRows.length} rows —{" "}
                      <span className="text-emerald-600">{matchable} will import</span>
                      {importRows.length - matchable > 0 && <span className="text-red-500">, {importRows.length - matchable} unmatched</span>}
                    </p>
                  </div>
                  <button type="button" onClick={clearImport} disabled={importing}
                    className="p-1 rounded-md hover:bg-(--color-border) transition-colors text-(--color-muted) hover:text-(--color-ink) cursor-pointer border-none bg-transparent disabled:opacity-50">
                    <X size={13} />
                  </button>
                </div>
                <div className="max-h-44 overflow-y-auto space-y-1 rounded-lg border border-(--color-border) p-2">
                  {importRows.map((r, i) => {
                    const matched = lgus.find(l => l.name.toUpperCase() === r.lgu);
                    return (
                      <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md ${matched ? "bg-emerald-50" : "bg-red-50"}`}>
                        {matched
                          ? <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                          : <AlertTriangle size={11} className="text-red-400 shrink-0" />
                        }
                        <span className={`text-[12px] font-medium ${matched ? "text-emerald-800" : "text-red-700"}`}>{r.name}</span>
                        <span className={`text-[10px] ml-auto ${matched ? "text-emerald-500" : "text-red-400"}`}>
                          {r.lgu || "(no LGU)"}{!matched && " · not found"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={runImport} disabled={importing || matchable === 0}
                    className="flex-1 flex items-center justify-center gap-2 h-9 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none">
                    {importing ? <><Loader2 size={13} className="animate-spin" /> Importing…</> : `Import ${matchable} Barangay${matchable !== 1 ? "s" : ""}`}
                  </button>
                  <button type="button" onClick={clearImport} disabled={importing}
                    className="px-4 h-9 text-[13px] font-medium text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent disabled:opacity-50">
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── List ── */}
        <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden lg:col-span-2">
          <PanelHeader label={`Barangays (${barangays.length})`} legend={false} />
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
            {barangays.length === 0
              ? <p className="text-[12px] text-(--color-muted) text-center py-8 col-span-full">No barangays added yet.</p>
              : barangays.map(b => (
                <ListItem
                  key={b.id}
                  label={b.name}
                  sub={`${lguName(b.lguId)} — ${officeName(lgus.find(l => l.id === b.lguId)?.operationsOfficeNumId ?? 0)}`}
                  onDelete={() => remove(b.id)}
                />
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}
