import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import SwdiRecent from "./swdiRecent";
import { setNewData } from "redux/slice/swdi/swdiSlice";
import type { SwdiFormFields } from "~/types/swdiTypes";
import { FileText } from "lucide-react";

const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
const labelCls =
  "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";

function SWDIForm() {
  const Swdi = useSelector((state: RootState) => state.swdi);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<SwdiFormFields>({
    hhId: "",
    lgu: "",
    barangay: "",
    grantee: "",
    swdiLevel: "",
    swdiScore: 0,
    encodedBy: "",
    remarks: "",
    issue: "",
    cl: "",
    drn: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!Swdi.currentSwdi) return;
    setFormData((prev) => ({
      ...prev,
      ...Swdi.currentSwdi,
      swdiScore: Number(
        typeof Swdi.currentSwdi.swdiScore === "string"
          ? parseFloat(Swdi.currentSwdi.swdiScore)
          : Swdi.currentSwdi.swdiScore,
      ),
      date: prev.date,
      issue: Swdi.currentSwdi.issue ?? "",
    }));
  }, [Swdi.currentSwdi]);

  useEffect(() => {
    let level = "";
    if (!formData.swdiScore) level = "Not Assessed";
    else if (formData.swdiScore >= 1.0 && formData.swdiScore <= 1.83)
      level = "Survival - Level 1";
    else if (formData.swdiScore >= 1.84 && formData.swdiScore <= 2.83)
      level = "Subsistence - Level 2";
    else if (formData.swdiScore >= 2.84 && formData.swdiScore <= 3.0)
      level = "Self-Sufficient - Level 3";
    setFormData((prev) => ({ ...prev, swdiLevel: level }));
  }, [formData.swdiScore]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isoDate = new Date(formData.date).toISOString();
    const payload = { ...formData, date: isoDate };
    console.log("Submitting SWDI Form with payload:", payload);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/swdi/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      dispatch(setNewData(true));
    } else {
      console.error("Failed to submit SWDI form");
    }
  };

  const handleReset = () => {
    setFormData({
      hhId: "", lgu: "", barangay: "", grantee: "", swdiLevel: "",
      swdiScore: 0, encodedBy: "", remarks: "", issue: "", cl: "",
      drn: "", note: "", date: new Date().toISOString().split("T")[0],
    });
  };

  return (
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

          {/* Column 1 — Household Information */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-[#e8e8e0]">
              <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Household Information</h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="hhId" className={labelCls}>HH ID <span className="text-red-400">*</span></label>
                <input type="text" id="hhId" name="hhId" value={formData.hhId} onChange={handleInputChange} className={inputCls} placeholder="Enter HH ID" required />
              </div>
              <div>
                <label className={labelCls}>LGU <span className="text-red-400">*</span></label>
                <input type="text" name="lgu" value={formData.lgu} onChange={handleInputChange} className={inputCls} placeholder="Enter LGU" required />
              </div>
              <div>
                <label className={labelCls}>Barangay <span className="text-red-400">*</span></label>
                <input type="text" name="barangay" value={formData.barangay} onChange={handleInputChange} className={inputCls} placeholder="Enter Barangay" required />
              </div>
              <div>
                <label htmlFor="grantee" className={labelCls}>Grantee <span className="text-red-400">*</span></label>
                <input type="text" id="grantee" name="grantee" value={formData.grantee} onChange={handleInputChange} className={inputCls} placeholder="Enter Grantee Name" required />
              </div>
            </div>
          </div>

          {/* Column 2 — Assessment Details */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-[#e8e8e0]">
              <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Assessment Details</h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="remarks" className={labelCls}>Encoded Y/N <span className="text-red-400">*</span></label>
                <select id="remarks" name="remarks" required value={formData.remarks} onChange={handleInputChange} className={inputCls}>
                  <option value="">Select</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="UPDATED">Updated</option>
                </select>
              </div>
              <div>
                <label htmlFor="swdiScore" className={labelCls}>SWDI Score <span className="text-red-400">*</span></label>
                <input
                  type="number"
                  id="swdiScore"
                  name="swdiScore"
                  min={0}
                  max={3}
                  step="0.01"
                  value={formData.swdiScore}
                  placeholder="Enter SWDI Score (0–3)"
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") { setFormData((prev) => ({ ...prev, swdiScore: 1 })); return; }
                    let value = parseFloat(raw);
                    if (isNaN(value)) value = 1;
                    if (value < 1) value = 1;
                    if (value > 3) value = 3;
                    setFormData((prev) => ({ ...prev, swdiScore: value }));
                  }}
                  className={inputCls + " appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"}
                />
              </div>
              <div>
                <label className={labelCls}>SWDI Level <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="swdiLevel"
                  disabled
                  value={formData.swdiLevel}
                  onChange={handleInputChange}
                  className={inputCls + " bg-[#fafaf8] cursor-default text-[#8a8a80]"}
                  placeholder="Auto-calculated"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className={labelCls}>Date <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  disabled
                  value={formData.date}
                  className={inputCls + " bg-[#fafaf8] cursor-default"}
                />
              </div>
            </div>
          </div>

          {/* Column 3 — Issues & Actions */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-[#e8e8e0]">
              <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Issues & Actions</h3>
            </div>
            <div className="space-y-3.5">
              <div>
                <label htmlFor="issue" className={labelCls}>Issue</label>
                <textarea id="issue" name="issue" value={formData.issue} onChange={handleInputChange} rows={2} className={inputCls + " resize-none"} placeholder="Describe any issues..." />
              </div>
              <div>
                <label className={labelCls}>Assigned City Link or SWA <span className="text-red-400">*</span></label>
                <input type="text" name="cl" value={formData.cl} onChange={handleInputChange} className={inputCls} placeholder="Enter Facilitator" required />
              </div>
              <div>
                <label className={labelCls}>DRN</label>
                <input type="text" name="drn" value={formData.drn} onChange={handleInputChange} className={inputCls} placeholder="Enter DRN" />
              </div>
              <div>
                <label className={labelCls}>Note</label>
                <textarea name="note" value={formData.note} onChange={handleInputChange} rows={2} className={inputCls + " resize-none"} placeholder="Enter note..." />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-[#1a1a18] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
                >
                  Submit →
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 h-10 bg-transparent text-[#1a1a18] text-[13px] font-medium rounded-lg border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}

export default function SWDIMainContent() {
  return (
  <div className="min-h-screen bg-[#f5f5f2] px-4 py-8 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="mb-3 ml-3 mt-3">
            <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-widest mb-1">
              Records Management
            </p>
            <h1 className="text-2xl font-semibold text-[#1a1a18] tracking-tight">
              SWDI DATA
            </h1>
          </div>

          <SWDIForm />
          <SwdiRecent />
      </div>
  );
}