import React, { useEffect, useState } from "react";
import type{ MiscRecord,  MiscFormFields, ToastStatus } from "./../types/miscTypes";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import type { RouteParams } from "~/types/authTypes";
import { labelCls,inputCls } from "component/styleConfig";
import { useToastStore } from "lib/zustand/ToastStore";


export default function MiscForm() {
  const { id } = useParams<RouteParams>()
  const navigate = useNavigate()
  const { show } = useToastStore()
  const today = new Date().toISOString().slice(0, 10);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    status: ToastStatus;
    message: string;
  }>({
    show: false,
    status: "success",
    message: "",
  });


  const [formData, setFormData] = useState<MiscFormFields>({
    lgu: "",
    barangay: "",
    hhId: "",
    granteeName: "",
    documentType: "",
    remarks: "",
    issue: "",
    encodedBy: "",
    subjectOfChange: "",
    drn: "",
    cl: "",
    date: today,
    note: "",
  });

  const { data } = useQuery({
    queryKey : ["SelectedMisc", id],
    queryFn : async () => {
      const res = await APIFETCH.get<MiscRecord>(`/miscellaneous/record/${id}`)
      return res.data
    },
    enabled : !!id
  })


useEffect(() => {
  if (!data) return;

  setFormData({
    lgu: data.lgu ?? "",
    barangay:data.barangay ?? "",
    hhId: data.hhId ?? "",
    granteeName: data.granteeName ?? "",
    documentType: data.documentType ?? "",
    remarks: data.remarks ?? "",
    issue: data.issue ?? "",
    encodedBy: data.encodedBy ?? "",
    subjectOfChange: data.subjectOfChange ?? "",
    drn: data.drn ?? "",
    cl: data.cl ?? "",
    date: today,
    note: data.note ?? "",
  });
}, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    const res = await APIFETCH.post("/miscellaneous/upload", formData)
    if(res.data.upload){
      show(`${res.data.message}`, "success")
      setButtonLoading(false);
    }else if(res.data.upload){
      show(`${res.data.message}`, "error")
      setButtonLoading(false);
    }

    
  };

  const handleReset = () => {setFormData({ 
        lgu: "",
    barangay: "",
    hhId: "",
    granteeName: "",
    documentType: "",
    remarks: "",
    issue: "",
    encodedBy: "",
    subjectOfChange: "",
    drn: "",
    cl: "",
    date: today,
    note: "",
  });
  navigate("/miscellaneous")
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
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>LGU</label>
                  <input
                    type="text"
                    name="lgu"
                    value={formData.lgu}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter LGU"
                  />
                </div>
                <div>
                  <label className={labelCls}>Barangay</label>
                  <input
                    type="text"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Barangay"
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    HH ID Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="hhId"
                    value={formData.hhId}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter HH ID"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Grantee Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="granteeName"
                    value={formData.granteeName}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Subject of Change</label>
                  <input
                    type="text"
                    name="subjectOfChange"
                    value={formData.subjectOfChange}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Subject"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Document Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    Document Type <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Document Type"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    REMARKS <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
                    <option value="">Select</option>
                    <option value="ENCODED">ENCODED</option>
                    <option value="SCANNED">SCANNED</option>
                    <option value="TRACKED">TRACKED</option>
                    <option value="UPDATED">UPDATED</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="ISSUE">ISSUE</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Assigned City Link or SWA</label>
                  <input
                    type="text"
                    name="cl"
                    value={formData.cl}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter City Link or SWA"
                  />
                </div>
                <div>
                  <label className={labelCls}>DRN</label>
                  <input
                    type="text"
                    name="drn"
                    value={formData.drn}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter DRN"
                  />
                </div>
                <div>
                  <label className={labelCls}>Date Accomplished</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    readOnly
                    className={inputCls + " cursor-default"}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Additional Info
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>Issues</label>
                  <textarea
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Enter issues..."
                  />
                </div>
                <div>
                  <label className={labelCls}>Note</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Enter note..."
                  />
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
    </>
  );
}
