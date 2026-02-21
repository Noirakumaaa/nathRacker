import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNewData } from "redux/slice/bus/busSlice";
import { post } from "component/fetchComponent";
import type { BusFormFields } from "~/types/busTypes";
import type { RootState, AppDispatch } from "../../redux/store";
import { UPDATE_TYPE_KEYMAP } from "~/types/busTypes";

type ToastStatus = "success" | "error" | "loading";

const toastConfig: Record<
  ToastStatus,
  {
    icon: React.ReactNode;
    accent: string;
  }
> = {
  success: {
    accent: "#22c55e",
    icon: (
      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
        <path
          d="M1 4L4 7L10 1"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  error: {
    accent: "#ef4444",
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M1 1L9 9M9 1L1 9"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  loading: {
    accent: "#6366f1",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <circle
          cx="6"
          cy="6"
          r="5"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.7"
        />
        <path
          d="M6 1A5 5 0 0 1 11 6"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export default function BusForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const currentBusForm = useSelector(
    (state: RootState) => state.bus.currentBusForm,
  );
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);

    const { id, ...rest } = formData;

    const payload = {
      ...rest,
      date: new Date(formData.date).toISOString(),
    };

    const res = (await post(
      `${import.meta.env.VITE_BACKEND_API_URL}/bus/upload`,
      payload,
    )) as { upload: boolean, message: string };

    console.log("Response from server:", res);
    if (res.upload) {
      await setStatusMessage(res.message);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
      }, 5000);
    } else {
      await setStatusMessage(res.message);
      setUploadSuccess(true);
      console.error("Upload failed");
      setTimeout(() => {
        setUploadSuccess(false);
      }, 2000);
    }
    dispatch(setNewData(true));
    handleReset();
    setButtonLoading(false);
  };

  const handleReset = () => {
    setFormData({
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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden"
    >
      <div className="overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Column 1 - Location & Household */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="lgu"
                  className="block text-xs font-medium text-black mb-1"
                >
                  LGU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lgu"
                  name="lgu"
                  value={formData.lgu}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter LGU"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="barangay"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Barangay <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter Barangay"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="hhId"
                  className="block text-xs font-medium text-black mb-1"
                >
                  HH ID Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hhId"
                  name="hhId"
                  value={formData.hhId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter HH ID"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="granteeName"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Grantee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="granteeName"
                  name="granteeName"
                  value={formData.granteeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subjectOfChange"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Subject of Change <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subjectOfChange"
                  name="subjectOfChange"
                  value={formData.subjectOfChange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter Subject"
                  required
                />
              </div>
              {/* <div>
                    <label
                      htmlFor="id"
                      className="block text-xs font-medium text-black mb-1"
                    >
                      ID
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter ID"
                    />
                  </div> */}
            </div>
          </div>

          {/* Column 2 - Update & Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
              Update Details
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="typeOfUpdate"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Type of Update <span className="text-red-500">*</span>
                </label>
                <select
                  id="typeOfUpdate"
                  name="typeOfUpdate"
                  value={formData.typeOfUpdate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                >
                  <option value="">Select Type</option>
                  {Object.entries(UPDATE_TYPE_KEYMAP).map(([key, value]) => (
                    <option key={key} value={key}>
                      {key} - {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="encodedBy"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Update Info <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="updateInfo"
                  name="updateInfo"
                  value={formData.updateInfo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter Update Info"
                />
              </div>
              <div>
                <label
                  htmlFor="encoded"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Encoded Y/N <span className="text-red-500">*</span>
                </label>
                <select
                  id="remarks"
                  name="remarks"
                  required
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                >
                  <option value="">Select</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="UPDATED">UPDATED</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="cl"
                  className="block text-xs font-medium text-black mb-1"
                >
                  ASSIGNED CITY LINK OR SWA{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cl"
                  name="cl"
                  value={formData.cl}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter CITY LINK OR SWA"
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Date Accomplished
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  readOnly
                  value={formData.date}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                />
              </div>
            </div>
          </div>

          {/* Column 3 - Remarks & Other Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
              Additional Info
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="issue"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Issues
                </label>
                <textarea
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  rows={1}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                  placeholder="Enter remarks..."
                />
              </div>
              <div>
                <label
                  htmlFor="drn"
                  className="block text-xs font-medium text-black mb-1"
                >
                  DRN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="drn"
                  name="drn"
                  value={formData.drn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                  placeholder="Enter DRN"
                />
              </div>
              <div>
                <label
                  htmlFor="note"
                  className="block text-xs font-medium text-black mb-1"
                >
                  Note
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={1}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                  placeholder="Enter note..."
                />
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-black text-white px-4 rounded font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm"
                  disabled={buttonLoading}
                >
                  {buttonLoading ? "Submitting..." : "Submit Form"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 h-10 bg-black text-white px-4 rounded font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm"
                  disabled={buttonLoading}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {uploadSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            left: "28px",
            backgroundColor: "#fff",
            color: "#111",
            padding: "12px 16px",
            borderRadius: "10px",
            boxShadow:
              "0 2px 16px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)",
            fontSize: "14px",
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
          {/* Colored icon badge */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: toastConfig["success" as ToastStatus].accent,
              flexShrink: 0,
            }}
          >
            {toastConfig["success" as ToastStatus].icon}
          </span>

          <span style={{ color: "#333", lineHeight: 1.4 }}>
            {statusMessage}
          </span>

          <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
        </div>
      )}
    </form>
  );
}
