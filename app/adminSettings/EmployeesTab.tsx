import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, User, X, ChevronRight, Filter, Loader2 } from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { labelCls, inputCls } from "component/styleConfig";
import { Req, Opt } from "component/LabelStyle";
import { SectionHeader, SubmitRow } from "./shared";
import type { OperationsOffice, Lgu, Barangay, Employee } from "./types";

const numberFields = ["assignedOperationId", "assignedLGUID", "assignedBarangayId"];

const roleBadge = (role: string) =>
  role === "ADMIN"
    ? "bg-violet-50 text-violet-600 border border-violet-200"
    : role === "ENCODER"
    ? "bg-sky-50 text-sky-600 border border-sky-200"
    : "bg-(--color-subtle) text-(--color-muted) border border-(--color-border)";

export default function EmployeesTab() {
  const { show } = useToastStore();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [filterOffice, setFilterOffice] = useState<number | "">("");
  const [filterLgu, setFilterLgu] = useState<number | "">("");
  const [filterBarangay, setFilterBarangay] = useState<number | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", middleName: "", phone: "",
    role: "" as "ENCODER" | "ADMIN" | "",
    assignedOperationId: "" as number | "",
    assignedLGUID: "" as number | "",
    assignedBarangayId: "" as number | "",
  });

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => (await APIFETCH.get("/admin/employees")).data,
  });

  const { data: areaData } = useQuery({
    queryKey: ["assignedArea"],
    queryFn: async () => (await APIFETCH.get("/admin/get/assignedArea")).data,
  });

  const offices: OperationsOffice[] = areaData?.operations ?? [];
  const lgus: Lgu[]                 = areaData?.lgu       ?? [];
  const barangays: Barangay[]       = areaData?.barangay  ?? [];

  const officeName = (id: number | null | undefined) => offices.find(o => o.id === id)?.name ?? "";
  const lguName    = (id: number | null | undefined) => lgus.find(l => l.id === id)?.name    ?? "";

  const filterableLgus      = filterOffice === "" ? lgus      : lgus.filter(l => l.operationsOfficeNumId === filterOffice);
  const filterableBarangays = filterLgu    === "" ? barangays : barangays.filter(b => b.lguId === filterLgu);

  const filteredEmployees = employees.filter(emp => {
    const q = search.toLowerCase();
    const matchSearch =
      emp.govUsername.toLowerCase().includes(q) ||
      emp.userInfo?.firstName?.toLowerCase().includes(q) ||
      emp.userInfo?.lastName?.toLowerCase().includes(q);
    const matchOffice   = filterOffice   === "" || emp.userInfo?.assignedOperationId === filterOffice;
    const matchLgu      = filterLgu      === "" || emp.userInfo?.assignedLGUID        === filterLgu;
    const matchBarangay = filterBarangay === "" || emp.userInfo?.assignedBarangayId   === filterBarangay;
    return matchSearch && matchOffice && matchLgu && matchBarangay;
  });

  const hasActiveFilters = filterOffice !== "" || filterLgu !== "" || filterBarangay !== "";
  const clearFilters = () => { setFilterOffice(""); setFilterLgu(""); setFilterBarangay(""); };

  const filteredLgus      = form.assignedOperationId === "" ? lgus      : lgus.filter(l => l.operationsOfficeNumId === form.assignedOperationId);
  const filteredBarangays = form.assignedLGUID        === "" ? barangays : barangays.filter(b => b.lguId === form.assignedLGUID);

  const selectEmployee = (emp: Employee) => {
    setSelected(emp);
    setForm({
      firstName:          emp.userInfo?.firstName          ?? "",
      lastName:           emp.userInfo?.lastName           ?? "",
      middleName:         emp.userInfo?.middleName         ?? "",
      phone:              emp.userInfo?.phone              ?? "",
      role:               emp.role,
      assignedOperationId: emp.userInfo?.assignedOperationId ?? "",
      assignedLGUID:       emp.userInfo?.assignedLGUID        ?? "",
      assignedBarangayId:  emp.userInfo?.assignedBarangayId   ?? "",
    });
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const skip = ["role"];
    const parsed = numberFields.includes(name)
      ? value === "" ? "" : Number(value)
      : skip.includes(name) ? value : value.toUpperCase();
    setForm(p => {
      const next = { ...p, [name]: parsed };
      if (name === "assignedOperationId") { next.assignedLGUID = ""; next.assignedBarangayId = ""; }
      if (name === "assignedLGUID") { next.assignedBarangayId = ""; }
      return next;
    });
  };

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: async () => {
      await APIFETCH.patch(`/admin/employee/${selected!.id}`, {
        ...form,
        assignedOperationId: form.assignedOperationId === "" ? null : form.assignedOperationId,
        assignedLGUID:       form.assignedLGUID        === "" ? null : form.assignedLGUID,
        assignedBarangayId:  form.assignedBarangayId   === "" ? null : form.assignedBarangayId,
      });
    },
    onSuccess: () => {
      show("Employee updated.", "success");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setSelected(null);
    },
    onError: () => show("Error updating employee.", "error"),
  });

  const initials = (emp: Employee) => {
    const f = emp.userInfo?.firstName?.[0] ?? "";
    const l = emp.userInfo?.lastName?.[0]  ?? "";
    return (f + l).toUpperCase() || emp.govUsername[0].toUpperCase();
  };

  return (
    <div className="px-6 py-6 space-y-5">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">Admin Management</p>
          <h1 className="text-[20px] font-semibold text-(--color-ink) tracking-tight">Employees</h1>
        </div>
        <p className="text-[12px] text-(--color-muted)">{employees.length} total</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── Left: List ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">

          {/* Search + filter toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted) pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={inputCls + " pl-8"}
                placeholder="Search name or username…"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(v => !v)}
              className={`h-10 px-3 rounded-lg border text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                showFilters || hasActiveFilters
                  ? "bg-(--color-ink) text-(--color-bg) border-(--color-ink)"
                  : "bg-(--color-surface) text-(--color-muted) border-(--color-border) hover:border-(--color-ink) hover:text-(--color-ink)"
              }`}
            >
              <Filter size={12} />
              Filter
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-white/20 text-[9px] font-bold flex items-center justify-center">
                  {[filterOffice, filterLgu, filterBarangay].filter(f => f !== "").length}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="bg-(--color-surface) rounded-xl border border-(--color-border) p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">Filter by Area</p>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters}
                    className="text-[10px] text-(--color-muted) hover:text-(--color-ink) flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none">
                    <X size={10} /> Clear all
                  </button>
                )}
              </div>
              <div>
                <label className={labelCls}>Operations Office</label>
                <select value={filterOffice}
                  onChange={e => { setFilterOffice(e.target.value === "" ? "" : Number(e.target.value)); setFilterLgu(""); setFilterBarangay(""); }}
                  className={inputCls}>
                  <option value="">All Offices</option>
                  {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>LGU</label>
                <select value={filterLgu}
                  onChange={e => { setFilterLgu(e.target.value === "" ? "" : Number(e.target.value)); setFilterBarangay(""); }}
                  className={inputCls}>
                  <option value="">All LGUs</option>
                  {filterableLgus.map(l => <option key={l.id} value={l.id}>{l.name} — {officeName(l.operationsOfficeNumId)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Barangay</label>
                <select value={filterBarangay}
                  onChange={e => setFilterBarangay(e.target.value === "" ? "" : Number(e.target.value))}
                  className={inputCls}>
                  <option value="">All Barangays</option>
                  {filterableBarangays.map(b => <option key={b.id} value={b.id}>{b.name} — {lguName(b.lguId)}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Employee list */}
          <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">
            <div className="px-4 py-3 border-b border-(--color-border) flex items-center justify-between">
              <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">
                {filteredEmployees.length} {filteredEmployees.length === 1 ? "Employee" : "Employees"}
              </p>
              {(search || hasActiveFilters) && (
                <button type="button" onClick={() => { setSearch(""); clearFilters(); }}
                  className="text-[10px] text-(--color-muted) hover:text-(--color-ink) flex items-center gap-1 transition-colors cursor-pointer bg-transparent border-none">
                  <X size={10} /> Clear
                </button>
              )}
            </div>

            <div className="divide-y divide-(--color-border) max-h-128 overflow-y-auto">
              {isLoading && (
                <div className="py-12 flex flex-col items-center gap-2 text-(--color-muted)">
                  <Loader2 size={18} className="animate-spin" />
                  <p className="text-[11px]">Loading employees…</p>
                </div>
              )}
              {!isLoading && filteredEmployees.length === 0 && (
                <div className="py-12 flex flex-col items-center gap-2 text-(--color-muted)">
                  <User size={22} className="opacity-30" />
                  <p className="text-[12px]">{search || hasActiveFilters ? "No results found." : "No employees yet."}</p>
                </div>
              )}
              {filteredEmployees.map(emp => {
                const isSelected = selected?.id === emp.id;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => selectEmployee(emp)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected ? "bg-(--color-ink)" : "hover:bg-(--color-subtle)"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      isSelected ? "bg-white/15 text-white" : "bg-(--color-subtle) text-(--color-ink)"
                    }`}>
                      {initials(emp)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold truncate ${isSelected ? "text-white" : "text-(--color-ink)"}`}>
                        {emp.userInfo?.firstName} {emp.userInfo?.lastName}
                      </p>
                      <p className={`text-[11px] truncate ${isSelected ? "text-white/55" : "text-(--color-muted)"}`}>
                        {emp.govUsername}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isSelected ? "bg-white/15 text-white" : roleBadge(emp.role)
                    }`}>
                      {emp.role}
                    </span>
                    <ChevronRight size={12} className={`shrink-0 ${isSelected ? "text-white/30" : "text-(--color-placeholder)"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: Edit Panel ── */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-(--color-surface) rounded-xl border border-(--color-border) h-full min-h-64 flex flex-col items-center justify-center gap-3 text-(--color-muted)">
              <div className="w-12 h-12 rounded-full bg-(--color-subtle) flex items-center justify-center">
                <User size={20} className="opacity-30" />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-medium text-(--color-ink)">No employee selected</p>
                <p className="text-[11px] mt-0.5">Select from the list to edit their details.</p>
              </div>
            </div>
          ) : (
            <div className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">

              {/* Edit header */}
              <div className="px-5 py-4 border-b border-(--color-border) flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-(--color-ink) flex items-center justify-center text-[12px] font-bold text-(--color-bg) shrink-0">
                    {initials(selected)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-(--color-ink)">
                      {selected.userInfo?.firstName} {selected.userInfo?.lastName}
                    </p>
                    <p className="text-[11px] text-(--color-muted)">{selected.email}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSelected(null)}
                  className="w-7 h-7 rounded-lg border border-(--color-border) flex items-center justify-center text-(--color-muted) hover:text-(--color-ink) hover:border-(--color-ink) transition-colors cursor-pointer bg-transparent">
                  <X size={13} />
                </button>
              </div>

              <form onSubmit={e => { e.preventDefault(); save(); }} className="p-5 space-y-5">

                {/* Personal */}
                <div>
                  <SectionHeader title="Personal Information" />
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>First Name <Req /></label>
                      <input name="firstName" value={form.firstName} onChange={handle} required className={inputCls} placeholder="First Name" />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name <Req /></label>
                      <input name="lastName" value={form.lastName} onChange={handle} required className={inputCls} placeholder="Last Name" />
                    </div>
                    <div>
                      <label className={labelCls}>Middle Name <Opt /></label>
                      <input name="middleName" value={form.middleName} onChange={handle} className={inputCls} placeholder="Middle Name" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone <Req /></label>
                      <input name="phone" value={form.phone} onChange={handle} required className={inputCls} placeholder="09XXXXXXXXX" />
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <SectionHeader title="Role" />
                  <div className="mt-3">
                    <label className={labelCls}>Role <Req /></label>
                    <select name="role" value={form.role} onChange={handle} required className={inputCls}>
                      <option value="">Select Role</option>
                      <option value="ENCODER">ENCODER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>

                {/* Assignment */}
                <div>
                  <SectionHeader title="Area Assignment" />
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className={labelCls}>Operations Office <Opt /></label>
                      <select name="assignedOperationId" value={form.assignedOperationId} onChange={handle} className={inputCls}>
                        <option value="">Select Office</option>
                        {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>LGU <Opt /></label>
                        <select name="assignedLGUID" value={form.assignedLGUID} onChange={handle} className={inputCls}>
                          <option value="">Select LGU</option>
                          {filteredLgus.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Barangay <Opt /></label>
                        <select name="assignedBarangayId" value={form.assignedBarangayId} onChange={handle} className={inputCls}>
                          <option value="">Select Barangay</option>
                          {filteredBarangays.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <SubmitRow loading={saving} submitLabel="Save Changes" onCancel={() => setSelected(null)} cancelLabel="Cancel" />
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
