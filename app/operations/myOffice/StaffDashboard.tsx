import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  MapPin,
  Landmark,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type { Lgu, Barangay, Employee, OperationsOffice } from "~/adminSettings/types";
import { moduleStyle } from "component/styleConfig";
import { MONTHS } from "~/types/SummaryType";

type AreaData = {
  operations: OperationsOffice[];
  lgu: Lgu[];
  barangay: Barangay[];
};

type GlobalRecord = {
  id: number;
  idNumber: string;
  name: string;
  documentType: string;
  documentId: number;
  remarks: string;
  userId: number;
  govUsername: string;
  subjectOfChange?: string;
  drn?: string;
  date: string;
};

const ROLE_LABEL: Record<string, string> = {
  ENCODER: "Encoder",
  ADMIN: "Admin",
  AREA_COORDINATOR: "Area Coordinator",
  SOCIAL_WORKER_III: "Social Worker III",
};

const DOC_TYPES = ["BUS", "PCN", "SWDI", "CVS", "MISC", "VERIFIED"];

const selectCls =
  "text-[13px] text-(--color-ink) px-3 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) hover:border-(--color-ink) transition-colors outline-none cursor-pointer";

// ── Helpers ───────────────────────────────────────────────────────────────────
function countEncoded(records: GlobalRecord[]) {
  return records.filter((r) => r.remarks === "YES").length;
}
function countUpdated(records: GlobalRecord[]) {
  return records.filter((r) => r.remarks === "UPDATED").length;
}
function countIssues(records: GlobalRecord[]) {
  return records.filter(
    (r) => r.remarks !== "YES" && r.remarks !== "UPDATED" && r.remarks !== "NO",
  ).length;
}

