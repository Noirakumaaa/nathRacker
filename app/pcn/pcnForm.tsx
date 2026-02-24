import { useState, useEffect } from "react";
import type { PcnFormFields } from "~/types/pcnTypes";
import { get, post } from "component/fetchComponent";
import type { ToastStatus } from "~/types/pcnTypes";
import { labelCls, inputCls } from "./pcn";
import { toastAccent, toastIcon } from "./pcn";
import { useSelector } from "react-redux";


// ── PCN Form ──────────────────────────────────────────────────────────────────
export function PcnForm({
  currentForm,
  onSuccess,
}: {
  currentForm: PcnFormFields | null;
  onSuccess: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; status: ToastStatus; message: string }>({
    show: false, status: "success", message: "",
  });
  const setCurrentPCNForm = useSelector((state: any) => state.pcn.currentPcn);

  const emptyForm: PcnFormFields = {
    lgu: "", barangay: "", hhId: "", granteeName: "",
    remarks: "", issue: "", encodedBy: "",
    subjectOfChange: "", pcn: "", tr: "",
    drn: "", cl: "", date: today, note: "",
  };

  const [formData, setFormData] = useState<PcnFormFields>(emptyForm);

  useEffect(() => {
    if (!currentForm) return;
    setFormData({
      ...emptyForm,
      ...currentForm,
      date: today,
      lgu: currentForm.lgu ?? "",
      barangay: currentForm.barangay ?? "",
      granteeName: currentForm.granteeName ?? "",
      issue: currentForm.issue ?? "",
      drn: currentForm.drn ?? "",
      cl: currentForm.cl ?? "",
      note: currentForm.note ?? "",
    });
  }, [currentForm]);

    useEffect(() => {
    if (!setCurrentPCNForm) return;
    setFormData({
      ...setCurrentPCNForm,
      date : new Date().toISOString().slice(0, 10),
    });
  }, [setCurrentPCNForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.pcn.trim() && !formData.tr.trim()) {
      setToast({ show: true, status: "error", message: "At least one of PCN or TR is required." });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return;
    }

    setButtonLoading(true);
    const { id, ...rest } = formData;
    const payload = { ...rest, date: new Date(formData.date).toISOString() };
    console.log("Submitting payload:", payload);
    try {
      const res = (await post(
        `${import.meta.env.VITE_BACKEND_API_URL}/pcn/upload`,
        payload
      )) as { upload: boolean; message: string };

      const status: ToastStatus = res.upload ? "success" : "error";
      setToast({ show: true, status, message: res.message });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), res.upload ? 5000 : 2000);
      if (res.upload) {
        handleReset();
        onSuccess();
        console.log("PCN record submitted successfully.", res);
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
                  <label className={labelCls}>HH ID Number <span className="text-red-400">*</span></label>
                  <input type="text" name="hhId" value={formData.hhId} onChange={handleChange} className={inputCls} placeholder="Enter HH ID" required />
                </div>

                <div>
                  <label className={labelCls}>LGU</label>
                  <input type="text" name="lgu" value={formData.lgu} onChange={handleChange} className={inputCls} placeholder="Enter LGU" />
                </div>
                                <div>
                  <label className={labelCls}>Grantee Name</label>
                  <input type="text" name="granteeName" value={formData.granteeName} onChange={handleChange} className={inputCls} placeholder="Enter Name" />
                </div>
                <div>
                  <label className={labelCls}>Barangay</label>
                  <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} className={inputCls} placeholder="Enter Barangay" />
                </div>
                <div>
                  <label className={labelCls}>Subject of Change <span className="text-red-400">*</span></label>
                  <input type="text" name="subjectOfChange" value={formData.subjectOfChange} onChange={handleChange} className={inputCls} placeholder="Enter Subject" required />
                </div>
              </div>
            </div>

            {/* Column 2 — PCN Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">PCN Details</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>PCN <span className="text-[#c4c4b8] normal-case tracking-normal font-normal">(at least one of PCN / TR required)</span></label>
                  <input type="text" name="pcn" value={formData.pcn} onChange={handleChange} className={inputCls} placeholder="Enter PCN" />
                </div>
                <div>
                  <label className={labelCls}>TR</label>
                  <input type="text" name="tr" value={formData.tr} onChange={handleChange} className={inputCls} placeholder="Enter TR" />
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
                  <label className={labelCls}>Assigned City Link or SWA</label>
                  <input type="text" name="cl" value={formData.cl} onChange={handleChange} className={inputCls} placeholder="Enter City Link or SWA" />
                </div>
                 <div>
                  <label className={labelCls}>Date Accomplished</label>
                  <input type="date" name="date" value={formData.date} readOnly required className={inputCls + " cursor-default"} />
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
                  <label className={labelCls}>DRN</label>
                  <input type="text" name="drn" value={formData.drn} onChange={handleChange} className={inputCls} placeholder="Enter DRN" />
                </div>
                <div>
                  <label className={labelCls}>Issues</label>
                  <textarea name="issue" value={formData.issue} onChange={handleChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter issues..." />
                </div>
                <div>
                  <label className={labelCls}>Note</label>
                  <textarea name="note" value={formData.note} onChange={handleChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter note..." />
                </div>

                <div className="flex gap-2.5 pt-1">
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