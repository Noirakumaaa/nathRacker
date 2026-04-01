export const SectionHeader = ({ title }: { title: string }) => (
  <div className="pb-2 border-b border-[#e8e8e0]">
    <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

const FormLegend = () => (
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
);

export const PanelHeader = ({
  label,
  legend = true,
}: {
  label: string;
  legend?: boolean;
}) => (
  <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
    <p className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">
      {label}
    </p>
    {legend && <FormLegend />}
  </div>
);

export const SubmitRow = ({
  loading,
  submitLabel,
  onCancel,
  cancelLabel = "Reset",
}: {
  loading: boolean;
  submitLabel: string;
  onCancel: () => void;
  cancelLabel?: string;
}) => (
  <div className="flex gap-2.5 pt-1">
    <button
      type="submit"
      disabled={loading}
      className="flex-1 h-10 bg-[#1a1a18] text-white text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? "Saving…" : `${submitLabel} →`}
    </button>
    <button
      type="button"
      onClick={onCancel}
      disabled={loading}
      className="flex-1 h-10 bg-transparent text-[#1a1a18] text-[13px] font-medium rounded-lg border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {cancelLabel}
    </button>
  </div>
);

export const ListItem = ({
  label,
  sub,
  onDelete,
}: {
  label: string;
  sub?: string;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#e8e8e0] bg-[#f8f8f4] group">
    <div>
      <p className="text-[12px] font-medium text-[#1a1a18]">{label}</p>
      {sub && <p className="text-[10px] text-[#8a8a80] mt-0.5">{sub}</p>}
    </div>
    <button
      type="button"
      onClick={onDelete}
      className="text-[10px] font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wide hover:text-red-700"
    >
      Remove
    </button>
  </div>
);