// ── Summary block (3 columns: encoded / updated / issues) ─────────────────────
function SummaryBlock({
  records,
  label,
  sublabel,
}: {
  records: GlobalRecord[];
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-(--color-border)">
        <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">{label}</p>
        {sublabel && <p className="text-[11px] text-(--color-muted) mt-0.5">{sublabel}</p>}
      </div>
      <div className="grid grid-cols-3 divide-x divide-[#f0f0ec]">
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">
            Encoded
          </p>
          <p className="text-[26px] font-semibold text-(--color-ink)">{countEncoded(records)}</p>
        </div>
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">
            Updated
          </p>
          <p className="text-[26px] font-semibold text-blue-600">{countUpdated(records)}</p>
        </div>
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">
            Issues
          </p>
          <p className="text-[26px] font-semibold text-amber-500">{countIssues(records)}</p>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ remarks }: { remarks: string }) {
  const cls =
    remarks === "YES"
      ? "bg-emerald-50 text-emerald-600"
      : remarks === "UPDATED"
      ? "bg-blue-50 text-blue-600"
      : remarks === "NO"
      ? "bg-red-50 text-red-500"
      : "bg-amber-50 text-amber-600";
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {remarks || "—"}
    </span>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function StaffDashboard({ govUsername }: { govUsername: string }) {
  const navigate = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());

  const years = Array.from(
    { length: now.getFullYear() - 2022 + 1 },
    (_, i) => now.getFullYear() - i,
  );

  const { data: areaData } = useQuery<AreaData>({
    queryKey: ["assignedArea"],
    queryFn: async () => {
      const res = await APIFETCH.get("/admin/get/assignedArea");
      return res.data;
    },
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await APIFETCH.get("/admin/employees");
      return res.data;
    },
  });

  const {
    data: allRecords = [],
    isLoading: recordsLoading,
    refetch,
  } = useQuery<GlobalRecord[]>({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      const res = await APIFETCH.get("/alldocuments/globalRecords");
      return res.data;
    },
  });

  const emp = employees.find((e) => e.govUsername === govUsername);

  // All records for this staff member
  const staffRecords = useMemo(
    () => allRecords.filter((r) => r.govUsername === govUsername),
    [allRecords, govUsername],
  );

  // Records filtered to selected month/year
  const monthlyRecords = useMemo(
    () =>
      staffRecords.filter((r) => {
        const d = new Date(r.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      }),
    [staffRecords, month, year],
  );

  const allLgus      = areaData?.lgu      ?? [];
  const allBarangays = areaData?.barangay ?? [];

  const assignedLgu = emp?.userInfo?.assignedLGUID != null
    ? allLgus.find((l) => l.id === emp.userInfo!.assignedLGUID)
    : undefined;

  const assignedBarangay = emp?.userInfo?.assignedBarangayId != null
    ? allBarangays.find((b) => b.id === emp.userInfo!.assignedBarangayId)
    : undefined;

  const fullName = emp?.userInfo
    ? `${emp.userInfo.firstName} ${emp.userInfo.lastName}`.trim()
    : "";

  // Table shows records for the selected month (sorted newest first)
  const tableRecords = useMemo(
    () =>
      [...monthlyRecords].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [monthlyRecords],
  );

  if (!emp && employees.length > 0) {
    return (
      <main className="p-6 bg-(--color-bg) font-sans antialiased">
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-8 max-w-md flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <p className="text-[15px] font-semibold text-(--color-ink)">Staff Member Not Found</p>
          <p className="text-[13px] text-(--color-muted)">
            No staff member with username{" "}
            <span className="font-mono">{govUsername}</span> was found.
          </p>
          <button
            type="button"
            onClick={() => navigate("/operations/staff")}
            className="flex items-center gap-2 px-4 py-2 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            Back to Staff
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-(--color-bg) min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-5">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={() => navigate("/operations/my-office")}
              className="text-[11px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none">
              My Office
            </button>
            <span className="text-(--color-placeholder) text-[11px]">/</span>
            <button type="button" onClick={() => navigate("/operations/staff")}
              className="text-[11px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none">
              Staff
            </button>
            <span className="text-(--color-placeholder) text-[11px]">/</span>
            <span className="text-[11px] text-(--color-ink) font-medium">{govUsername}</span>
          </div>

          {/* Back */}
          <button type="button" onClick={() => navigate("/operations/staff")}
            className="flex items-center gap-1.5 text-[12px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none mb-3">
            <ArrowLeft size={13} />
            Back to Staff
          </button>

          {/* Profile card */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-(--color-ink) flex items-center justify-center shrink-0">
              <span className="text-[20px] font-bold text-white">
                {govUsername[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[18px] font-semibold text-(--color-ink)">
                {fullName || govUsername}
              </h1>
              <p className="text-[12px] text-(--color-muted) font-mono mt-0.5">{govUsername}</p>
              {emp && (
                <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-(--color-subtle) text-[#6a6a60]">
                  {ROLE_LABEL[emp.role] ?? emp.role}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              {assignedLgu && (
                <div className="flex items-center gap-1.5 text-[11px] text-(--color-muted)">
                  <Landmark size={10} className="text-(--color-placeholder)" />
                  {assignedLgu.name}
                </div>
              )}
              {assignedBarangay && (
                <div className="flex items-center gap-1.5 text-[11px] text-(--color-muted)">
                  <MapPin size={10} className="text-(--color-placeholder)" />
                  {assignedBarangay.name}
                </div>
              )}
              {emp?.userInfo?.phone && (
                <p className="text-[11px] text-[#b8b8b0] font-mono">{emp.userInfo.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Overall summary ───────────────────────────────────────────────── */}
        <SummaryBlock
          records={staffRecords}
          label="Overall Summary"
          sublabel={`${staffRecords.length} total records · all time`}
        />

        {/* ── Monthly summary with picker ───────────────────────────────────── */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-(--color-border) flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-(--color-muted)" />
              <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Monthly Summary
              </p>
              <span className="text-[11px] text-(--color-muted)">
                — {MONTHS[month - 1]} {year}
              </span>
            </div>
            <div className="flex gap-2">
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectCls}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#f0f0ec]">
            <div className="px-5 py-4 text-center">
              <p className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">
                Encoded
              </p>
              <p className="text-[26px] font-semibold text-(--color-ink)">
                {countEncoded(monthlyRecords)}
              </p>
              <p className="text-[10px] text-[#b8b8b0] mt-0.5">
                of {countEncoded(staffRecords)} total
              </p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">
                Updated
              </p>
              <p className="text-[26px] font-semibold text-blue-600">
                {countUpdated(monthlyRecords)}
              </p>
              <p className="text-[10px] text-[#b8b8b0] mt-0.5">
                of {countUpdated(staffRecords)} total
              </p>
            </div>
            <div className="px-5 py-4 text-center">
              <p className="text-[10px] font-medium text-(--color-muted) uppercase tracking-wider mb-1">
                Issues
              </p>
              <p className="text-[26px] font-semibold text-amber-500">
                {countIssues(monthlyRecords)}
              </p>
              <p className="text-[10px] text-[#b8b8b0] mt-0.5">
                of {countIssues(staffRecords)} total
              </p>
            </div>
          </div>
        </div>

        {/* ── Records by doc type (overall) ────────────────────────────────── */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-(--color-border) flex items-center gap-2">
            <FileText size={14} className="text-(--color-muted)" />
            <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
              Records by Document Type
            </p>
            <span className="ml-auto text-[10px] font-mono text-(--color-muted) bg-(--color-subtle) px-2 py-0.5 rounded-full">
              {staffRecords.length} total
            </span>
          </div>
          <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DOC_TYPES.map((type) => {
              const total   = staffRecords.filter((r) => r.documentType === type).length;
              const monthly = monthlyRecords.filter((r) => r.documentType === type).length;
              return (
                <div
                  key={type}
                  className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg bg-(--color-bg) border border-[#f0f0ec]"
                >
                  <span className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wider ${moduleStyle[type] ?? "bg-gray-50 text-gray-600"}`}>
                    {type}
                  </span>
                  <span className="text-[18px] font-semibold text-(--color-ink)">{total}</span>
                  <span className="text-[10px] text-[#b8b8b0]">
                    {monthly} this mo.
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Records table for selected month ─────────────────────────────── */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-(--color-border) flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-(--color-muted)" />
              <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                {MONTHS[month - 1]} {year} Records
              </p>
              <span className="text-[10px] font-mono text-(--color-muted) bg-(--color-subtle) px-2 py-0.5 rounded-full">
                {tableRecords.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={recordsLoading}
              className="flex items-center gap-1.5 text-[11px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
            >
              <RefreshCw size={11} className={recordsLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {recordsLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-[#b8b8b0]">
              <Loader2 size={15} className="animate-spin" />
              <span className="text-[12px]">Loading records…</span>
            </div>
          ) : tableRecords.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-(--color-placeholder)">
              <FileText size={20} />
              <p className="text-[13px]">No records for {MONTHS[month - 1]} {year}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-(--color-bg) border-b border-(--color-border)">
                  <tr>
                    {["ID Number", "Name", "Doc Type", "Status", "DRN", "Date"].map((h) => (
                      <th key={h} className="px-4 py-3 text-center text-[10px] font-semibold text-(--color-muted) uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-subtle)">
                  {tableRecords.map((r, i) => (
                    <tr key={r.id} className={`hover:bg-indigo-50/20 transition-colors ${i % 2 === 0 ? "bg-(--color-surface)" : "bg-(--color-bg)"}`}>
                      <td className="px-4 py-2.5 text-center font-mono text-[11px] text-(--color-ink)">
                        {r.idNumber}
                      </td>
                      <td className="px-4 py-2.5 text-center text-[12px] font-medium text-(--color-ink) whitespace-nowrap">
                        {r.name}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wider ${moduleStyle[r.documentType] ?? "bg-gray-50 text-gray-600"}`}>
                          {r.documentType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <StatusBadge remarks={r.remarks} />
                      </td>
                      <td className="px-4 py-2.5 text-center text-[11px] text-(--color-muted)">
                        {r.drn || <span className="text-[#d4d4cc]">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center text-[11px] text-(--color-muted) whitespace-nowrap tabular-nums">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
