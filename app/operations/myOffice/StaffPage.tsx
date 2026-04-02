import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  MapPin,
  Landmark,
  Search,
  X,
} from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import type { Lgu, Barangay, Employee, OperationsOffice } from "~/adminSettings/types";
import type { me } from "~/types/authTypes";

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

const ROLE_COLOR: Record<string, string> = {
  ENCODER: "bg-indigo-50 text-indigo-600",
  ADMIN: "bg-purple-50 text-purple-600",
  AREA_COORDINATOR: "bg-emerald-50 text-emerald-600",
  SOCIAL_WORKER_III: "bg-sky-50 text-sky-600",
};

// ── Staff card ────────────────────────────────────────────────────────────────
function StaffCard({
  emp,
  lgu,
  barangay,
  onClick,
}: {
  emp: Employee;
  lgu: Lgu | undefined;
  barangay: Barangay | undefined;
  onClick: () => void;
}) {
  const fullName = emp.userInfo
    ? `${emp.userInfo.firstName} ${emp.userInfo.lastName}`.trim()
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-(--color-surface) border border-(--color-border) rounded-xl p-4 text-left hover:border-(--color-ink) hover:shadow-sm transition-all duration-150 cursor-pointer group"
    >
      {/* Avatar + name */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-(--color-subtle) flex items-center justify-center shrink-0 group-hover:bg-(--color-ink) transition-colors">
            <span className="text-[14px] font-bold text-[#6a6a60] group-hover:text-white transition-colors">
              {emp.govUsername[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-(--color-ink) truncate">
              {fullName || emp.govUsername}
            </p>
            <p className="text-[10px] text-(--color-muted) font-mono">{emp.govUsername}</p>
          </div>
        </div>
        <ArrowUpRight
          size={14}
          className="text-(--color-placeholder) group-hover:text-(--color-ink) transition-colors shrink-0 mt-0.5"
        />
      </div>

      {/* Role badge */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            ROLE_COLOR[emp.role] ?? "bg-(--color-subtle) text-[#6a6a60]"
          }`}
        >
          {ROLE_LABEL[emp.role] ?? emp.role}
        </span>
      </div>

      {/* Area assignment */}
      <div className="mt-2.5 space-y-1">
        {lgu ? (
          <div className="flex items-center gap-1.5 text-[11px] text-(--color-muted)">
            <Landmark size={10} className="text-(--color-placeholder) shrink-0" />
            <span className="truncate">{lgu.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-(--color-placeholder)">
            <Landmark size={10} className="shrink-0" />
            <span>No LGU assigned</span>
          </div>
        )}
        {barangay ? (
          <div className="flex items-center gap-1.5 text-[11px] text-(--color-muted)">
            <MapPin size={10} className="text-(--color-placeholder) shrink-0" />
            <span className="truncate">{barangay.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-(--color-placeholder)">
            <MapPin size={10} className="shrink-0" />
            <span>No barangay assigned</span>
          </div>
        )}
      </div>

      {/* Contact */}
      {emp.userInfo?.phone && (
        <p className="mt-2 text-[10px] text-[#b8b8b0] font-mono">{emp.userInfo.phone}</p>
      )}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StaffPage({ userData }: { userData: me }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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

  const myOffice = offices.find((o) => o.id === myOfficeId);
  const myStaff = myOfficeId !== null
    ? employees.filter((e) => e.userInfo?.assignedOperationId === myOfficeId)
    : [];

  const filteredStaff = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return myStaff;
    return myStaff.filter((e) => {
      const fullName = e.userInfo
        ? `${e.userInfo.firstName} ${e.userInfo.lastName}`.toLowerCase()
        : "";
      return (
        e.govUsername.toLowerCase().includes(q) ||
        fullName.includes(q) ||
        (ROLE_LABEL[e.role] ?? e.role).toLowerCase().includes(q)
      );
    });
  }, [myStaff, search]);

  const getLgu = (lguId: number | null | undefined) =>
    lguId != null ? allLgus.find((l) => l.id === lguId) : undefined;

  const getBarangay = (barangayId: number | null | undefined) =>
    barangayId != null ? allBarangays.find((b) => b.id === barangayId) : undefined;

  if (isLoading) {
    return (
      <main className="p-6 bg-(--color-bg) min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-(--color-muted)">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-[13px]">Loading staff…</span>
        </div>
      </main>
    );
  }

  if (myOfficeId === null) {
    return (
      <main className="p-6 bg-(--color-bg) min-h-screen flex items-center justify-center">
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl p-8 max-w-md w-full flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <p className="text-[15px] font-semibold text-(--color-ink)">No Office Assigned</p>
          <p className="text-[13px] text-(--color-muted)">
            You are not assigned to an operations office yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-(--color-bg) min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-5">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <button
                type="button"
                onClick={() => navigate("/operations/my-office")}
                className="text-[11px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
              >
                My Office
              </button>
              <span className="text-(--color-placeholder) text-[11px]">/</span>
              <span className="text-[11px] text-(--color-ink) font-medium">Staff</span>
            </div>
            <h1 className="text-[22px] font-semibold text-(--color-ink) tracking-tight">
              Staff
            </h1>
            {myOffice && (
              <p className="text-[12px] text-(--color-muted) mt-0.5">{myOffice.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-(--color-surface) border border-(--color-border) rounded-xl px-4 py-2.5">
            <Users size={14} className="text-(--color-muted)" />
            <span className="text-[13px] font-semibold text-(--color-ink)">{myStaff.length}</span>
            <span className="text-[12px] text-(--color-muted)">members</span>
          </div>
        </div>

        {/* ── Search bar ───────────────────────────────────────────────────── */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8b8b0] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username, or role…"
            className="w-full pl-9 pr-9 py-2.5 text-[13px] border border-(--color-border) rounded-xl text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-ink) focus:border-transparent hover:border-(--color-border-hover) transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8b8b0] hover:text-[#6a6a60] transition-colors cursor-pointer bg-transparent border-none"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* ── Staff grid ───────────────────────────────────────────────────── */}
        {myStaff.length === 0 ? (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-16 flex flex-col items-center gap-2 text-(--color-placeholder)">
            <Users size={24} />
            <p className="text-[13px]">No staff assigned to this office</p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-(--color-surface) border border-(--color-border) rounded-xl py-16 flex flex-col items-center gap-2 text-(--color-placeholder)">
            <Search size={22} />
            <p className="text-[13px]">No staff match &ldquo;{search}&rdquo;</p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-[12px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {search && (
              <p className="text-[12px] text-(--color-muted)">
                {filteredStaff.length} result{filteredStaff.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredStaff.map((emp) => (
                <StaffCard
                  key={emp.id}
                  emp={emp}
                  lgu={getLgu(emp.userInfo?.assignedLGUID)}
                  barangay={getBarangay(emp.userInfo?.assignedBarangayId)}
                  onClick={() => navigate(`/operations/staff/${emp.govUsername}`)}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
