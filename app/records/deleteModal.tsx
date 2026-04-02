// components/DeleteModal.tsx
interface DeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({ open, onConfirm, onCancel }: DeleteModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-(--color-surface) rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800">Delete Record</h2>
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to delete this record? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};