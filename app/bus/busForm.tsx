import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNewData } from "redux/slice/bus/busSlice";
import { post } from "component/fetchComponent";
import type { BusFormFields } from "~/types/busTypes";
import type { RootState, AppDispatch } from "../../redux/store";
import { UPDATE_TYPE_KEYMAP } from "~/types/busTypes";

type ToastStatus = "success" | "error" | "loading";

const toastConfig: Record<ToastStatus, { icon: React.ReactNode; accent: string }> = {
  success: {
    accent: "#22c55e",
    icon: (
      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    accent: "#ef4444",
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  loading: {
    accent: "#6366f1",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
        <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.7" />
        <path d="M6 1A5 5 0 0 1 11 6" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
};

// Shared input/label classes matching landing page tokens
const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
const labelCls = "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";

export default function BusForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [toastStatus, setToastStatus] = useState<ToastStatus>("success");

  const currentBusForm = useSelector((state: RootState) => state.bus.currentBusForm);
  const [buttonLoading, setButtonLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState<BusFormFields>({
    id: "",
    lgu: "",
    barangay: "",
    hhId: "",
    granteeName: "",
    subjectOfChange: "",
    typeOfUpdate: "",
    updateInfo: "",
    issue: "",
    encodedBy: "",
    remarks: "",
    drn: "",
    cl: "",
    date: today,
    note: "",
  });

  useEffect(() => {
    if (!currentBusForm) return;
    setFormData((prev) => ({
      ...prev,
      ...currentBusForm,
      date: currentBusForm.date
        ? new Date(currentBusForm.date).toISOString().slice(0, 10)
        : prev.date,
      issue: currentBusForm.issue ?? "",
      remarks: currentBusForm.remarks ?? "",
      updateInfo: currentBusForm.updateInfo ?? "",
      encodedBy: currentBusForm.encodedBy ?? "",
      drn: currentBusForm.drn ?? "",
      cl: currentBusForm.cl ?? "",
      note: currentBusForm.note ?? "",
    }));
  }, [currentBusForm]);

  const handleInputChange = (
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
    const res = (await post(
      `${import.meta.env.VITE_BACKEND_API_URL}/bus/upload`,
      payload
    )) as { upload: boolean; message: string };

    if (res.upload) {
      setToastStatus("success");
    } else {
      setToastStatus("error");
      console.error("Upload failed");
    }
    setStatusMessage(res.message);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), res.upload ? 5000 : 2000);
    dispatch(setNewData(true));
    handleReset();
    setButtonLoading(false);
  };

  const handleReset = () => {
    setFormData({
      id: "", lgu: "", barangay: "", hhId: "", granteeName: "",
      subjectOfChange: "", typeOfUpdate: "", updateInfo: "", issue: "",
      encodedBy: "", remarks: "", drn: "", cl: "", date: today, note: "",
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden"
      >
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
                  <label htmlFor="lgu" className={labelCls}>LGU <span className="text-red-400">*</span></label>
                  <input type="text" id="lgu" name="lgu" value={formData.lgu} onChange={handleInputChange} className={inputCls} placeholder="Enter LGU" required />
                </div>
                <div>
                  <label htmlFor="barangay" className={labelCls}>Barangay <span className="text-red-400">*</span></label>
                  <input type="text" id="barangay" name="barangay" value={formData.barangay} onChange={handleInputChange} className={inputCls} placeholder="Enter Barangay" required />
                </div>
                <div>
                  <label htmlFor="hhId" className={labelCls}>HH ID Number <span className="text-red-400">*</span></label>
                  <input type="text" id="hhId" name="hhId" value={formData.hhId} onChange={handleInputChange} className={inputCls} placeholder="Enter HH ID" required />
                </div>
                <div>
                  <label htmlFor="granteeName" className={labelCls}>Grantee Name <span className="text-red-400">*</span></label>
                  <input type="text" id="granteeName" name="granteeName" value={formData.granteeName} onChange={handleInputChange} className={inputCls} placeholder="Enter Name" required />
                </div>
                <div>
                  <label htmlFor="subjectOfChange" className={labelCls}>Subject of Change <span className="text-red-400">*</span></label>
                  <input type="text" id="subjectOfChange" name="subjectOfChange" value={formData.subjectOfChange} onChange={handleInputChange} className={inputCls} placeholder="Enter Subject" required />
                </div>
              </div>
            </div>

            {/* Column 2 — Update Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Update Details</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="typeOfUpdate" className={labelCls}>Type of Update <span className="text-red-400">*</span></label>
                  <select id="typeOfUpdate" name="typeOfUpdate" value={formData.typeOfUpdate} onChange={handleInputChange} required className={inputCls}>
                    <option value="">Select Type</option>
                    {Object.entries(UPDATE_TYPE_KEYMAP).map(([key, value]) => (
                      <option key={key} value={key}>{key} - {value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="updateInfo" className={labelCls}>Update Info <span className="text-red-400">*</span></label>
                  <input type="text" id="updateInfo" name="updateInfo" value={formData.updateInfo} onChange={handleInputChange} required className={inputCls} placeholder="Enter Update Info" />
                </div>
                <div>
                  <label htmlFor="remarks" className={labelCls}>Encoded Y/N <span className="text-red-400">*</span></label>
                  <select id="remarks" name="remarks" required value={formData.remarks} onChange={handleInputChange} className={inputCls}>
                    <option value="">Select</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="UPDATED">UPDATED</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cl" className={labelCls}>Assigned City Link or SWA <span className="text-red-400">*</span></label>
                  <input type="text" id="cl" name="cl" value={formData.cl} onChange={handleInputChange} required className={inputCls} placeholder="Enter City Link or SWA" />
                </div>
                <div>
                  <label htmlFor="date" className={labelCls}>Date Accomplished</label>
                  <input type="date" id="date" name="date" required readOnly value={formData.date} className={inputCls + " cursor-default"} />
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
                  <label htmlFor="issue" className={labelCls}>Issues</label>
                  <textarea id="issue" name="issue" value={formData.issue} onChange={handleInputChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter issues..." />
                </div>
                <div>
                  <label htmlFor="drn" className={labelCls}>DRN <span className="text-red-400">*</span></label>
                  <input type="text" id="drn" name="drn" value={formData.drn} onChange={handleInputChange} required className={inputCls} placeholder="Enter DRN" />
                </div>
                <div>
                  <label htmlFor="note" className={labelCls}>Note</label>
                  <textarea id="note" name="note" value={formData.note} onChange={handleInputChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter note..." />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={buttonLoading}
                    className="flex-1 h-10 bg-[#1a1a18] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {buttonLoading ? "Submitting…" : "Submit →"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={buttonLoading}
                    className="flex-1 h-10 bg-transparent text-[#1a1a18] text-[13px] font-medium rounded-lg border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      {uploadSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            left: "28px",
            backgroundColor: "#fff",
            color: "#1a1a18",
            padding: "12px 16px",
            borderRadius: "10px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            maxWidth: "300px",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: toastConfig[toastStatus].accent,
              flexShrink: 0,
            }}
          >
            {toastConfig[toastStatus].icon}
          </span>
          <span style={{ color: "#555", lineHeight: 1.4 }}>{statusMessage}</span>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}
    </>
  );
}