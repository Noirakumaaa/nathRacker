import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
  ArrowUpRight,
  CheckCircle2,
  TriangleAlert,
  CalendarDays,
  FileStack,
} from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type {
  OperationsOffice,
  Lgu,
  Barangay,
  Employee,
} from "~/adminSettings/types";
import type { me } from "~/types/authTypes";
import { useMonthlySummary } from "component/Usemonthlysummary";
import { MONTHS } from "~/types/SummaryType";

type AreaData = {
  operations: OperationsOffice[];
  lgu: Lgu[];
  barangay: Barangay[];
};

type GlobalRecord = {
  id: number;
  govUsername: string;
  remarks: string;
};

type OperationCountItem = {
  remarks: string;
  count: number;
};

type OperationCountResponse = {
  result: OperationCountItem[];
  total: number;
};

const ROLE_LABEL: Record<string, string> = {
  ENCODER: "Encoder",
  ADMIN: "Admin",
  AREA_COORDINATOR: "Area Coordinator",
  SOCIAL_WORKER_III: "Social Worker III",
};

// ── Month filter pills ────────────────────────────────────────────────────────
function MonthFilter({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (m: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {[{ label: "Overall", value: 0 }, ...MONTHS.map((m, i) => ({ label: m.slice(0, 3), value: i + 1 }))].map(
        ({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer border ${
              selected === value
                ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
                : "bg-transparent text-(--color-muted) border-(--color-border) hover:border-(--color-ink) hover:text-(--color-ink)"
            }`}
          >
            {label}
          </button>
        ),
      )}
    </div>
  );
}

// ── Big metric card ───────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  sub,
  accent,
  icon: Icon,
  loading,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent: "emerald" | "blue" | "amber" | "slate";
  icon: React.ElementType;
  loading?: boolean;
}) {
  const styles = {
    emerald: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600", num: "text-emerald-600" },
    blue: { iconBg: "bg-blue-50", iconColor: "text-blue-600", num: "text-blue-600" },
    amber: { iconBg: "bg-amber-50", iconColor: "text-amber-500", num: "text-amber-500" },
    slate: { iconBg: "bg-(--color-subtle)", iconColor: "text-(--color-muted)", num: "text-(--color-ink)" },
  }[accent];

  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-5 flex flex-col gap-3">
      <div className={`w-9 h-9 ${styles.iconBg} rounded-lg flex items-center justify-center`}>
        <Icon size={16} className={styles.iconColor} />
      </div>
      <div>
        <p className={`text-[30px] font-bold leading-none ${styles.num}`}>
          {loading ? <span className="text-[20px] text-(--color-muted)">—</span> : value}
        </p>
        <p className="text-[14px] font-medium text-(--color-ink) mt-1">{label}</p>
        {sub && <p className="text-[12px] text-(--color-muted) mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Small area stat ───────────────────────────────────────────────────────────
function AreaStat({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-4 py-3.5 flex items-center gap-3">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
        <Icon size={14} className={iconColor} />
      </div>
      <div>
        <p className="text-[20px] font-bold text-(--color-ink) leading-none">{value}</p>
        <p className="text-[12px] text-(--color-muted) mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── LGU card ──────────────────────────────────────────────────────────────────
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
    <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-(--color-border) flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Landmark size={14} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-(--color-ink)">{lgu.name}</p>
            <p className="text-[11px] text-(--color-muted)">LGU #{lgu.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-(--color-muted) bg-(--color-subtle) px-2.5 py-0.5 rounded-full">
            {barangays.length} brgy
          </span>
          <span className="text-[11px] text-(--color-muted) bg-(--color-subtle) px-2.5 py-0.5 rounded-full">
            {members.length} staff
          </span>
        </div>
      </div>

      {members.length > 0 && (
        <div className="px-4 py-2.5 border-b border-(--color-border) flex items-center gap-1.5 flex-wrap">
          <Users size={11} className="text-(--color-muted) shrink-0" />
          {members.map((e) => (
            <span
              key={e.id}
              className="text-[11px] bg-(--color-subtle) text-(--color-muted) px-2 py-0.5 rounded-full"
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
        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-(--color-bg) transition-colors cursor-pointer"
      >
        <span className="text-[12px] font-medium text-(--color-muted) flex items-center gap-1.5">
          <MapPin size={11} />
          Barangays ({barangays.length})
        </span>
        {expanded ? (
          <ChevronDown size={13} className="text-(--color-muted)" />
        ) : (
          <ChevronRight size={13} className="text-(--color-muted)" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-3 grid grid-cols-2 gap-1.5">
          {barangays.length === 0 ? (
            <p className="col-span-2 text-[12px] text-(--color-muted) text-center py-2">
              No barangays registered
            </p>
          ) : (
            barangays.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-(--color-bg) border border-(--color-border)"
              >
                <MapPin size={10} className="text-(--color-muted) shrink-0" />
                <span className="text-[12px] text-(--color-ink) truncate">{b.name}</span>
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

  const [selectedMonth, setSelectedMonth] = useState(0); // 0 = overall

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

  const { data: allRecords = [] } = useQuery<GlobalRecord[]>({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      const res = await APIFETCH.get("/alldocuments/globalRecords");
      return res.data;
    },
  });

  const { data: OperationsDocumentCount } = useQuery({
    queryKey: ["OPERATIONDOCUMENT"],
    queryFn: async () => {
      const res = await APIFETCH.get<OperationCountResponse>(
        "/alldocuments/count/OperationDashboard",
      );
      return res.data;
    },
  });

  const monthForQuery = selectedMonth > 0 ? selectedMonth : now.getMonth() + 1;
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlySummary(
    monthForQuery,
    now.getFullYear(),
  );

  const isLoading = areaLoading || empLoading;

  const selfRecord = employees.find((e) => e.govUsername === userData.govUsername);
  const myOfficeId = selfRecord?.userInfo?.assignedOperationId ?? null;

  const offices = areaData?.operations ?? [];
  const allLgus = areaData?.lgu ?? [];
  const allBarangays = areaData?.barangay ?? [];

  const myOffice = offices.find((o) => o.id === myOfficeId) ?? null;
  const myLgus =
    myOfficeId !== null
      ? allLgus.filter((l) => l.operationsOfficeNumId === myOfficeId)
      : [];
  const myStaff =
    myOfficeId !== null
      ? employees.filter((e) => e.userInfo?.assignedOperationId === myOfficeId)
      : [];

  const myStaffUsernames = useMemo(
    () => new Set(myStaff.map((e) => e.govUsername)),
    [myStaff],
  );

  const myRecords = useMemo(
    () => allRecords.filter((r) => myStaffUsernames.has(r.govUsername)),
    [allRecords, myStaffUsernames],
  );

  const getBarangaysForLgu = (lguId: number) =>
    allBarangays.filter((b) => b.lguId === lguId);

  const getMembersForLgu = (lguId: number) =>
    myStaff.filter((e) => e.userInfo?.assignedLGUID === lguId);

  const totalBarangays = myLgus.reduce(
    (sum, l) => sum + getBarangaysForLgu(l.id).length,
    0,
  );

  // Stats based on selected period
  const stats =
    selectedMonth === 0
      ? {
          total: OperationsDocumentCount?.total ?? 0,
          encoded:
            OperationsDocumentCount?.result.find((r) => r.remarks === "YES")?.count ?? 0,
          updated:
            OperationsDocumentCount?.result.find((r) => r.remarks === "UPDATED")?.count ?? 0,
          issues:
            OperationsDocumentCount?.result.find((r) => r.remarks === "NO")?.count ?? 0,
          loading: false,
        }
      : {
          total:
            (monthlyData?.totals.encoded ?? 0) +
            (monthlyData?.totals.updated ?? 0) +
            (monthlyData?.totals.issue ?? 0),
          encoded: monthlyData?.totals.encoded ?? 0,
          updated: monthlyData?.totals.updated ?? 0,
          issues: monthlyData?.totals.issue ?? 0,
          loading: monthlyLoading,
        };

  if (isLoading) {
    return (
      <main className="p-6 bg-(--color-bg) font-sans antialiased">
        <div className="flex items-center gap-2 text-(--color-muted)">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[13px]">Loading office data…</span>
        </div>
      </main>
    );
  }

  if (myOfficeId === null) {
    return (
      <main className="p-6 bg-(--color-bg) font-sans antialiased">
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-8 max-w-md flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <p className="text-[15px] font-semibold text-(--color-ink)">No Office Assigned</p>
          <p className="text-[13px] text-(--color-muted)">
            You have not been assigned to an operations office yet. Contact your
            administrator to set up your area assignment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-(--color-bg) min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-6">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1.5 self-start text-[12px] font-medium text-(--color-muted) bg-(--color-subtle) border border-(--color-border) px-2.5 py-1 rounded-full">
            {ROLE_LABEL[userData.role] ?? userData.role}
          </span>
          <h1 className="text-[24px] font-bold text-(--color-ink) tracking-tight leading-none">
            My Office
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-5 h-5 rounded-md bg-(--color-ink) flex items-center justify-center shrink-0">
              <Building2 size={11} className="text-white" />
            </div>
            <p className="text-[14px] font-medium text-(--color-ink)">
              {myOffice?.name ?? `Office #${myOfficeId}`}
            </p>
            <span className="text-[11px] text-(--color-muted) bg-(--color-subtle) px-2 py-0.5 rounded-full">
              ID #{myOfficeId}
            </span>
          </div>
        </div>

        {/* ── Area overview ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <AreaStat
            label="LGUs"
            value={myLgus.length}
            icon={Landmark}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <AreaStat
            label="Barangays"
            value={totalBarangays}
            icon={MapPin}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <AreaStat
            label="Staff"
            value={myStaff.length}
            icon={Users}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
          />
        </div>

        {/* ── Records section ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Section header + filter */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-(--color-muted)" />
              <h2 className="text-[15px] font-semibold text-(--color-ink)">Records</h2>
              <span className="text-[13px] text-(--color-muted)">
                —{" "}
                {selectedMonth === 0
                  ? "All time"
                  : `${MONTHS[selectedMonth - 1]} ${now.getFullYear()}`}
              </span>
              {stats.loading && (
                <Loader2 size={12} className="animate-spin text-(--color-muted)" />
              )}
            </div>
            <MonthFilter selected={selectedMonth} onChange={setSelectedMonth} />
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              label="Total Handled"
              value={stats.total}
              sub={selectedMonth === 0 ? "All-time records" : `In ${MONTHS[selectedMonth - 1]}`}
              accent="slate"
              icon={FileStack}
              loading={stats.loading}
            />
            <MetricCard
              label="Encoded"
              value={stats.encoded}
              sub="Successfully encoded"
              accent="emerald"
              icon={CheckCircle2}
              loading={stats.loading}
            />
            <MetricCard
              label="Updated"
              value={stats.updated}
              sub="Records updated"
              accent="blue"
              icon={CheckCircle2}
              loading={stats.loading}
            />
            <MetricCard
              label="Issues"
              value={stats.issues}
              sub="Records with issues"
              accent="amber"
              icon={TriangleAlert}
              loading={stats.loading}
            />
          </div>
        </div>

        {/* ── LGUs & Barangays ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark size={15} className="text-(--color-muted)" />
              <h2 className="text-[15px] font-semibold text-(--color-ink)">LGUs & Barangays</h2>
              <span className="text-[12px] text-(--color-muted) bg-(--color-subtle) px-2.5 py-0.5 rounded-full">
                {myLgus.length} LGU{myLgus.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {myLgus.length === 0 ? (
            <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-12 flex flex-col items-center gap-2 text-(--color-muted)">
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

        {/* ── Staff ───────────────────────────────────────────────────────────── */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-(--color-border) flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-(--color-muted)" />
              <h2 className="text-[15px] font-semibold text-(--color-ink)">Staff</h2>
              <span className="text-[12px] text-(--color-muted) bg-(--color-subtle) px-2.5 py-0.5 rounded-full">
                {myStaff.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/operations/staff")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-(--color-ink) hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none"
            >
              View All
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-(--color-border)">
            {myStaff.slice(0, 5).map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => navigate(`/operations/staff/${emp.govUsername}`)}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-(--color-bg) transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-(--color-subtle) flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-bold text-(--color-muted)">
                      {emp.govUsername[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-(--color-ink)">
                      {emp.userInfo
                        ? `${emp.userInfo.firstName} ${emp.userInfo.lastName}`.trim() ||
                          emp.govUsername
                        : emp.govUsername}
                    </p>
                    <p className="text-[11px] text-(--color-muted)">{emp.govUsername}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-(--color-subtle) text-(--color-muted)">
                    {ROLE_LABEL[emp.role] ?? emp.role}
                  </span>
                  <ArrowUpRight size={12} className="text-(--color-muted)" />
                </div>
              </button>
            ))}

            {myStaff.length > 5 && (
              <button
                type="button"
                onClick={() => navigate("/operations/staff")}
                className="w-full px-5 py-3 text-center text-[13px] text-(--color-muted) hover:text-(--color-ink) hover:bg-(--color-bg) transition-colors cursor-pointer"
              >
                +{myStaff.length - 5} more — View all staff
              </button>
            )}

            {myStaff.length === 0 && (
              <div className="py-10 flex flex-col items-center gap-2 text-(--color-muted)">
                <Users size={20} />
                <p className="text-[13px]">No staff assigned to this office</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
