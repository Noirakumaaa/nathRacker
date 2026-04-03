import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { labelCls, inputCls } from "component/styleConfig";
import { Req, Opt } from "component/LabelStyle";
import { SectionHeader, PanelHeader, SubmitRow } from "./shared";
import type { Lgu, Barangay, OperationsOffice } from "./types";

const empty = {
  firstName: "",
  lastName: "",
  middleName: "",
  govUsername: "",
  email: "",
  password: "",
  phone: "",
  role: "" as "ENCODER" | "ADMIN" | "",
  assignedOperationId: "" as number | "",
  assignedLGUID: "" as number | "",
  assignedBarangayId: "" as number | "",
};

const numberFields = ["assignedOperationId", "assignedLGUID", "assignedBarangayId"];

const ROLES = [
  { value: "ENCODER",  label: "ENCODER",  desc: "Can input and manage records" },
  { value: "ADMIN",    label: "ADMIN",     desc: "Full system access" },
  { value: "VERIFIER", label: "VERIFIER",  desc: "Can verify records" },
  { value: "AC",       label: "AC",        desc: "Area coordinator" },
  { value: "SWOII",    label: "SWOII",     desc: "Social welfare officer" },
];

export default function RegisterTab() {
  const { show } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [form, setForm] = useState(empty);
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data } = useQuery({
    queryKey: ["assignedArea"],
    queryFn: async () => (await APIFETCH.get("/admin/get/assignedArea")).data,
  });

  const offices: OperationsOffice[] = data?.operations ?? [];
  const filteredLgus = (data?.lgu ?? []).filter(
    (l: Lgu) => form.assignedOperationId === "" || l.operationsOfficeNumId === form.assignedOperationId,
  );
  const filteredBarangays = (data?.barangay ?? []).filter(
    (b: Barangay) => form.assignedLGUID === "" || b.lguId === form.assignedLGUID,
  );
  const officeName = (id: number | "") => offices.find(o => o.id === id)?.name ?? "";
  const lguName    = (id: number | "") => (data?.lgu ?? []).find((l: Lgu) => l.id === id)?.name ?? "";

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const skip = ["email", "password", "govUsername"];
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

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      show("Passwords do not match.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await APIFETCH.post("/admin/register", form);
      if (res.data?.Register) {
        show(res.data.message ?? "Account created.", "success");
        setForm(empty);
        setConfirmPassword("");
      } else {
        show(res.data?.message ?? "Registration failed.", "error");
      }
    } catch {
      show("Error creating account.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 space-y-5">

      {/* Page header */}
      <div>
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-widest mb-0.5">Admin Management</p>
        <h1 className="text-[20px] font-semibold text-(--color-ink) tracking-tight">Register Account</h1>
      </div>

      <form onSubmit={submit} className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden">
        <PanelHeader label="New Account" />

        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Col 1: Personal ── */}
            <div className="space-y-4">
              <SectionHeader title="Personal Information" />
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>First Name <Req /></label>
                  <input name="firstName" value={form.firstName} onChange={handle} required className={inputCls} placeholder="First Name" />
                </div>
                <div>
                  <label className={labelCls}>Middle Name <Opt /></label>
                  <input name="middleName" value={form.middleName} onChange={handle} className={inputCls} placeholder="Middle Name" />
                </div>
                <div>
                  <label className={labelCls}>Last Name <Req /></label>
                  <input name="lastName" value={form.lastName} onChange={handle} required className={inputCls} placeholder="Last Name" />
                </div>
                <div>
                  <label className={labelCls}>Phone Number <Req /></label>
                  <input name="phone" value={form.phone} onChange={handle} required className={inputCls} placeholder="09XXXXXXXXX" />
                </div>
              </div>
            </div>

            {/* ── Col 2: Credentials ── */}
            <div className="space-y-4">
              <SectionHeader title="Account Credentials" />
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Government Username <Req /></label>
                  <input name="govUsername" value={form.govUsername} onChange={handle} required className={inputCls} placeholder="Gov Username" />
                </div>
                <div>
                  <label className={labelCls}>Email Address <Req /></label>
                  <input type="email" name="email" value={form.email} onChange={handle} required className={inputCls} placeholder="email@example.com" />
                </div>
                <div>
                  <label className={labelCls}>Password <Req /></label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      name="password" value={form.password} onChange={handle} required
                      className={inputCls + " pr-14"} placeholder="Password"
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-(--color-muted) hover:text-(--color-ink) uppercase tracking-wide transition-colors cursor-pointer bg-transparent border-none">
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirm Password <Req /></label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                      className={inputCls + " pr-14"} placeholder="Re-enter Password"
                    />
                    <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-(--color-muted) hover:text-(--color-ink) uppercase tracking-wide transition-colors cursor-pointer bg-transparent border-none">
                      {showConfirmPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Col 3: Role & Assignment ── */}
            <div className="space-y-4">
              <SectionHeader title="Role & Assignment" />
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Role <Req /></label>
                  <select name="role" value={form.role} onChange={handle} required className={inputCls}>
                    <option value="">Select Role</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  {form.role && (
                    <p className="text-[11px] text-(--color-muted) mt-1">
                      {ROLES.find(r => r.value === form.role)?.desc}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Operations Office <Req /></label>
                  <select name="assignedOperationId" value={form.assignedOperationId} onChange={handle} required className={inputCls}>
                    <option value="">Select Office</option>
                    {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Assigned LGU <Req /></label>
                  <select name="assignedLGUID" value={form.assignedLGUID} onChange={handle} required className={inputCls}>
                    <option value="">Select LGU</option>
                    {filteredLgus.map((l: Lgu) => (
                      <option key={l.id} value={l.id}>{l.name} — {officeName(l.operationsOfficeNumId)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Assigned Barangay <Req /></label>
                  <select name="assignedBarangayId" value={form.assignedBarangayId} onChange={handle} required className={inputCls}>
                    <option value="">Select Barangay</option>
                    {filteredBarangays.map((b: Barangay) => (
                      <option key={b.id} value={b.id}>{b.name} — {lguName(b.lguId)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Submit */}
          <div className="mt-6 pt-5 border-t border-(--color-border)">
            <SubmitRow
              loading={loading}
              submitLabel="Create Account"
              onCancel={() => { setForm(empty); setConfirmPassword(""); }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
