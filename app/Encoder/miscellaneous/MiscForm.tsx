import React, { useEffect, useState } from "react";
import type {
  MiscRecord,
  MiscFormFields,
} from "./../../types/miscTypes";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import type { RouteParams } from "~/types/authTypes";
import { labelCls, inputCls } from "component/styleConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { Req } from "component/LabelStyle";
import { useSelectedID } from "lib/zustand/selectedId";

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

export default function MiscForm() {

  const miscId = useSelectedID((state)=> state.selectedIds.misc)
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId);
  const queryClient = useQueryClient()
  const { show } = useToastStore();
  const today = new Date().toISOString().slice(0, 10);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [LguOption, setLguOption] = useState<Option[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

  const [formData, setFormData] = useState<MiscFormFields>({
    lgu: "",
    barangay: "",
    hhId: "",
    granteeName: "",
    documentType: "",
    remarks: "",
    issue: "",
    subjectOfChange: "",
    drn: "",
    cl: "",
    date: today,
    note: "",
  });

  const { data } = useQuery({
    queryKey: ["SelectedMisc", miscId],
    queryFn: async () => {
      const res = await APIFETCH.get<MiscRecord>(`/miscellaneous/record/${miscId}`);
      return res.data;
    },
    enabled: !!miscId,
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
      documentType: data.documentType ?? "",
      remarks: data.remarks ?? "",
      issue: data.issue ?? "",
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
    const res = await APIFETCH.post("/miscellaneous/upload", formData);
    if (res.data.upload) {
      show(`${res.data.message}`, "success");
      queryClient.invalidateQueries({ queryKey: ["recentMisc"] });
      setButtonLoading(false);
      handleReset();
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
      documentType: "",
      remarks: "",
      issue: "",
      subjectOfChange: "",
      drn: "",
      cl: "",
      date: today,
      note: "",
    });
    clearSelectedId("misc");
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
            Selected Item : {miscId ?? "NONE"}
          </span>
        </div>
      </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-3.5">
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
                    HH ID Number <Req />
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
                    Grantee Name <Req />
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
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                  Document Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    Document Type <Req />
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
                    REMARKS <Req />
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
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
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
