import React, { useEffect, useState } from "react";
import type { BusFormFields, BusRecord, BusResponse } from "~/types/busTypes";
import { UPDATE_TYPE_KEYMAP } from "~/types/busTypes";
import { labelCls, inputCls } from "component/styleConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import APIFETCH from "lib/axios/axiosConfig";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import type { RouteParams } from "~/types/authTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Opt,Req } from "component/LabelStyle";


export default function BusForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { id } = useParams<RouteParams>();
  const { show } = useToastStore();

  const [buttonLoading, setButtonLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState<BusFormFields>({
    lgu: "",
    barangay: "",
    hhId: "",
    granteeName: "",
    subjectOfChange: "",
    typeOfUpdate: "",
    updateInfo: "",
    issue: "",
    remarks: "",
    drn: "",
    cl: "",
    note: "",
  });

  const { data } = useQuery({
    queryKey: ["SelectedBus", id],
    queryFn: async () => {
      const res = await APIFETCH.get<BusRecord>(`/bus/records/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setFormData(() => ({
        lgu: data.lgu ?? "",
        barangay: data.barangay ?? "",
        hhId: data.hhId ?? "",
        granteeName: data.granteeName ?? "",
        subjectOfChange: data.subjectOfChange ?? "",
        typeOfUpdate: data.typeOfUpdate ?? "",
        updateInfo: data.updateInfo ?? "",
        issue: data.issue ?? "",
        encodedBy: data.encodedBy ?? "",
        remarks: data.remarks ?? "",
        drn: data.drn ?? "",
        cl: data.cl ?? "",
        date: today,
        note: data.note ?? "",
      }));
    }
  }, [data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await APIFETCH.post<BusResponse>("/bus/upload", formData);
    setButtonLoading(true);
    if (res.data.upload) {
      show(`${res.data.message}`, "success");
      queryClient.invalidateQueries({ queryKey: ["recentBus"] });
      setButtonLoading(false);
    } else if (res.data.upload === false) {
      show(`${res.data.message}`, "error");
      setButtonLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      lgu: "",
      barangay: "",
      hhId: "",
      granteeName: "",
      subjectOfChange: "",
      typeOfUpdate: "",
      updateInfo: "",
      issue: "",
      remarks: "",
      drn: "",
      cl: "",
      note: "",
    });
    navigate("/bus");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#e8e8e0] overflow-hidden"
      >
        {/* Header with legend */}
        <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">
            Fill in the form below
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
              Required
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8a8a80] bg-[#f5f5f2] border border-[#e8e8e0] px-2 py-1 rounded-md uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c4c4b8] inline-block shrink-0" />
              Optional
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1 — Basic Information */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="lgu" className={labelCls}>
                    LGU <Req />
                  </label>
                  <input
                    type="text"
                    id="lgu"
                    name="lgu"
                    value={formData.lgu}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter LGU"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="barangay" className={labelCls}>
                    Barangay <Req />
                  </label>
                  <input
                    type="text"
                    id="barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter Barangay"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="hhId" className={labelCls}>
                    HH ID Number <Req />
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
                  <label htmlFor="granteeName" className={labelCls}>
                    Grantee Name <Req />
                  </label>
                  <input
                    type="text"
                    id="granteeName"
                    name="granteeName"
                    value={formData.granteeName}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subjectOfChange" className={labelCls}>
                    Subject of Change <Req />
                  </label>
                  <input
                    type="text"
                    id="subjectOfChange"
                    name="subjectOfChange"
                    value={formData.subjectOfChange}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter Subject"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Column 2 — Update Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Update Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="typeOfUpdate" className={labelCls}>
                    Type of Update <Req />
                  </label>
                  <select
                    id="typeOfUpdate"
                    name="typeOfUpdate"
                    value={formData.typeOfUpdate}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
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
                  <label htmlFor="updateInfo" className={labelCls}>
                    Update Info <Req />
                  </label>
                  <input
                    type="text"
                    id="updateInfo"
                    name="updateInfo"
                    value={formData.updateInfo}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="Enter Update Info"
                  />
                </div>
                <div>
                  <label htmlFor="remarks" className={labelCls}>
                    Encoded Y/N <Req />
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
                  <label htmlFor="cl" className={labelCls}>
                    Assigned City Link or SWA <Req />
                  </label>
                  <input
                    type="text"
                    id="cl"
                    name="cl"
                    value={formData.cl}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="Enter City Link or SWA"
                  />
                </div>
                <div>
                  <label htmlFor="date" className={labelCls}>
                    Date Accomplished <Req />
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    readOnly
                    value={today}
                    className={inputCls + " cursor-default"}
                  />
                </div>
              </div>
            </div>

            {/* Column 3 — Additional Info */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Additional Info
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="issue" className={labelCls}>
                    Issues <Opt />
                  </label>
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleInputChange}
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Enter issues..."
                  />
                </div>
                <div>
                  <label htmlFor="drn" className={labelCls}>
                    DRN <Req />
                  </label>
                  <input
                    type="text"
                    id="drn"
                    name="drn"
                    value={formData.drn}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                    placeholder="Enter DRN"
                  />
                </div>
                <div>
                  <label htmlFor="note" className={labelCls}>
                    Note <Opt />
                  </label>
                  <textarea
                    id="note"
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