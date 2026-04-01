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
  const lguName = (id: number | "") => (data?.lgu ?? []).find((l: Lgu) => l.id === id)?.name ?? "";

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const skip = ["email", "password", "govUsername"];
    const parsed = numberFields.includes(name)
      ? value === "" ? "" : Number(value)
      : skip.includes(name) ? value : value.toUpperCase();
    setForm((p) => {
      const next = { ...p, [name]: parsed };
      if (name === "assignedOperationId") { next.assignedLGUID = ""; next.assignedBarangayId = ""; }
      if (name === "assignedLGUID") { next.assignedBarangayId = ""; }
      return next;
    });
  };

  const submit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mb-6">
        <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">Admin Management</p>
        <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">Register Account</h1>
      </div>
    <form onSubmit={submit} className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden">
      <PanelHeader label="Register New Account" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Col 1 — Personal */}
          <div className="space-y-4">
            <SectionHeader title="Personal Information" />
            <div className="space-y-3.5">
              <div>
                <label className={labelCls}>First Name <Req /></label>
                <input name="firstName" value={form.firstName} onChange={handle} required className={inputCls} placeholder="Enter First Name" />
              </div>
              <div>
                <label className={labelCls}>Middle Name <Opt /></label>
                <input name="middleName" value={form.middleName} onChange={handle} className={inputCls} placeholder="Enter Middle Name" />
              </div>
              <div>
                <label className={labelCls}>Last Name <Req /></label>
                <input name="lastName" value={form.lastName} onChange={handle} required className={inputCls} placeholder="Enter Last Name" />
              </div>
              <div>
                <label className={labelCls}>Phone Number <Req /></label>
                <input name="phone" value={form.phone} onChange={handle} required className={inputCls} placeholder="09XXXXXXXXX" />
              </div>
            </div>
          </div>

          {/* Col 2 — Credentials */}
          <div className="space-y-4">
            <SectionHeader title="Account Credentials" />
            <div className="space-y-3.5">
              <div>
                <label className={labelCls}>Government Username <Req /></label>
                <input name="govUsername" value={form.govUsername} onChange={handle} required className={inputCls} placeholder="Enter Gov Username" />
              </div>
              <div>
                <label className={labelCls}>Email Address <Req /></label>
                <input type="email" name="email" value={form.email} onChange={handle} required className={inputCls} placeholder="Enter Email" />
              </div>
              <div>
                <label className={labelCls}>Password <Req /></label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password" value={form.password} onChange={handle} required
                    className={inputCls + " pr-12"} placeholder="Enter Password"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#8a8a80] hover:text-[#1a1a18] uppercase tracking-wide transition-colors">
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
                    className={inputCls + " pr-12"} placeholder="Re-enter Password"
                  />
                  <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#8a8a80] hover:text-[#1a1a18] uppercase tracking-wide transition-colors">
                    {showConfirmPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3 — Role & Assignment */}
          <div className="space-y-4">
            <SectionHeader title="Role & Assignment" />
            <div className="space-y-3.5">
              <div>
                <label className={labelCls}>Role <Req /></label>
                <select name="role" value={form.role} onChange={handle} required className={inputCls}>
                  <option value="">Select Role</option>
                  <option value="ENCODER">ENCODER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Operations Office <Req /></label>
                <select name="assignedOperationId" value={form.assignedOperationId} onChange={handle} required className={inputCls}>
                  <option value="">Select Office</option>
                  {data?.operations?.map((o: OperationsOffice) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
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

              <div className="rounded-lg border border-[#e8e8e0] bg-[#f8f8f4] p-3">
                <p className="text-[10px] font-semibold text-[#8a8a80] uppercase tracking-wider mb-1.5">Role Reference</p>
                <div className="space-y-1">
                  {[["ENCODER", "Can input and manage records"], ["ADMIN", "Full system access"]].map(([r, d]) => (
                    <div key={r} className="flex items-start gap-2">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#1a1a18] shrink-0" />
                      <p className="text-[11px] text-[#1a1a18]"><span className="font-semibold">{r}</span> — {d}</p>
                    </div>
                  ))}
                </div>
              </div>

              <SubmitRow loading={loading} submitLabel="Create Account" onCancel={() => { setForm(empty); setConfirmPassword(""); }} cancelLabel="Clear" />
            </div>
          </div>

        </div>
      </div>
    </form>
    </div>
  );
}
