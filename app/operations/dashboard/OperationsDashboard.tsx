import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Landmark,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type { OperationsOffice, Lgu, Barangay, Employee } from "~/adminSettings/types";
import type { me } from "~/types/authTypes";
import { moduleStyle } from "component/styleConfig";

type AreaData = {
  operations: OperationsOffice[];
  lgu: Lgu[];
  barangay: Barangay[];
};

type CountItem = {
  documentType: string;
  count: number;
};

const DOC_TYPES = ["BUS", "PCN", "SWDI", "CVS", "MISC", "VERIFIED"];

// ── Overview stat card ────────────────────────────────────────────────────────
function OverviewCard({
  label,
  value,
  icon: Icon,
  iconBg,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  iconBg: string;
  sub?: string;
}) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-4 flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={16} className="opacity-70" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[22px] font-semibold text-(--color-ink) leading-tight mt-0.5">
          {value}
        </p>
        {sub && <p className="text-[11px] text-[#b8b8b0] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Document type count badge ─────────────────────────────────────────────────
function DocTypeBadge({ type, count }: { type: string; count: number }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-(--color-bg) border border-[#f0f0ec]">
      <span
        className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wider ${
          moduleStyle[type] ?? "bg-gray-50 text-gray-600"
        }`}
      >
        {type}
      </span>
      <span className="text-[15px] font-semibold text-(--color-ink)">{count}</span>
    </div>
  );
}

// ── LGU card with expandable barangay list ────────────────────────────────────
function LguCard({
  lgu,
  barangays,
  encoders,
}: {
  lgu: Lgu;
  barangays: Barangay[];
  encoders: Employee[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
      {/* LGU header */}
      <div className="px-4 py-3 border-b border-(--color-border) flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Landmark size={13} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-(--color-ink)">{lgu.name}</p>
            <p className="text-[10px] text-(--color-muted)">LGU ID #{lgu.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-(--color-muted) font-mono bg-(--color-subtle) px-2 py-0.5 rounded-full whitespace-nowrap">
            {barangays.length} brgy
          </span>
          <span className="text-[10px] text-(--color-muted) font-mono bg-(--color-subtle) px-2 py-0.5 rounded-full whitespace-nowrap">
            {encoders.length} enc
          </span>
        </div>
      </div>

      {/* Assigned encoders */}
      {encoders.length > 0 && (
        <div className="px-4 py-2.5 border-b border-[#f0f0ec] flex items-center gap-1.5 flex-wrap">
          <Users size={11} className="text-[#b8b8b0] shrink-0" />
          {encoders.map((e) => (
            <span
              key={e.id}
              className="text-[10px] font-mono bg-(--color-subtle) text-[#6a6a60] px-2 py-0.5 rounded-full"
            >
              {e.govUsername}
            </span>
          ))}
        </div>
      )}

      {/* Barangay expand toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-(--color-bg) transition-colors cursor-pointer"
      >
        <span className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={11} />
          Barangays ({barangays.length})
        </span>
        {expanded ? (
          <ChevronDown size={13} className="text-[#b8b8b0]" />
        ) : (
          <ChevronRight size={13} className="text-[#b8b8b0]" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-3 grid grid-cols-2 gap-1.5">
          {barangays.length === 0 ? (
            <p className="col-span-2 text-[12px] text-(--color-placeholder) text-center py-2">
              No barangays registered
            </p>
          ) : (
            barangays.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-(--color-bg) border border-[#f0f0ec]"
              >
                <MapPin size={10} className="text-(--color-placeholder) shrink-0" />
                <span className="text-[11px] text-[#4a4a40] truncate">{b.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function OperationsDashboard({ userData }: { userData: me }) {
  const [selectedOffice, setSelectedOffice] = useState<number | "all">("all");

  const { data: areaData } = useQuery<AreaData>({
    queryKey: ["assignedArea"],
    queryFn: async () => {
      const res = await APIFETCH.get("/admin/get/assignedArea");
      return res.data;
    },
  });

  const { data: counts = [] } = useQuery<CountItem[]>({
    queryKey: ["documentCounts"],
    queryFn: async () => {
      const res = await APIFETCH.get("/alldocuments/count/documents");
      return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    },
  });

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await APIFETCH.get("/admin/employees");
      return res.data;
    },
  });

  const offices = areaData?.operations ?? [];
  const allLgus = areaData?.lgu ?? [];
  const allBarangays = areaData?.barangay ?? [];

  const filteredLgus =
    selectedOffice === "all"
      ? allLgus
      : allLgus.filter((l) => l.operationsOfficeNumId === selectedOffice);

  const getBarangaysForLgu = (lguId: number) =>
    allBarangays.filter((b) => b.lguId === lguId);

  const getEncodersForLgu = (lguId: number) =>
    employees.filter((e) => e.userInfo?.assignedLGUID === lguId);

  const getCount = (type: string) =>
    counts.find((c) => c.documentType === type)?.count ?? 0;

  const totalRecords = counts.reduce((sum, c) => sum + c.count, 0);
  const totalBarangays = filteredLgus.reduce(
    (sum, l) => sum + getBarangaysForLgu(l.id).length,
    0,
  );

  return (
    <main className="p-6 bg-(--color-bg) min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-5">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
              Operations Head
            </p>
            <h1 className="text-[22px] font-semibold text-(--color-ink) tracking-tight mt-0.5">
              Operations Dashboard
            </h1>
            <p className="text-[12px] text-(--color-muted) mt-0.5">
              Welcome back,{" "}
              <span className="font-medium text-(--color-ink)">
                {userData.firstName || userData.govUsername}
              </span>
            </p>
          </div>

          {/* Office filter — only shown when multiple offices exist */}
          {offices.length > 1 && (
            <select
              value={selectedOffice}
              onChange={(e) =>
                setSelectedOffice(
                  e.target.value === "all" ? "all" : Number(e.target.value),
                )
              }
              className="text-[13px] text-(--color-ink) px-3 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) hover:border-(--color-ink) transition-colors outline-none cursor-pointer self-start sm:self-auto"
            >
              <option value="all">All Offices</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ── Overview stat cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <OverviewCard
            label="Total LGUs"
            value={filteredLgus.length}
            icon={Landmark}
            iconBg="bg-indigo-50 text-indigo-600"
            sub="Local govt units"
          />
          <OverviewCard
            label="Barangays"
            value={totalBarangays}
            icon={MapPin}
            iconBg="bg-emerald-50 text-emerald-600"
            sub="Registered barangays"
          />
          <OverviewCard
            label="Total Encoded"
            value={totalRecords}
            icon={FileText}
            iconBg="bg-amber-50 text-amber-600"
            sub="All document records"
          />
          <OverviewCard
            label="Encoders"
            value={employees.filter((e) => e.role === "ENCODER").length}
            icon={Users}
            iconBg="bg-sky-50 text-sky-600"
            sub="Active encoder staff"
          />
        </div>

        {/* ── Document type totals ──────────────────────────────────────────── */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-(--color-border) flex items-center gap-2">
            <BarChart3 size={14} className="text-(--color-muted)" />
            <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
              Encoded Records by Document Type
            </p>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DOC_TYPES.map((type) => (
              <DocTypeBadge key={type} type={type} count={getCount(type)} />
            ))}
          </div>
        </div>

        {/* ── LGU & Barangay section ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
              LGUs &amp; Barangays
            </p>
            <span className="text-[11px] font-mono text-(--color-muted) bg-(--color-subtle) px-2.5 py-1 rounded-full">
              {filteredLgus.length} LGU{filteredLgus.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredLgus.length === 0 ? (
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-12 flex flex-col items-center gap-2 text-(--color-placeholder)">
              <Landmark size={22} />
              <p className="text-[13px]">No LGUs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredLgus.map((lgu) => (
                <LguCard
                  key={lgu.id}
                  lgu={lgu}
                  barangays={getBarangaysForLgu(lgu.id)}
                  encoders={getEncodersForLgu(lgu.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Operations offices overview ───────────────────────────────────── */}
        {offices.length > 0 && (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-(--color-border) flex items-center gap-2">
              <Building2 size={14} className="text-(--color-muted)" />
              <p className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Operations Offices
              </p>
            </div>
            <div className="divide-y divide-(--color-subtle)">
              {offices.map((office) => {
                const officeLgus = allLgus.filter(
                  (l) => l.operationsOfficeNumId === office.id,
                );
                const officeBarangays = officeLgus.reduce(
                  (sum, l) => sum + getBarangaysForLgu(l.id).length,
                  0,
                );
                const officeEncoders = employees.filter(
                  (e) => e.userInfo?.assignedOperationId === office.id,
                );
                return (
                  <div
                    key={office.id}
                    className="px-5 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-(--color-subtle) flex items-center justify-center">
                        <Building2 size={13} className="text-(--color-muted)" />
                      </div>
                      <p className="text-[13px] font-medium text-(--color-ink)">
                        {office.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-(--color-muted) font-mono bg-(--color-subtle) px-2 py-0.5 rounded-full whitespace-nowrap">
                        {officeLgus.length} LGU{officeLgus.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[10px] text-(--color-muted) font-mono bg-(--color-subtle) px-2 py-0.5 rounded-full whitespace-nowrap">
                        {officeBarangays} brgy
                      </span>
                      <span className="text-[10px] text-(--color-muted) font-mono bg-(--color-subtle) px-2 py-0.5 rounded-full whitespace-nowrap">
                        {officeEncoders.length} enc
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
