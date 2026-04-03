import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import APIFETCH from "lib/axios/axiosConfig";
import { inputCls, labelCls } from "component/styleConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import type { BusFormFields } from "~/types/busTypes";
import type { SwdiFormFields } from "~/types/swdiTypes";
import type { LcnFormFields } from "~/types/lcnTypes";
import type { CvsFormFields } from "~/types/cvsTypes";
import type { MiscFormFields } from "~/types/miscTypes";
import { queryClient } from "~/root";

// ── Types ──────────────────────────────────────────────────────────────────────

type DocType = "BUS" | "SWDI" | "PCN" | "CVS" | "MISC";
type AnyFormFields = BusFormFields | SwdiFormFields | LcnFormFields | CvsFormFields | MiscFormFields;

export type EditModalItem = {
  documentType: string;
  documentId: number;
};

type Props = {
  item: EditModalItem | null;
  onClose: () => void;
  onSaved: () => void;
};

// ── Config ─────────────────────────────────────────────────────────────────────

const FETCH_ENDPOINT: Record<DocType, string> = {
  BUS:  "/bus/records",
  SWDI: "/swdi/record",
  PCN:  "/lcn/record",
  CVS:  "/cvs/record",
  MISC: "/miscellaneous/record",
};

const SAVE_ENDPOINT: Record<DocType, string> = {
  BUS:  "/bus/update",
  SWDI: "/swdi/update",
  PCN:  "/lcn/update",
  CVS:  "/cvs/update",
  MISC: "/miscellaneous/update",
};

const REMARKS_OPTIONS = ["ENCODED", "ISSUE", "UPDATED", "PENDING"];

// ── Shared field components ────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ name, value, onChange, placeholder }: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  return <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className={inputCls} />;
}

