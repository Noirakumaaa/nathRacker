import React, { useEffect, useState } from "react";
import type {
  SwdiRecord,
  SwdiFormFields,
  SwdiResponse,
} from "~/types/swdiTypes";
import { labelCls, inputCls } from "component/styleConfig";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { useNavigate } from "react-router";
import type { RouteParams } from "~/types/authTypes";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/root";
import { Req } from "component/LabelStyle";

export default function SWDIForm() {
  const navigate = useNavigate();
  const { show } = useToastStore();
  const { id } = useParams<RouteParams>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [swdiScoreInput, setSwdiScoreInput] = useState<string>("");

  const [formData, setFormData] = useState<SwdiFormFields>({
    hhId: "",
    lgu: "",
    barangay: "",
    grantee: "",
    swdiLevel: "",
    swdiScore: "",
    remarks: "",
    issue: "",
    cl: "",
    drn: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { data } = useQuery({
    queryKey: ["SelectedSwdi", id],
    queryFn: async () => {
      const res = await APIFETCH.get<SwdiRecord>(`/swdi/record/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setSwdiScoreInput(String(data.swdiScore) ?? "");
      setFormData(() => ({
        hhId: data.hhId ?? "",
        lgu: data.lgu ?? "",
        barangay: data.barangay ?? "",
        grantee: data.grantee ?? "",
        swdiLevel: data.swdiLevel ?? "",
        swdiScore: String(data.swdiScore) ?? "",
        remarks: data.remarks ?? "",
        issue: data.issue ?? "",
        cl: data.cl ?? "",
        drn: data.drn ?? "",
        note: data.note ?? "",
        date: new Date().toISOString().split("T")[0],
      }));
    }
  }, [data]);

  useEffect(() => {
    const score = parseFloat(swdiScoreInput);
    let level = "";
    if (!swdiScoreInput || isNaN(score)) level = "Not Assessed";
    else if (score >= 1.0 && score <= 1.83) level = "Survival - Level 1";
    else if (score >= 1.84 && score <= 2.83) level = "Subsistence - Level 2";
    else if (score >= 2.84 && score <= 3.0) level = "Self-Sufficient - Level 3";
    setFormData((prev) => ({ ...prev, swdiLevel: level }));
  }, [swdiScoreInput]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...formData,
      swdiScore: parseFloat(swdiScoreInput) || 0,
    };
    console.log("Payload : ", payload);
    const res = await APIFETCH.post<SwdiResponse>("/swdi/upload", payload);
    setButtonLoading(true);
    if (res.data.upload) {
      show(`${res.data.message}`, "success");
      queryClient.invalidateQueries({ queryKey: ["recentSwdi"] });
      setButtonLoading(false);
    } else if (!res.data.upload) {
      show(`#{show.data.message}`, "error");
      setButtonLoading(false);
    }
  };

  const handleReset = () => {
    setSwdiScoreInput("");
    setFormData({
      hhId: "",
      lgu: "",
      barangay: "",
      grantee: "",
      swdiLevel: "",
      swdiScore: "0",
      remarks: "",
      issue: "",
      cl: "",
      drn: "",
      note: "",
      date: new Date().toISOString().split("T")[0],
    });
    navigate("/")
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">
            Fill in the form below
          </p>
          <span className="text-[11px] text-[#c4c4b8] font-mono">
            * required
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1 — Household Information */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Household Information
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="hhId" className={labelCls}>
                    HH ID <Req />
                  </label>
                  <input
                    type="text"
                    id="hhId"
                    name="hhId"
                    value={formData.hhId}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter HH ID"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    LGU <Req />
                  </label>
                  <input
                    type="text"
                    name="lgu"
                    value={formData.lgu}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter LGU"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Barangay <Req />
                  </label>
                  <input
                    type="text"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter Barangay"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="grantee" className={labelCls}>
                    Grantee <Req />
                  </label>
                  <input
                    type="text"
                    id="grantee"
                    name="grantee"
                    value={formData.grantee}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter Grantee Name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Column 2 — Assessment Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Assessment Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="remarks" className={labelCls}>
                    Remarks<Req />
                  </label>
                  <select
                    id="remarks"
                    name="remarks"
                    required
                    value={formData.remarks}
                    onChange={handleInputChange}
                    className={inputCls}
                  >
                    <option value="">Select</option>
                    <option value="ENCODED">ENCODED</option>
                    <option value="ISSUE">ISSUE</option>
                    <option value="UPDATED">UPDATED</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="swdiScore" className={labelCls}>
                    SWDI Score <Req />
                  </label>
                  <input
                    type="text"
                    id="swdiScore"
                    name="swdiScore"
                    min={1}
                    max={3}
                    step="0.01"
                    value={swdiScoreInput}
                    required
                    placeholder="Enter SWDI Score (1–3)"
                    onChange={(e) => {
                      const raw = e.target.value;
                      // allow empty or valid number characters only
                      if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                        const num = parseFloat(raw);
                        if (
                          raw === "" ||
                          (!isNaN(num) && num >= 1 && num <= 3)
                        ) {
                          setSwdiScoreInput(raw);
                        }
                      }
                    }}
                    className={
                      inputCls +
                      " appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    SWDI Level
                  </label>
                  <input
                    type="text"
                    name="swdiLevel"
                    disabled
                    value={formData.swdiLevel}
                    onChange={handleInputChange}
                    className={
                      inputCls + " bg-[#fafaf8] cursor-default text-[#8a8a80]"
                    }
                    placeholder="Auto-calculated"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className={labelCls}>
                    Date <Req />
                  </label>
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
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Issues & Actions
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="issue" className={labelCls}>
                    Issue
                  </label>
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Describe any issues..."
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Assigned City Link or SWA{" "}
                    <Req />
                  </label>
                  <input
                    type="text"
                    name="cl"
                    value={formData.cl}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter Facilitator"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>DRN</label>
                  <input
                    type="text"
                    name="drn"
                    value={formData.drn}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter DRN"
                  />
                </div>
                <div>
                  <label className={labelCls}>Note</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Enter note..."
                  />
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
    </>
  );
}
