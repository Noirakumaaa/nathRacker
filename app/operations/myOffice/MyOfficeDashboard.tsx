import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  MapPin,
  Landmark,
  Users,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Loader2,
  FileText,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type { OperationsOffice, Lgu, Barangay, Employee } from "~/adminSettings/types";
import type { me } from "~/types/authTypes";
import { useMonthlySummary } from "component/Usemonthlysummary";
import { MONTHS } from "~/types/SummaryType";

type AreaData = {
  operations: OperationsOffice[];
  lgu: Lgu[];
  barangay: Barangay[];
};

const ROLE_LABEL: Record<string, string> = {
  ENCODER: "Encoder",
  ADMIN: "Admin",
  AREA_COORDINATOR: "Area Coordinator",
  SOCIAL_WORKER_III: "Social Worker III",
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
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
    <div className="bg-white border border-[#e8e8e0] rounded-xl p-4 flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={16} className="opacity-70" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">{label}</p>
        <p className="text-[22px] font-semibold text-[#1a1a18] leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-[#b8b8b0] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Monthly totals row ────────────────────────────────────────────────────────
function MonthlyTotals({ month, year }: { month: number; year: number }) {
  const { data, isLoading } = useMonthlySummary(month, year);

  return (
    <div className="bg-white border border-[#e8e8e0] rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#e8e8e0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[#8a8a80]" />
          <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
            This Month — {MONTHS[month - 1]} {year}
          </p>
        </div>
        {isLoading && <Loader2 size={13} className="animate-spin text-[#b8b8b0]" />}
      </div>
      <div className="grid grid-cols-3 divide-x divide-[#f0f0ec]">
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] font-medium text-[#8a8a80] uppercase tracking-wider mb-1">
            Encoded
          </p>
          <p className="text-[24px] font-semibold text-[#1a1a18]">
            {isLoading ? "—" : (data?.totals.encoded ?? 0)}
          </p>
        </div>
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] font-medium text-[#8a8a80] uppercase tracking-wider mb-1">
            Updated
          </p>
          <p className="text-[24px] font-semibold text-blue-600">
            {isLoading ? "—" : (data?.totals.updated ?? 0)}
          </p>
        </div>
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] font-medium text-[#8a8a80] uppercase tracking-wider mb-1">
            Issues
          </p>
          <p className="text-[24px] font-semibold text-amber-500">
            {isLoading ? "—" : (data?.totals.issue ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── LGU card with expandable barangay list ────────────────────────────────────
function LguCard({
  lgu,
  barangays,
  members,
}: {
  lgu: Lgu;
  barangays: Barangay[];
  members: Employee[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#e8e8e0] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#e8e8e0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Landmark size={13} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1a1a18]">{lgu.name}</p>
            <p className="text-[10px] text-[#8a8a80]">LGU ID #{lgu.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#8a8a80] font-mono bg-[#f5f5f2] px-2 py-0.5 rounded-full whitespace-nowrap">
            {barangays.length} brgy
          </span>
          <span className="text-[10px] text-[#8a8a80] font-mono bg-[#f5f5f2] px-2 py-0.5 rounded-full whitespace-nowrap">
            {members.length} staff
          </span>
        </div>
      </div>

      {members.length > 0 && (
        <div className="px-4 py-2.5 border-b border-[#f0f0ec] flex items-center gap-1.5 flex-wrap">
          <Users size={11} className="text-[#b8b8b0] shrink-0" />
          {members.map((e) => (
            <span
              key={e.id}
              className="text-[10px] font-mono bg-[#f5f5f2] text-[#6a6a60] px-2 py-0.5 rounded-full"
              title={ROLE_LABEL[e.role] ?? e.role}
            >
              {e.govUsername}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#fafaf8] transition-colors cursor-pointer"
      >
        <span className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider flex items-center gap-1.5">
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
            <p className="col-span-2 text-[12px] text-[#c4c4b8] text-center py-2">
              No barangays registered
            </p>
          ) : (
            barangays.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#fafaf8] border border-[#f0f0ec]"
              >
                <MapPin size={10} className="text-[#c4c4b8] shrink-0" />
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
export default function MyOfficeDashboard({ userData }: { userData: me }) {
  const navigate = useNavigate();
  const now = new Date();

  const { data: areaData, isLoading: areaLoading } = useQuery<AreaData>({
    queryKey: ["assignedArea"],
    queryFn: async () => {
      const res = await APIFETCH.get("/admin/get/assignedArea");
      return res.data;
    },
  });

  const { data: employees = [], isLoading: empLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await APIFETCH.get("/admin/employees");
      return res.data;
    },
  });

  const isLoading = areaLoading || empLoading;

  const selfRecord = employees.find((e) => e.govUsername === userData.govUsername);
  const myOfficeId = selfRecord?.userInfo?.assignedOperationId ?? null;

  const offices = areaData?.operations ?? [];
  const allLgus = areaData?.lgu ?? [];
  const allBarangays = areaData?.barangay ?? [];

  const myOffice = offices.find((o) => o.id === myOfficeId) ?? null;
  const myLgus = myOfficeId !== null
    ? allLgus.filter((l) => l.operationsOfficeNumId === myOfficeId)
    : [];
  const myStaff = myOfficeId !== null
    ? employees.filter((e) => e.userInfo?.assignedOperationId === myOfficeId)
    : [];

  const getBarangaysForLgu = (lguId: number) =>
    allBarangays.filter((b) => b.lguId === lguId);

  const getMembersForLgu = (lguId: number) =>
    myStaff.filter((e) => e.userInfo?.assignedLGUID === lguId);

  const totalBarangays = myLgus.reduce(
    (sum, l) => sum + getBarangaysForLgu(l.id).length,
    0,
  );

  if (isLoading) {
    return (
      <main className="p-6 bg-[#fafaf8] min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#8a8a80]">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[13px]">Loading office data…</span>
        </div>
      </main>
    );
  }

  if (myOfficeId === null) {
    return (
      <main className="p-6 bg-[#fafaf8] min-h-screen flex items-center justify-center">
        <div className="bg-white border border-[#e8e8e0] rounded-xl p-8 max-w-md w-full flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <p className="text-[15px] font-semibold text-[#1a1a18]">No Office Assigned</p>
          <p className="text-[13px] text-[#8a8a80]">
            You have not been assigned to an operations office yet. Contact your
            administrator to set up your area assignment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-[#fafaf8] min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-5">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">
            {ROLE_LABEL[userData.role] ?? userData.role}
          </p>
          <h1 className="text-[22px] font-semibold text-[#1a1a18] tracking-tight">
            My Office
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-5 h-5 rounded-md bg-[#1a1a18] flex items-center justify-center shrink-0">
              <Building2 size={11} className="text-white" />
            </div>
            <p className="text-[13px] font-medium text-[#1a1a18]">
              {myOffice?.name ?? `Office #${myOfficeId}`}
            </p>
            <span className="text-[11px] font-mono text-[#8a8a80] bg-[#f5f5f2] px-2 py-0.5 rounded-full">
              ID #{myOfficeId}
            </span>
          </div>
        </div>

        {/* ── Monthly summary (encoded / updated / issues) ──────────────────── */}
        <MonthlyTotals month={now.getMonth() + 1} year={now.getFullYear()} />

        {/* ── Overview stat cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            label="LGUs"
            value={myLgus.length}
            icon={Landmark}
            iconBg="bg-indigo-50 text-indigo-600"
            sub="In my operations office"
          />
          <StatCard
            label="Barangays"
            value={totalBarangays}
            icon={MapPin}
            iconBg="bg-emerald-50 text-emerald-600"
            sub="Registered barangays"
          />
          <StatCard
            label="Staff"
            value={myStaff.length}
            icon={Users}
            iconBg="bg-sky-50 text-sky-600"
            sub="People in my office"
          />
        </div>

        {/* ── LGU & Barangay section ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
              LGUs &amp; Barangays
            </p>
            <span className="text-[11px] font-mono text-[#8a8a80] bg-[#f5f5f2] px-2.5 py-1 rounded-full">
              {myLgus.length} LGU{myLgus.length !== 1 ? "s" : ""}
            </span>
          </div>

          {myLgus.length === 0 ? (
            <div className="bg-white border border-[#e8e8e0] rounded-xl py-12 flex flex-col items-center gap-2 text-[#c4c4b8]">
              <Landmark size={22} />
              <p className="text-[13px]">No LGUs registered for this office</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {myLgus.map((lgu) => (
                <LguCard
                  key={lgu.id}
                  lgu={lgu}
                  barangays={getBarangaysForLgu(lgu.id)}
                  members={getMembersForLgu(lgu.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Staff quick panel ─────────────────────────────────────────────── */}
        <div className="bg-white border border-[#e8e8e0] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#e8e8e0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-[#8a8a80]" />
              <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                Staff
              </p>
              <span className="text-[10px] font-mono text-[#8a8a80] bg-[#f5f5f2] px-2 py-0.5 rounded-full">
                {myStaff.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/operations/staff")}
              className="flex items-center gap-1.5 text-[12px] font-medium text-[#1a1a18] hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none"
            >
              View All
              <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-[#f5f5f2]">
            {myStaff.slice(0, 5).map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => navigate(`/operations/staff/${emp.govUsername}`)}
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-[#fafaf8] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f5f5f2] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-[#6a6a60]">
                      {emp.govUsername[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1a1a18]">
                      {emp.userInfo
                        ? `${emp.userInfo.firstName} ${emp.userInfo.lastName}`.trim() ||
                          emp.govUsername
                        : emp.govUsername}
                    </p>
                    <p className="text-[10px] text-[#8a8a80] font-mono">{emp.govUsername}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f2] text-[#6a6a60]">
                    {ROLE_LABEL[emp.role] ?? emp.role}
                  </span>
                  <ArrowUpRight size={12} className="text-[#c4c4b8]" />
                </div>
              </button>
            ))}
            {myStaff.length > 5 && (
              <button
                type="button"
                onClick={() => navigate("/operations/staff")}
                className="w-full px-5 py-3 text-center text-[12px] text-[#8a8a80] hover:text-[#1a1a18] hover:bg-[#fafaf8] transition-colors cursor-pointer"
              >
                +{myStaff.length - 5} more — View all staff
              </button>
            )}
            {myStaff.length === 0 && (
              <div className="py-8 flex flex-col items-center gap-1.5 text-[#c4c4b8]">
                <Users size={18} />
                <p className="text-[12px]">No staff assigned to this office</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
