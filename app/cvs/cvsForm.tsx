import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { CvsRecord, CvsFormFields } from "~/types/cvsTypes";
import { labelCls,inputCls } from "component/styleConfig";
import { useParams } from "react-router";
import type { RouteParams } from "~/types/authTypes";
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";

export function CvsForm() {
  const navigate = useNavigate()
  const { show } = useToastStore();
  const { id } = useParams<RouteParams>()
  const today = new Date().toISOString().slice(0, 10);
  const [buttonLoading, setButtonLoading] = useState(false);


  const [formData, setFormData] = useState<CvsFormFields>({
    idNumber: "",
    lgu: "",
    barangay: "",
    facilityName: "",
    formType: "",
    remarks: "",
    date: today,
  });

  const { data } = useQuery({
    queryKey : ["SelectedCVS", id ],
    queryFn : async () => {
      const res = await APIFETCH.get<CvsRecord>(`/cvs/record/${id}`)
      return res.data
    },
    enabled : !!id
  })

  useEffect(()=>{
    if(data){
      setFormData(()=>({
        idNumber: data.idNumber ?? "",
        lgu: data.lgu ?? "",
        barangay: data.barangay ?? "",
        facilityName: data.facilityName ?? "",
        formType: data.formType ?? "",
        remarks: data.remarks ?? "",
        date: today,
      }))
    }
  },[data])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    const res  = await APIFETCH.post("/cvs/upload", formData)
    if(res.data.upload){
      show(`${res.data.message}`, "success")
      setButtonLoading(false)
    }else if(res.data.upload){
       show(`${res.data.message}`, "error")
      setButtonLoading(false)
    }

    setButtonLoading(false);
  };

  const handleReset = () => {setFormData({    
    idNumber: "",
    lgu: "",
    barangay: "",
    facilityName: "",
    formType: "",
    remarks: "",
    date: today,
  });
  navigate("/cvs")
  }


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
                  <label className={labelCls}>ID Number <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, idNumber: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter ID Number"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>LGU <span className="text-red-400">*</span></label>
                  <input type="text" name="lgu" value={formData.lgu} onChange={handleChange} className={inputCls} placeholder="Enter LGU" required />
                </div>
                <div>
                  <label className={labelCls}>Barangay <span className="text-red-400">*</span></label>
                  <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} className={inputCls} placeholder="Enter Barangay" required />
                </div>
              </div>
            </div>

            {/* Column 2 — Facility Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Facility Details</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>Facility Name <span className="text-red-400">*</span></label>
                  <input type="text" name="facilityName" value={formData.facilityName} onChange={handleChange} className={inputCls} placeholder="Enter Facility Name" required />
                </div>
                <div>
                  <label className={labelCls}> FORM TYPE <span className="text-red-400">*</span></label>
                  <select name="formType" value={formData.formType } onChange={handleChange} required className={inputCls}>
                    <option value="">Select</option>
                    <option value="F2">FORM 2 - Education</option>
                    <option value="F3">FORM 3 - HEALTH</option>
                    <option value="F4">FORM 4 - FDS</option>
                    <option value="F5">FORM 5 - F1KD</option>
                   </select>
                </div>
                <div>
                  <label className={labelCls}>Date Accomplished</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    readOnly
                    required
                    className={inputCls + " cursor-default"}
                  />
                </div>
              </div>
            </div>

            {/* Column 3 — Remarks & Submit */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">Remarks</h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>Remarks <span className="text-red-400">*</span></label>
                  <select name="remarks" value={formData.remarks} onChange={handleChange} required className={inputCls}>
                    <option value="">Select</option>
                    <option value="ENCODED">ENCODED</option>
                    <option value="ISSUE">ISSUE</option>
                  </select>
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
    </>
  );
}