import React, { useEffect, useState } from "react";
import { Save, RefreshCw, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import SwdiRecent from "./swdiRecent";
import { setNewData } from "redux/slice/swdi/swdiSlice";
import type { SWDIFormFields } from "~/types/swdiTypes";

function SWDIForm() {
  const Swdi = useSelector((state: RootState) => state.swdi);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<SWDIFormFields>({
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
    const isoDate = new Date(formData.date).toISOString();
    const payload = { ...formData, date: isoDate };

    console.log("Submitting SWDI Form with payload:", payload);
    // const res = await fetch(
    //   `${import.meta.env.VITE_BACKEND_API_URL}/v1/swdi/insert`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "include",
    //     body: JSON.stringify(payload),
    //   },
    // );

    // const data = await res.json();
    // if (!res.ok) {
    //   console.error("Failed to submit SWDI form", data);
    //   return;
    // }

    dispatch(setNewData(true));
    //handleReset();
  };

  const handleReset = () => {
    setFormData({
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
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      <div className="h-full max-w-full mx-auto flex flex-col">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
          <div className="px-6 py-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-700" />
            <h1 className="text-xl font-bold text-black">
              SWDI ACCOMPLISHMENT TRACKING
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Column 1 - Household Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Household Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="hhId"
                      className="block text-xs font-medium text-black mb-1"
                    >
                      HH ID <span className="text-red-500">*</span>
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
                    <label className="block text-xs font-medium text-black mb-1">
                      LGU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lgu"
                      value={formData.lgu}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter LGU"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      Barangay <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                      htmlFor="grantee"
                      className="block text-xs font-medium text-black mb-1"
                    >
                      Grantee <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="grantee"
                      name="grantee"
                      value={formData.grantee}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter Grantee Name"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 - Assessment Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Assessment Details
                </h3>

                <div className="space-y-3">
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
                      htmlFor="swdiScore"
                      className="block text-xs font-medium text-black mb-1"
                    >
                      SWDI Score <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="swdiScore"
                      name="swdiScore"
                      min={0}
                      max={3}
                      step="0.01"
                      value={formData.swdiScore}
                      placeholder="Enter SWDI Score (0-3)"
                      onChange={(e) => {
                        const raw = e.target.value;

                        if (raw === "") {
                          setFormData((prev) => ({ ...prev, swdiScore: 1 }));
                          return;
                        }

                        let value = parseFloat(raw);

                        if (isNaN(value)) value = 1;
                        if (value < 1) value = 1;
                        if (value > 3) value = 3;

                        setFormData((prev) => ({ ...prev, swdiScore: value }));
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      SWDI Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="swdiLevel"
                      disabled={true}
                      value={formData.swdiLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter Level"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-xs font-medium text-black mb-1"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      disabled={true}
                      value={formData.date}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3 - Issues & Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  Issues & Actions
                </h3>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="issue"
                      className="block text-xs font-medium text-black mb-1"
                    >
                      Issue
                    </label>
                    <textarea
                      id="issue"
                      name="issue"
                      value={formData.issue}
                      onChange={handleInputChange}
                      rows={1}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                      placeholder="Describe any issues or concerns..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      ASSIGNED CITY LINK OR SWA{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cl"
                      value={formData.cl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter Facilitator"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      DRN{" "}
                    </label>
                    <input
                      type="text"
                      name="drn"
                      value={formData.drn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter DRN"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-1">
                      Note
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                      placeholder="Enter remarks..."
                    />
                  </div>

                  <div className="space-y-2 pt-4">
                    <button
                      type="submit"
                      className="w-full bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Save size={16} />
                      Submit Form
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full bg-gray-200 text-black px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RefreshCw size={16} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <SwdiRecent />
      </div>
    </div>
  );
}

export default function SWDIMainContent() {
  return (
    <main className="p-6 h-full">
      <SWDIForm />
    </main>
  );
}
