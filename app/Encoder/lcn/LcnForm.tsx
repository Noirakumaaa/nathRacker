import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useState, useEffect } from "react";
import type { LcnFormFields } from "~/types/lcnTypes";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import type { RouteParams } from "~/types/authTypes";
import { useToastStore } from "lib/zustand/ToastStore";
import { labelCls, inputCls } from "component/styleConfig";

interface Option {
  value: string | number;
  label: string;
}

interface LGU {
  id: string | number;
  name: string;
  barangay: BARANGAY[];
}

interface BARANGAY {
  id: string | number;
  name: string;
}

import { Req } from "component/LabelStyle";
import { useSelectedID } from "lib/zustand/selectedId";
export function LcnForm() {
  const queryClient = useQueryClient();
  const { show } = useToastStore()
  const lcnId = useSelectedID((state) => state.selectedIds.lcn)
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId);

  const today = new Date().toISOString().slice(0, 10);

  const [buttonLoading, setButtonLoading] = useState(false);

  const [LguOption, setLguOption] = useState<Option[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

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
    queryKey: ["SelectedLcn", lcnId],
    queryFn: async () => {
      const res = await APIFETCH.get(`/lcn/record/${lcnId}`);
      return res.data;
    },
    enabled: !!lcnId,
  });

  // Fetch LGU list
  const { data: lgu } = useQuery({
    queryKey: ["LGU"],
    queryFn: async () => {
      const res = await APIFETCH.get<LGU[]>("/bus/lgu");
      return res.data;
    },
  });

  // Format LGU options
  useEffect(() => {
    if (!lgu) return;
    const formattedOptions: Option[] = lgu.map((item) => ({
      value: item.id.toString(),
      label: item.name,
    }));
    setLguOption(formattedOptions);
  }, [lgu]);

  // Update Barangay options when LGU changes
  useEffect(() => {
    if (!lgu) return;

    // Log LGU names
    lgu.forEach((l) => console.log("LGU name:", l.name));

    const selectedLgu = lgu.find(
      (l) => l.id.toString() === formData.lgu.toString(),
    );
    console.log("Selected LGU:", selectedLgu?.name);

    const options =
      selectedLgu?.barangay.map((b) => ({
        value: b.id.toString(),
        label: b.name,
      })) || [];

    setBarangayOptions(options);

    // Reset barangay if LGU changes
    setFormData((prev) => ({ ...prev, barangay: "" }));
  }, [formData.lgu, lgu]);

  useEffect(() => {
    if (!data) return;
    setFormData({
      lgu: data.lgu ?? "",
      barangay: data.barangay ?? "",
      hhId: data.hhId ?? "",
      granteeName: data.granteeName ?? "",
      remarks: data.remarks ?? "",
      issue: data.issue ?? "",
      encodedBy: data.encodedBy ?? "",
      subjectOfChange: data.subjectOfChange ?? "",
      pcn: data.pcn ?? "",
      lrn: data.lrn ?? "",
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

  const handlePcnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
    const formatted = digits.match(/.{1,4}/g)?.join("-") ?? digits;
    setFormData((prev) => ({ ...prev, pcn: formatted }));
  };

  const handlelettersonly = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z. 1-5 ]/g, "");
    handleChange(e);
  };

  const handledigitonly = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9-]/g, "");
    handleChange(e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.pcn.trim() && !formData.lrn.trim()) {
      show("Please enter at least one of PCN or LRN.", "error");
      return;
    }
    setButtonLoading(true);

      const res = await APIFETCH.post(`/lcn/upload`, formData);
      if (res.data.upload) {
        show(`${res.data.message}`, "success");
        queryClient.invalidateQueries({ queryKey: ["recentLcn"] });
        queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
        setButtonLoading(false);
        handleReset();
      } else {
        show(`${res.data.message}`, "error");
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
    clearSelectedId("lcn");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden"
      >
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          Fill in the form below
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
            Selected Item : {lcnId ?? "NONE"}
          </span>
        </div>
      </div>



        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1 — Basic Information */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    HH ID Number <Req />
                  </label>
                  <input
                    type="text"
                    name="hhId"
                    value={formData.hhId}
                    onChange={handledigitonly}
                    className={inputCls}
                    placeholder="Enter HH ID"
                    required
                    maxLength={25}
                    minLength={6}
                  />
                </div>

                {/* LGU */}
                <div>
                  <label htmlFor="lgu" className={labelCls}>
                    LGU <Req />
                  </label>
                  <select
                    id="lgu"
                    name="lgu"
                    value={formData.lgu}
                    onChange={handleChange}
                    className={inputCls}
                    required
                  >
                    <option value="">--Select LGU--</option>
                    {LguOption.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Barangay */}
                <div>
                  <label htmlFor="barangay" className={labelCls}>
                    Barangay <Req />
                  </label>
                  <select
                    id="barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className={
                      inputCls +
                      (formData.lgu ? "" : " opacity-80 cursor-not-allowed")
                    }
                    required
                    disabled={!formData.lgu}
                  >
                    <option value="">--Select Barangay--</option>
                    {barangayOptions.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>
                    Grantee Name <Req />
                  </label>
                  <input
                    type="text"
                    name="granteeName"
                    value={formData.granteeName}
                    onChange={handlelettersonly}
                    className={inputCls}
                    placeholder="Enter Name"
                    required
                    maxLength={50}
                    minLength={6}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Subject of Change <Req />
                  </label>
                  <input
                    type="text"
                    name="subjectOfChange"
                    value={formData.subjectOfChange}
                    onChange={handlelettersonly}
                    className={inputCls}
                    placeholder="Enter Subject"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Column 2 — PCN Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                  PCN Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    PCN{" "}
                    <span className="text-(--color-placeholder) normal-case tracking-normal font-normal">
                      (at least one of PCN / LRN required)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="pcn"
                    value={formData.pcn}
                    onChange={handlePcnChange}
                    className={inputCls}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    LRN{" "}
                    <span className="text-(--color-placeholder) normal-case tracking-normal font-normal">
                      (at least one of PCN / LRN required)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="lrn"
                    value={formData.lrn}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter LRN"
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    REMARKS
                    <Req />
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
                    <option value="ISSUE">ISSUE</option>
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
                    maxLength={25}
                    minLength={6}
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
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
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
                    maxLength={9}
                    minLength={6}
                  />
                </div>
                <div>
                  <label className={labelCls}>Issues</label>
                  <textarea
                    name="issue"
                    value={formData.issue}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value; // you can sanitize here if needed
                      setFormData((data) => ({
                        ...data,
                        issue: sanitizedValue,
                      }));
                    }}
                    rows={2}
                    className={inputCls + " resize-none"}
                    placeholder="Enter issues..."
                    maxLength={85}
                    minLength={6}
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
                    maxLength={85}
                    minLength={6}
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={buttonLoading}
                    className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {buttonLoading ? "Submitting…" : "Submit →"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={buttonLoading}
                    className="flex-1 h-10 bg-transparent text-(--color-ink) text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors cursor-pointer disabled:opacity-50"
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
