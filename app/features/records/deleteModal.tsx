import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({ open, onConfirm, onCancel }: DeleteModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Icon + heading */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-(--color-ink) tracking-tight">
              Delete Record
            </h2>
            <p className="text-[13px] text-(--color-muted) mt-1 leading-relaxed">
              Are you sure you want to delete this record?
              <br />
              <span className="text-red-500 font-medium">This action cannot be undone.</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-(--color-border) mx-6" />

        {/* Actions */}
        <div className="px-6 py-4 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium text-(--color-ink) bg-(--color-subtle) hover:bg-(--color-border) transition-colors cursor-pointer border-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer border-none"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};