function SelectInput({ name, value, onChange, options }: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[];
}) {
  return (
    <select name={name} value={value} onChange={onChange} className={inputCls}>
      <option value="">— Select —</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TextArea({ name, value, onChange, placeholder }: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      className={inputCls + " resize-none"}
    />
  );
}

// ── Per-type form fields ───────────────────────────────────────────────────────

function BusFields({ data, onChange }: { data: BusFormFields; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="HH ID"><TextInput name="hhId" value={data.hhId} onChange={onChange} /></Field>
      <Field label="DRN"><TextInput name="drn" value={data.drn} onChange={onChange} /></Field>
      <Field label="LGU"><TextInput name="lgu" value={data.lgu} onChange={onChange} /></Field>
      <Field label="Barangay"><TextInput name="barangay" value={data.barangay} onChange={onChange} /></Field>
      <Field label="Grantee Name"><TextInput name="granteeName" value={data.granteeName} onChange={onChange} /></Field>
      <Field label="CL"><TextInput name="cl" value={data.cl} onChange={onChange} /></Field>
      <Field label="Subject of Change"><TextInput name="subjectOfChange" value={data.subjectOfChange} onChange={onChange} /></Field>
      <Field label="Type of Update"><TextInput name="typeOfUpdate" value={data.typeOfUpdate} onChange={onChange} /></Field>
      <Field label="Update Info"><TextInput name="updateInfo" value={data.updateInfo} onChange={onChange} /></Field>
      <Field label="Issue"><TextInput name="issue" value={data.issue} onChange={onChange} /></Field>
      <Field label="Remarks"><SelectInput name="remarks" value={data.remarks} onChange={onChange} options={REMARKS_OPTIONS} /></Field>
      <Field label="Note"><TextArea name="note" value={data.note} onChange={onChange} /></Field>
    </div>
  );
}

function SwdiFields({ data, onChange }: { data: SwdiFormFields; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="HH ID"><TextInput name="hhId" value={data.hhId} onChange={onChange} /></Field>
      <Field label="DRN"><TextInput name="drn" value={data.drn ?? ""} onChange={onChange} /></Field>
      <Field label="LGU"><TextInput name="lgu" value={data.lgu} onChange={onChange} /></Field>
      <Field label="Barangay"><TextInput name="barangay" value={data.barangay} onChange={onChange} /></Field>
      <Field label="Grantee"><TextInput name="grantee" value={data.grantee} onChange={onChange} /></Field>
      <Field label="CL"><TextInput name="cl" value={data.cl ?? ""} onChange={onChange} /></Field>
      <Field label="SWDI Score"><TextInput name="swdiScore" value={data.swdiScore} onChange={onChange} /></Field>
      <Field label="SWDI Level"><TextInput name="swdiLevel" value={data.swdiLevel} onChange={onChange} /></Field>
      <Field label="Issue"><TextInput name="issue" value={data.issue ?? ""} onChange={onChange} /></Field>
      <Field label="Remarks"><SelectInput name="remarks" value={data.remarks} onChange={onChange} options={REMARKS_OPTIONS} /></Field>
      <Field label="Note"><TextArea name="note" value={data.note ?? ""} onChange={onChange} /></Field>
    </div>
  );
}

function PcnFields({ data, onChange }: { data: LcnFormFields; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="HH ID"><TextInput name="hhId" value={data.hhId} onChange={onChange} /></Field>
      <Field label="DRN"><TextInput name="drn" value={data.drn} onChange={onChange} /></Field>
      <Field label="LGU"><TextInput name="lgu" value={data.lgu} onChange={onChange} /></Field>
      <Field label="Barangay"><TextInput name="barangay" value={data.barangay} onChange={onChange} /></Field>
      <Field label="Grantee Name"><TextInput name="granteeName" value={data.granteeName} onChange={onChange} /></Field>
      <Field label="CL"><TextInput name="cl" value={data.cl} onChange={onChange} /></Field>
      <Field label="PCN"><TextInput name="pcn" value={data.pcn} onChange={onChange} /></Field>
      <Field label="LRN"><TextInput name="lrn" value={data.lrn} onChange={onChange} /></Field>
      <Field label="Subject of Change"><TextInput name="subjectOfChange" value={data.subjectOfChange} onChange={onChange} /></Field>
      <Field label="Issue"><TextInput name="issue" value={data.issue} onChange={onChange} /></Field>
      <Field label="Remarks"><SelectInput name="remarks" value={data.remarks} onChange={onChange} options={REMARKS_OPTIONS} /></Field>
      <Field label="Note"><TextArea name="note" value={data.note} onChange={onChange} /></Field>
    </div>
  );
}

function CvsFields({ data, onChange }: { data: CvsFormFields; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="ID Number"><TextInput name="idNumber" value={data.idNumber} onChange={onChange} /></Field>
      <Field label="LGU"><TextInput name="lgu" value={data.lgu} onChange={onChange} /></Field>
      <Field label="Barangay"><TextInput name="barangay" value={data.barangay} onChange={onChange} /></Field>
      <Field label="Facility Name"><TextInput name="facilityName" value={data.facilityName} onChange={onChange} /></Field>
      <Field label="Form Type"><TextInput name="formType" value={data.formType} onChange={onChange} /></Field>
      <Field label="Period"><TextInput name="period" value={data.period} onChange={onChange} /></Field>
      <Field label="Issue"><TextInput name="issue" value={data.issue ?? ""} onChange={onChange} /></Field>
      <Field label="Remarks"><SelectInput name="remarks" value={data.remarks} onChange={onChange} options={REMARKS_OPTIONS} /></Field>
    </div>
  );
}

function MiscFields({ data, onChange }: { data: MiscFormFields; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="HH ID"><TextInput name="hhId" value={data.hhId} onChange={onChange} /></Field>
      <Field label="DRN"><TextInput name="drn" value={data.drn} onChange={onChange} /></Field>
      <Field label="LGU"><TextInput name="lgu" value={data.lgu} onChange={onChange} /></Field>
      <Field label="Barangay"><TextInput name="barangay" value={data.barangay} onChange={onChange} /></Field>
      <Field label="Grantee Name"><TextInput name="granteeName" value={data.granteeName} onChange={onChange} /></Field>
      <Field label="CL"><TextInput name="cl" value={data.cl} onChange={onChange} /></Field>
      <Field label="Subject of Change"><TextInput name="subjectOfChange" value={data.subjectOfChange} onChange={onChange} /></Field>
      <Field label="Issue"><TextInput name="issue" value={data.issue} onChange={onChange} /></Field>
      <Field label="Remarks"><SelectInput name="remarks" value={data.remarks} onChange={onChange} options={REMARKS_OPTIONS} /></Field>
      <Field label="Note"><TextArea name="note" value={data.note} onChange={onChange} /></Field>
    </div>
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────────

export function EditModal({ item, onClose, onSaved }: Props) {
  const { show } = useToastStore();
  const [formData, setFormData] = useState<AnyFormFields | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(false);

  // fetch the full record when the modal opens
useEffect(() => {
  if (!item) return;

  setFormData(null);
  setFetching(true);

  const endpoint = FETCH_ENDPOINT[item.documentType as DocType];

  APIFETCH.get(`${endpoint}/${item.documentId}`)
    .then((res) => {
      const data = res.data;

      const {
        date,
        encodedBy,
        verifiedBy,
        userId,
        operationsOfficeNumId,
        createdAt,
        updatedAt,
        ...cleanedData
      } = data;

      setFormData(cleanedData);
    })
    .finally(() => setFetching(false));
}, [item]);

  if (!item) return null;

  const type = item.documentType as DocType;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value.toUpperCase() } : prev);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    try {
      const res = await APIFETCH.patch(SAVE_ENDPOINT[type], formData);
      if (res.data.update) {
        show(res.data.message ?? "Saved successfully.", "success");
        onSaved();
        onClose();
        queryClient.invalidateQueries({queryKey : ["allDocuments"]})
      } else {
        show(res.data.message ?? "Failed to save.", "error");
      }
    } catch {
      show("An error occurred while saving.", "error");
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<DocType, string> = {
    BUS:  "bg-indigo-50 text-indigo-600",
    SWDI: "bg-emerald-50 text-emerald-600",
    PCN:  "bg-rose-50 text-rose-600",
    CVS:  "bg-sky-50 text-sky-600",
    MISC: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-(--color-ink)/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-(--color-surface) rounded-2xl w-full max-w-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border border-(--color-border) shadow-[0_24px_60px_rgba(0,0,0,0.15)]">

        {/* Top accent */}
        <div className="h-px w-full bg-linear-to-r from-violet-400 via-purple-400 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border) shrink-0">
          <div className="flex items-center gap-3">
            <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-md ${typeColors[type]}`}>
              {type}
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-(--color-ink)">Edit Record</h2>
              <p className="text-[11px] text-(--color-muted) mt-0.5">Changes will be saved immediately</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer bg-(--color-surface)"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <form id="edit-form" onSubmit={handleSave} className="overflow-y-auto px-6 py-5 flex-1">
          {fetching || !formData ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-(--color-placeholder)">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-[13px]">Loading record…</span>
            </div>
          ) : (
            <>
              {type === "BUS"  && <BusFields  data={formData as BusFormFields}  onChange={handleChange} />}
              {type === "SWDI" && <SwdiFields data={formData as SwdiFormFields} onChange={handleChange} />}
              {type === "PCN"  && <PcnFields  data={formData as LcnFormFields}  onChange={handleChange} />}
              {type === "CVS"  && <CvsFields  data={formData as CvsFormFields}  onChange={handleChange} />}
              {type === "MISC" && <MiscFields data={formData as MiscFormFields} onChange={handleChange} />}
            </>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-(--color-border) flex items-center justify-end gap-2 bg-(--color-bg) rounded-b-2xl shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 text-[13px] font-medium text-(--color-muted) bg-(--color-surface) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-form"
            disabled={loading || fetching || !formData}
            className="inline-flex items-center gap-2 px-5 py-2 text-[13px] font-medium bg-(--color-ink) text-(--color-bg) rounded-lg hover:opacity-85 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
