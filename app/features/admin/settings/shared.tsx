export const SectionHeader = ({ title }: { title: string }) => (
  <div className="pb-2 border-b border-(--color-border)">
    <h3 className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider">{title}</h3>
  </div>
);

const FormLegend = () => (
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" /> Required
    </span>
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-(--color-muted) bg-(--color-subtle) border border-(--color-border) px-2 py-0.5 rounded-md">
      <span className="w-1.5 h-1.5 rounded-full bg-(--color-placeholder) inline-block shrink-0" /> Optional
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
  <div className="px-5 py-3.5 border-b border-(--color-border) flex items-center justify-between bg-(--color-surface)">
    <p className="text-[12px] font-semibold text-(--color-ink)">{label}</p>
    {legend && <FormLegend />}
  </div>
);

export const SubmitRow = ({
  loading,
  submitLabel,
  onCancel,
  cancelLabel = "Clear",
}: {
  loading: boolean;
  submitLabel: string;
  onCancel: () => void;
  cancelLabel?: string;
}) => (
  <div className="flex gap-2 pt-2">
    <button
      type="submit"
      disabled={loading}
      className="flex-1 h-9 bg-(--color-ink) text-(--color-bg) text-[13px] font-medium rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? "Saving…" : submitLabel}
    </button>
    <button
      type="button"
      onClick={onCancel}
      disabled={loading}
      className="flex-1 h-9 text-(--color-ink) text-[13px] font-medium rounded-lg border border-(--color-border) hover:border-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-transparent"
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
  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-(--color-border) bg-(--color-surface) group hover:border-(--color-ink) transition-colors">
    <div className="min-w-0 mr-2">
      <p className="text-[12px] font-medium text-(--color-ink) truncate">{label}</p>
      {sub && <p className="text-[10px] text-(--color-muted) mt-0.5 truncate">{sub}</p>}
    </div>
    <button
      type="button"
      onClick={onDelete}
      className="shrink-0 text-[10px] font-semibold text-(--color-placeholder) group-hover:text-red-500 transition-colors uppercase tracking-wide cursor-pointer hover:text-red-600 bg-transparent border-none"
    >
      Remove
    </button>
  </div>
);
