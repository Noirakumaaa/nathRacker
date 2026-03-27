import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useState, useEffect } from "react";
import type { LcnFormFields } from "~/types/lcnTypes";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import type { RouteParams } from "~/types/authTypes";
import { useToastStore } from "lib/zustand/ToastStore";
import { labelCls, inputCls } from "component/styleConfig";
import { queryClient } from "~/root";

export function LcnForm() {
  const { id } = useParams<RouteParams>();
  const { show } = useToastStore();

  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  const [buttonLoading, setButtonLoading] = useState(false);

  const [formData, setFormData] = useState<LcnFormFields>({
    lgu: "",
    barangay: "",
    hhId: "",
    granteeName: "",
    remarks: "",
    issue: "",
    encodedBy: "",
    subjectOfChange: "",
    pcn: "",
    lrn: "",
    drn: "",
    cl: "",
    date: today,
    note: "",
  });

  const { data } = useQuery({
    queryKey: ["SelectedLcn", id],
    queryFn: async () => {
      const res = await APIFETCH.get(`/lcn/record/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!data) return;
    setFormData({
      lgu: data.lgu ?? "",
      barangay: "",
      hhId: "",
      granteeName: "",
      remarks: "",
      issue: "",
      encodedBy: "",
      subjectOfChange: "",
      pcn: "",
      lrn: "",
      drn: "",
      cl: "",
      date: today,
      note: "",
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
    const res = await APIFETCH.post(`/lcn/upload`, formData);
    if (res.data.upload) {
      show(`${res.data.message}`, "success");
      setButtonLoading(false);
      queryClient.invalidateQueries({ queryKey: ["RecentLcn"] });
    } else if (!res.data.upload) {
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
      remarks: "",
      issue: "",
      encodedBy: "",
      subjectOfChange: "",
      pcn: "",
      lrn: "",
      drn: "",
      cl: "",
      date: today,
      note: "",
    });
    navigate("/lcn");
  };

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
            {/* Column 1 — Basic Information */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-3.5">
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
                  <label className={labelCls}>Grantee Name</label>
                  <input
                    type="text"
                    name="granteeName"
                    value={formData.granteeName}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Name"
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
                    Subject of Change <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subjectOfChange"
                    value={formData.subjectOfChange}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Subject"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Column 2 — PCN Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  PCN Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    PCN{" "}
                    <span className="text-[#c4c4b8] normal-case tracking-normal font-normal">
                      (at least one of PCN / TR required)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="pcn"
                    value={formData.pcn}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter PCN"
                  />
                </div>
                <div>
                  <label className={labelCls}>LRN</label>
                  <input
                    type="text"
                    name="lrn"
                    value={formData.lrn}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter TR"
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Encoded Y/N <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
                    <option value="">Select</option>
                    <option value="YES">Yes</option>
                    <option value="NO">No</option>
                    <option value="UPDATED">Updated</option>
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

            {/* Column 3 — Additional Info */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#e8e8e0]">
                <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Additional Info
                </h3>
              </div>
              <div className="space-y-3.5">
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
