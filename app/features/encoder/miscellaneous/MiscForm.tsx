import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIFETCH from "~/lib/axios/axiosConfig";
import { labelCls, inputCls } from "~/components/styleConfig";
import { useToastStore } from "~/lib/zustand/ToastStore";
import { Req } from "~/components/LabelStyle";
import { useSelectedID } from "~/lib/zustand/selectedId";
import { MiscFormSchema, type MiscFormValues } from "~/lib/validation/schemas";

interface LGU {
  id: string | number;
  name: string;
  barangay: { id: string | number; name: string }[];
}

interface Option {
  value: string;
  label: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-red-500">{message}</p>;
}

const today = new Date().toISOString().slice(0, 10);

const EMPTY_FORM: MiscFormValues = {
  lgu: "", barangay: "", hhId: "", granteeName: "",
  subjectOfChange: "", documentType: "", cl: "",
  remarks: "ENCODED", issue: "", drn: "", note: "", date: today,
};

export default function MiscForm() {
  const queryClient = useQueryClient();
  const miscId = useSelectedID((s) => s.selectedIds.misc);
  const clearSelectedId = useSelectedID((s) => s.clearSelectedId);
  const { show } = useToastStore();

  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<MiscFormValues>({
    resolver: zodResolver(MiscFormSchema),
    defaultValues: EMPTY_FORM,
    mode: "onBlur",
  });

  const selectedLgu = watch("lgu");
  const selectedRemarks = watch("remarks");

  // ── Fetch selected record ────────────────────────────────────
  const { data } = useQuery({
    queryKey: ["SelectedMisc", miscId],
    queryFn: () => APIFETCH.get(`/miscellaneous/record/${miscId}`).then((r) => r.data),
    enabled: !!miscId,
  });

  // ── Fetch LGU list ───────────────────────────────────────────
  const { data: lguList } = useQuery<LGU[]>({
    queryKey: ["LGU"],
    queryFn: () => APIFETCH.get<LGU[]>("/bus/lgu").then((r) => r.data),
  });

  const lguOptions: Option[] =
    lguList?.map((l) => ({ value: l.id.toString(), label: l.name })) ?? [];

  // ── Cascade ──────────────────────────────────────────────────
  useEffect(() => {
    if (!lguList) return;
    const found = lguList.find((l) => l.id.toString() === selectedLgu);
    const opts = found?.barangay.map((b) => ({ value: b.id.toString(), label: b.name })) ?? [];
    setBarangayOptions(opts);
    setValue("barangay", "");
  }, [selectedLgu, lguList, setValue]);

  // ── Populate on edit ─────────────────────────────────────────
  useEffect(() => {
    if (!data) return;
    reset({
      lgu:             data.lgu ?? "",
      barangay:        data.barangay ?? "",
      hhId:            data.hhId ?? "",
      granteeName:     data.granteeName ?? "",
      subjectOfChange: data.subjectOfChange ?? "",
      documentType:    data.documentType ?? "",
      cl:              data.cl ?? "",
      remarks:         (data.remarks as MiscFormValues["remarks"]) ?? "ENCODED",
      issue:           data.issue ?? "",
      drn:             data.drn ?? "",
      note:            data.note ?? "",
      date:            today,
    });
  }, [data, reset]);

  useEffect(() => {
    if (!data || !barangayOptions.length) return;
    setValue("barangay", data.barangay?.toString() ?? "");
  }, [barangayOptions, data, setValue]);

  // ── Submit ───────────────────────────────────────────────────
  const onSubmit = async (values: MiscFormValues) => {
    try {
      const res = await APIFETCH.post("/miscellaneous/upload", values);
      if (res.data.upload) {
        show(res.data.message, "success");
        queryClient.invalidateQueries({ queryKey: ["recentMisc"] });
        queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
        handleReset();
      } else {
        show(res.data.message, "error");
      }
    } catch {
      show("An unexpected error occurred. Please try again.", "error");
    }
  };

  const handleReset = () => {
    reset(EMPTY_FORM);
    clearSelectedId("misc");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-(--color-surface) rounded-xl border border-(--color-border) overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
        <p className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">
          Fill in the form below
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
          Selected Item : {miscId ?? "NONE"}
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1 — Basic Information */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">Basic Information</h3>
            </div>
            <div className="space-y-3.5">

              <div>
                <label htmlFor="lgu" className={labelCls}>LGU <Req /></label>
                <select id="lgu" className={inputCls} {...register("lgu")}>
                  <option value="">--Select LGU--</option>
                  {lguOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <FieldError message={errors.lgu?.message} />
              </div>

              <div>
                <label htmlFor="barangay" className={labelCls}>Barangay <Req /></label>
                <select
                  id="barangay"
                  className={inputCls + (!selectedLgu ? " opacity-80 cursor-not-allowed" : "")}
                  disabled={!selectedLgu}
                  {...register("barangay")}
                >
                  <option value="">--Select Barangay--</option>
                  {barangayOptions.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
                <FieldError message={errors.barangay?.message} />
              </div>

              <div>
                <label className={labelCls}>HH ID Number <Req /></label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter HH ID"
                  maxLength={25}
                  {...register("hhId", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^0-9-]/g, "");
                    },
                  })}
                />
                <FieldError message={errors.hhId?.message} />
              </div>

              <div>
                <label className={labelCls}>Grantee Name <Req /></label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter Name"
                  maxLength={40}
                  {...register("granteeName", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "");
                    },
                  })}
                />
                <FieldError message={errors.granteeName?.message} />
              </div>

              <div>
                <label className={labelCls}>Subject of Change <Req /></label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter Subject"
                  maxLength={40}
                  {...register("subjectOfChange", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "");
                    },
                  })}
                />
                <FieldError message={errors.subjectOfChange?.message} />
              </div>
            </div>
          </div>

          {/* Column 2 — Document Details */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">Document Details</h3>
            </div>
            <div className="space-y-3.5">

              <div>
                <label className={labelCls}>Document Type <Req /></label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter Document Type"
                  {...register("documentType")}
                />
                <FieldError message={errors.documentType?.message} />
              </div>

              <div>
                <label className={labelCls}>REMARKS <Req /></label>
                <select className={inputCls} {...register("remarks")}>
                  <option value="">Select</option>
                  <option value="ENCODED">ENCODED</option>
                  <option value="SCANNED">SCANNED</option>
                  <option value="TRACKED">TRACKED</option>
                  <option value="UPDATED">UPDATED</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="ISSUE">ISSUE</option>
                </select>
                <FieldError message={errors.remarks?.message} />
              </div>

              <div>
                <label className={labelCls}>Assigned City Link or SWA <Req /></label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter City Link or SWA"
                  maxLength={50}
                  {...register("cl", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^a-zA-Z.,' ]/g, "");
                    },
                  })}
                />
                <FieldError message={errors.cl?.message} />
              </div>

              <div>
                <label className={labelCls}>DRN</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Enter DRN"
                  {...register("drn")}
                />
              </div>

              <div>
                <label className={labelCls}>Date Accomplished</label>
                <input
                  type="date"
                  readOnly
                  value={today}
                  className={inputCls + " cursor-default"}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* Column 3 — Additional Info */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-(--color-border)">
              <h3 className="text-[11px] font-semibold text-(--color-ink) uppercase tracking-wider">Additional Info</h3>
            </div>
            <div className="space-y-3.5">

              <div>
                <label className={labelCls}>
                  Issues {selectedRemarks === "ISSUE" ? <Req /> : null}
                </label>
                <textarea
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Enter issues..."
                  maxLength={80}
                  {...register("issue")}
                />
                <FieldError message={errors.issue?.message} />
              </div>

              <div>
                <label className={labelCls}>Note</label>
                <textarea
                  rows={2}
                  className={inputCls + " resize-none"}
                  placeholder="Enter note..."
                  maxLength={80}
                  {...register("note")}
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting…" : "Submit →"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
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
  );
}
