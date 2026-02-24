import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layers, Loader2, InboxIcon, Copy } from "lucide-react";
import { get, post } from "component/fetchComponent";

// ── Types ────────────────────────────────────────────────────────────────────
type MiscFormFields = {
  id?: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  documentType: string;
  remarks: string;
  issue: string;
  encodedBy: string;
  subjectOfChange: string;
  drn: string;
  cl: string;
  date: string;
  note: string;
};

type MiscRecord = MiscFormFields & {
  id: string;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
};

type ToastStatus = "success" | "error";

// ── Shared classes ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
const labelCls =
  "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";

const toastAccent: Record<ToastStatus, string> = {
  success: "#22c55e",
  error: "#ef4444",
};
const toastIcon: Record<ToastStatus, React.ReactNode> = {
  success: (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
};

// ── Encoded badge ─────────────────────────────────────────────────────────────
function EncodedBadge({ value }: { value: string }) {
  const cls =
    value === "YES"     ? "bg-emerald-50 text-emerald-600" :
    value === "NO"      ? "bg-red-50 text-red-500" :
    value === "UPDATED" ? "bg-blue-50 text-blue-600" :
                          "bg-[#f5f5f2] text-[#8a8a80]";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${cls}`}>
      {value || "—"}
    </span>
  );
}

// ── MISC Form ─────────────────────────────────────────────────────────────────
function MiscForm({
  currentForm,
  onSuccess,
}: {
  currentForm: MiscFormFields | null;
  onSuccess: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; status: ToastStatus; message: string }>({
    show: false, status: "success", message: "",
  });

  const emptyForm: MiscFormFields = {
    lgu: "", barangay: "", hhId: "", granteeName: "",
    documentType: "", remarks: "", issue: "", encodedBy: "",
    subjectOfChange: "", drn: "", cl: "", date: today, note: "",
  };

  const [formData, setFormData] = useState<MiscFormFields>(emptyForm);

  useEffect(() => {
    if (!currentForm) return;
    setFormData({
      ...emptyForm,
      ...currentForm,
      date: today,
      issue: currentForm.issue ?? "",
      subjectOfChange: currentForm.subjectOfChange ?? "",
      drn: currentForm.drn ?? "",
      cl: currentForm.cl ?? "",
      note: currentForm.note ?? "",
    });
  }, [currentForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    const { id, ...rest } = formData;
    const payload = { ...rest, date: new Date(formData.date).toISOString() };

    try {
      const res = (await post(
        `${import.meta.env.VITE_BACKEND_API_URL}/misc/upload`,
        payload
      )) as { upload: boolean; message: string };

      const status: ToastStatus = res.upload ? "success" : "error";
      setToast({ show: true, status, message: res.message });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), res.upload ? 5000 : 2000);
      if (res.upload) {
        handleReset();
        onSuccess();
      }
    } catch {
      setToast({ show: true, status: "error", message: "Submission failed." });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
    }

    setButtonLoading(false);
  };

  const handleReset = () => setFormData({ ...emptyForm, date: today });

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">Fill in the form below</p>
          <span className="text-[11px] text-[#c4c4b8] font-mono">* required</span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Column 1 — Basic Information */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Basic Information</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>LGU <span className="text-red-400">*</span></label>
                  <input type="text" name="lgu" value={formData.lgu} onChange={handleChange} className={inputCls} placeholder="Enter LGU" required />
                </div>
                <div>
                  <label className={labelCls}>Barangay <span className="text-red-400">*</span></label>
                  <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} className={inputCls} placeholder="Enter Barangay" required />
                </div>
                <div>
                  <label className={labelCls}>HH ID Number <span className="text-red-400">*</span></label>
                  <input type="text" name="hhId" value={formData.hhId} onChange={handleChange} className={inputCls} placeholder="Enter HH ID" required />
                </div>
                <div>
                  <label className={labelCls}>Grantee Name <span className="text-red-400">*</span></label>
                  <input type="text" name="granteeName" value={formData.granteeName} onChange={handleChange} className={inputCls} placeholder="Enter Name" required />
                </div>
                <div>
                  <label className={labelCls}>Subject of Change</label>
                  <input type="text" name="subjectOfChange" value={formData.subjectOfChange} onChange={handleChange} className={inputCls} placeholder="Enter Subject" />
                </div>
              </div>
            </div>

            {/* Column 2 — Document Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Document Details</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>Document Type <span className="text-red-400">*</span></label>
                  <input type="text" name="documentType" value={formData.documentType} onChange={handleChange} className={inputCls} placeholder="Enter Document Type" required />
                </div>
                <div>
                  <label className={labelCls}>Encoded Y/N <span className="text-red-400">*</span></label>
                  <select name="remarks" value={formData.remarks} onChange={handleChange} required className={inputCls}>
                    <option value="">Select</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="UPDATED">Updated</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Assigned City Link or SWA <span className="text-red-400">*</span></label>
                  <input type="text" name="cl" value={formData.cl} onChange={handleChange} className={inputCls} placeholder="Enter City Link or SWA" required />
                </div>
                <div>
                  <label className={labelCls}>DRN</label>
                  <input type="text" name="drn" value={formData.drn} onChange={handleChange} className={inputCls} placeholder="Enter DRN" />
                </div>
                <div>
                  <label className={labelCls}>Date Accomplished</label>
                  <input type="date" name="date" value={formData.date} readOnly className={inputCls + " cursor-default"} required />
                </div>
              </div>
            </div>

            {/* Column 3 — Additional Info */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Additional Info</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>Issues</label>
                  <textarea name="issue" value={formData.issue} onChange={handleChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter issues..." />
                </div>
                <div>
                  <label className={labelCls}>Note</label>
                  <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter note..." />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={buttonLoading}
                    className="flex-1 h-10 bg-[#1a1a18] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {buttonLoading ? "Submitting…" : "Submit →"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={buttonLoading}
                    className="flex-1 h-10 bg-transparent text-[#1a1a18] text-[13px] font-medium rounded-lg border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>

      {/* Toast */}
      {toast.show && (
        <div style={{
          position: "fixed", bottom: "28px", left: "28px",
          backgroundColor: "#fff", color: "#1a1a18",
          padding: "12px 16px", borderRadius: "10px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)",
          fontSize: "13px", fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          zIndex: 9999, display: "flex", alignItems: "center",
          gap: "10px", maxWidth: "300px",
          animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "20px", height: "20px", borderRadius: "50%",
            backgroundColor: toastAccent[toast.status], flexShrink: 0,
          }}>
            {toastIcon[toast.status]}
          </span>
          <span style={{ color: "#555", lineHeight: 1.4 }}>{toast.message}</span>
          <style>{`
            @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
          `}</style>
        </div>
      )}
    </>
  );
}

// ── MISC Recent Table ─────────────────────────────────────────────────────────
function MiscRecentTable({
  newData,
  onLoad,
}: {
  newData: boolean;
  onLoad: (record: MiscFormFields) => void;
}) {
  const { data: records = [], isLoading, refetch } = useQuery<MiscRecord[]>({
    queryKey: ["recentMisc"],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/misc/recent`);
      return data as MiscRecord[];
    },
  });

  useEffect(() => {
    if (newData) refetch();
  }, [newData]);

  const COLS = [
    "LGU", "Barangay", "HH ID", "Grantee Name",
    "Doc Type", "Subject", "Encoded By", "Remarks",
    "DRN", "CL", "Date", "Note", "",
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e8e8e0] mt-2 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Recent Updates</p>
        {records.length > 0 && (
          <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
            {records.length} record{records.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 z-10 bg-[#fafaf8] border-b border-[#e8e8e0]">
            <tr>
              {COLS.map((h) => (
                <th key={h} className="px-4 py-3 text-center text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f5f5f2]">
            {isLoading ? (
              <tr>
                <td colSpan={COLS.length} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-[#c4c4b8]">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[12px]">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <InboxIcon size={22} className="text-[#d4d4cc]" />
                    <span className="text-[12px] text-[#8a8a80]">No recent updates found</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr key={r.id} className={`hover:bg-amber-50/20 transition-colors duration-100 ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}>
                  <td className="px-4 py-2.5 text-center text-[13px] font-semibold text-[#1a1a18] whitespace-nowrap">{r.lgu}</td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">{r.barangay}</td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 group">
                      <span className="font-mono text-[11px] text-[#1a1a18] whitespace-nowrap">{r.hhId}</span>
                      <button onClick={() => navigator.clipboard.writeText(r.hhId)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none" title="Copy HH ID">
                        <Copy size={11} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center text-[12px] font-medium text-[#1a1a18] whitespace-nowrap">{r.granteeName}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 tracking-wider whitespace-nowrap">
                      {r.documentType || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] max-w-[120px] truncate">{r.subjectOfChange || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] whitespace-nowrap">{r.encodedBy || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center"><EncodedBadge value={r.remarks} /></td>
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.drn || <span className="text-[#d4d4cc] font-sans">—</span>}</td>
                  <td className="px-4 py-2.5 text-center font-mono text-[11px] text-[#8a8a80] whitespace-nowrap">{r.cl || <span className="text-[#d4d4cc] font-sans">—</span>}</td>
                  <td className="px-4 py-2.5 text-center text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
                    {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-2.5 text-center text-[12px] text-[#8a8a80] max-w-[100px] truncate">{r.note || <span className="text-[#d4d4cc]">—</span>}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => onLoad(r)}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap cursor-pointer bg-transparent border-none"
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MiscMain() {
  const [currentForm, setCurrentForm] = useState<MiscFormFields | null>(null);
  const [newData, setNewData] = useState(false);

  const handleSuccess = () => {
    setNewData(true);
    setTimeout(() => setNewData(false), 500);
  };

  const handleLoad = (record: MiscFormFields) => {
    const { date, ...rest } = record;
    setCurrentForm({ ...rest, date: new Date().toISOString().slice(0, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
 <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="mb-6 ">
            <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">
              Records Management - UNDERDEVELOPMENT
            </p>
            <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">
              MISCELLANEOUS
            </h1>
          </div>

          <MiscForm currentForm={currentForm} onSuccess={handleSuccess} />
          <MiscRecentTable newData={newData} onLoad={handleLoad} />
      </div>
  );
}