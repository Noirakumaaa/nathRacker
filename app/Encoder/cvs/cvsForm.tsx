import { useState, useEffect } from "react";
import type { CvsRecord, CvsFormFields } from "~/types/cvsTypes";
import { labelCls, inputCls } from "component/styleConfig";
import { useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import { Opt, Req } from "component/LabelStyle";
import { useQueryClient } from "@tanstack/react-query";
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

export function CvsForm() {
  const queryClient = useQueryClient();
  const cvsId = useSelectedID((state)=>state.selectedIds.cvs)
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId);
  const { show } = useToastStore();
  const today = new Date().toISOString().slice(0, 10);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [LguOption, setLguOption] = useState<Option[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

  const [formData, setFormData] = useState<CvsFormFields>({
    idNumber: "",
    lgu: "",
    barangay: "",
    facilityName: "",
    formType: "",
    remarks: "",
    period: "",
    issue: " ",
    date: today,
  });

  const { data } = useQuery({
    queryKey: ["SelectedCVS", cvsId],
    queryFn: async () => {
      const res = await APIFETCH.get<CvsRecord>(`/cvs/record/${cvsId}`);
      return res.data;
    },
    enabled: !!cvsId,
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
    if (data) {
      setFormData(() => ({
        idNumber: data.idNumber ?? "",
        lgu: data.lgu ?? "",
        barangay: data.barangay ?? "",
        facilityName: data.facilityName ?? "",
        formType: data.formType ?? "",
        remarks: data.remarks ?? "",
        period: data.period ?? "",
        issue: data.issue ?? " ",
        date: today,
      }));
    }
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
    const res = await APIFETCH.post("/cvs/upload", formData);
    if (res.data.upload) {
      show(`${res.data.upload}`, "success");
      queryClient.invalidateQueries({ queryKey: ["recentCvs"] });
      setButtonLoading(false);
      handleReset();
    } else if (!res.data.upload) {
      show(`${res.data.message}`, "error");
      setButtonLoading(false);
    }

    setButtonLoading(false);
  };

  const handleReset = () => {
    setFormData({
      idNumber: "",
      lgu: "",
      barangay: "",
      facilityName: "",
      formType: "",
      remarks: "",
      period: "",
      date: today,
    });
    clearSelectedId("cvs");
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
            Selected Item : {cvsId ?? "NONE"}
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
                    ID Number <Req />
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        idNumber: e.target.value,
                      }))
                    }
                    className={inputCls}
                    placeholder="Enter ID Number"
                    required
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
              </div>
            </div>

            {/* Column 2 — Facility Details */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                  Facility Details
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    Facility Name <Req />
                  </label>
                  <input
                    type="text"
                    name="facilityName"
                    value={formData.facilityName}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Enter Facility Name"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    {" "}
                    FORM TYPE <Req />
                  </label>
                  <select
                    name="formType"
                    value={formData.formType}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  >
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
              <div className="pb-2 border-b border-(--color-border)">
                <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                  Remarks
                </h3>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className={labelCls}>
                    Remarks <Req />
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
                    <option value="UPDATED">UPDATED</option>
                    <option value="ISSUE">ISSUE</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>
                    Period <Req />
                  </label>
                  <input
                    type="text"
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    required
                    placeholder="Enter CVS PERIOD"
                    className={inputCls + " cursor-default"}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Issue <Opt />
                  </label>
                  <input
                    type="text"
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    required
                    placeholder="Enter ISSUE"
                    className={inputCls + " cursor-default"}
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
