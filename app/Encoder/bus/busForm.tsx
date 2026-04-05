import React, { useEffect, useState } from "react";
import type { BusFormFields, BusRecord, BusResponse } from "~/types/busTypes";
import { UPDATE_TYPE_KEYMAP } from "~/types/busTypes";
import { labelCls, inputCls } from "component/styleConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import APIFETCH from "lib/axios/axiosConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Opt, Req } from "component/LabelStyle";
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

export default function BusForm() {
  const queryClient = useQueryClient();
  const busId = useSelectedID((s) => s.selectedIds.bus);
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId);
  const { show } = useToastStore();

  const [buttonLoading, setButtonLoading] = useState(false);
  const [today, setToday] = useState("");

  const [LguOption, setLguOption] = useState<Option[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

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

  // Set today's date
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  // Fetch selected bus record
  const { data } = useQuery({
    queryKey: ["SelectedBus", busId],
    queryFn: async () => {
      const res = await APIFETCH.get<BusRecord>(`/bus/records/${busId}`);
      return res.data ?? null;
    },
    enabled: !!busId,
    retry: false,
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

  // Populate form data when bus record loads
  useEffect(() => {
    if (data) {
      setFormData({
        lgu: data.lgu ?? "",
        barangay: data.barangay ?? "",
        hhId: data.hhId ?? "",
        granteeName: data.granteeName ?? "",
        subjectOfChange: data.subjectOfChange ?? "",
        typeOfUpdate: data.typeOfUpdate ?? "",
        updateInfo: data.updateInfo ?? "",
        issue: data.issue ?? "",
        remarks: data.remarks ?? "",
        drn: data.drn ?? "",
        cl: data.cl ?? "",
        note: data.note ?? "",
      });
    }
  }, [data]);

    // AUTO SET BARANGAY
    useEffect(() => {
    if (!data || !barangayOptions.length) return
  
    setFormData((prev) => ({
      ...prev,
      barangay: data.barangay?.toString() ?? "",
    }))
  }, [barangayOptions, data])

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Letters only input
  const handleLettersOnly = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "");
    handleInputChange(e);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    const res = await APIFETCH.post<BusResponse>("/bus/upload", formData);
    if (res.data.upload) {
      show(res.data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["recentBus"] });
      queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
      setButtonLoading(false);
      handleReset();
    } else {
      show(res.data.message, "error");
      setButtonLoading(false);
    }
  };

  // Reset form
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
    clearSelectedId("bus");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          Fill in the form below
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
            Selected Item : {busId ?? "NONE"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1 — Basic Info */}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className={
                    inputCls +
                    (formData.lgu ? "" : " opacity-70 cursor-not-allowed")
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

              {/* HH ID */}
              <div>
                <label htmlFor="hhId" className={labelCls}>
                  HH ID Number <Req />
                </label>
                <input
                  type="text"
                  id="hhId"
                  name="hhId"
                  value={formData.hhId}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9-]/g, "");
                    handleInputChange(e);
                  }}
                  className={inputCls}
                  placeholder="Enter HH ID"
                  required
                  maxLength={25}
                  minLength={6}
                />
              </div>

              {/* Grantee Name */}
              <div>
                <label htmlFor="granteeName" className={labelCls}>
                  Grantee Name <Req />
                </label>
                <input
                  type="text"
                  id="granteeName"
                  name="granteeName"
                  value={formData.granteeName}
                  onChange={handleLettersOnly}
                  className={inputCls}
                  placeholder="Enter Name"
                  required
                  maxLength={40}
                  minLength={6}
                />
              </div>

              {/* Subject of Change */}
              <div>
                <label htmlFor="subjectOfChange" className={labelCls}>
                  Subject of Change <Req />
                </label>
                <input
                  type="text"
                  id="subjectOfChange"
                  name="subjectOfChange"
                  value={formData.subjectOfChange}
                  onChange={handleLettersOnly}
                  className={inputCls}
                  placeholder="Enter Subject"
                  required
                  maxLength={40}
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Column 2 — Update Details */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Update Details
              </h3>
            </div>
            <div className="space-y-3.5">
              {/* Type of Update */}
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

              {/* Update Info */}
              <div>
                <label htmlFor="updateInfo" className={labelCls}>
                  Update Info <Req />
                </label>
                <input
                  type="text"
                  id="updateInfo"
                  name="updateInfo"
                  value={formData.updateInfo}
                  onChange={handleLettersOnly}
                  required
                  className={inputCls}
                  placeholder="Enter Update Info"
                  maxLength={50}
                  minLength={6}
                />
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remarks" className={labelCls}>
                  REMARKS <Req />
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

              {/* City Link */}
              <div>
                <label htmlFor="cl" className={labelCls}>
                  Assigned City Link or SWA <Req />
                </label>
                <input
                  type="text"
                  id="cl"
                  name="cl"
                  value={formData.cl}
                  onChange={handleLettersOnly}
                  required
                  className={inputCls}
                  placeholder="Enter City Link or SWA"
                  maxLength={50}
                  minLength={6}
                />
              </div>

              {/* Date */}
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
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">
                Additional Info
              </h3>
            </div>
            <div className="space-y-3.5">
              {/* Issue */}
              <div>
                <label htmlFor="issue" className={labelCls}>
                  Issues <Opt />
                </label>
                <textarea
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(
                      /[^a-zA-Z0-9. ]/g,
                      "",
                    );
                    handleInputChange(e);
                  }}
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Enter issues..."
                  maxLength={80}
                  minLength={6}
                />
              </div>

              {/* DRN */}
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
                  maxLength={4}
                  minLength={4}
                />
              </div>

              {/* Note */}
              <div>
                <label htmlFor="note" className={labelCls}>
                  Note <Opt />
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(
                      /[^a-zA-Z0-9. ]/g,
                      "",
                    );
                    handleInputChange(e);
                  }}
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Enter note..."
                  maxLength={80}
                  minLength={6}
                />
              </div>

              {/* Submit / Reset */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={buttonLoading}
                  className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {buttonLoading ? "Submitting…" : "Submit →"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={buttonLoading}
                  className="flex-1 h-10 bg-transparent text-(--color-ink) text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
