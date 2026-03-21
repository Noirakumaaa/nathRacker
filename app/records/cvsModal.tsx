import type { CvsFormFields } from "./../types/cvsTypes";

type CvsViewModalProps = {
  item: CvsFormFields | null;
  onClose: () => void;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 py-2.5 border-b border-[#f0f0ec] last:border-0">
      <span className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider">{label}</span>
      <span className="text-[13px] font-medium text-[#1a1a18] text-right break-words">
        {value ?? <span className="text-[#d4d4cc] italic font-normal">—</span>}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-[#8a8a80] uppercase tracking-wider mb-3 flex items-center gap-2">
      <span className="w-3 h-px bg-[#e8e8e0] inline-block" />
      {children}
    </p>
  );
}

function getRemarksBadgeClass(remarks: string) {
  switch (remarks?.toUpperCase()) {
    case "YES":
      return "bg-emerald-50 text-emerald-700";
    case "NO":
      return "bg-red-50 text-red-600";
    case "UPDATED":
      return "bg-blue-50 text-blue-600";
    default:
      return "bg-[#f0f0ec] text-[#8a8a80]";
  }
}

export function CvsViewModal({ item, onClose }: CvsViewModalProps) {
  if (!item) return null;

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getRemarksBadgeClass(item.remarks)}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {item.remarks === "YES"
        ? "Encoded"
        : item.remarks === "NO"
        ? "Not Encoded"
        : item.remarks || "—"}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a18]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border border-[#e8e8e0] shadow-[0_24px_60px_rgba(0,0,0,0.15)]">

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e0]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 tracking-wider">
              CVS
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-[#1a1a18]">Record Details</h2>
              <p className="text-[12px] text-[#8a8a80] mt-0.5 font-mono">{item.idNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e8e0] text-[#8a8a80] hover:border-[#1a1a18] hover:text-[#1a1a18] transition-colors cursor-pointer bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">

          {/* Identification */}
          <section>
            <SectionLabel>Identification</SectionLabel>
            <div className="bg-[#fafaf8] rounded-xl px-4 py-1">
              <DetailRow label="ID Number" value={item.idNumber} />
              <DetailRow label="LGU" value={item.lgu} />
              <DetailRow label="Barangay" value={item.barangay} />
            </div>
          </section>

          {/* Facility Information */}
          <section>
            <SectionLabel>Facility Information</SectionLabel>
            <div className="bg-[#fafaf8] rounded-xl px-4 py-1">
              <DetailRow label="Facility Name" value={item.facilityName} />
              <DetailRow label="Form Type" value={item.formType} />
            </div>
          </section>

          {/* Status & Encoding */}
          <section>
            <SectionLabel>Status & Encoding</SectionLabel>
            <div className="bg-[#fafaf8] rounded-xl px-4 py-1">
              <DetailRow label="Remarks" value={statusBadge} />
              <DetailRow label="Date" value={formattedDate} />
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e8e8e0] flex justify-end bg-[#fafaf8] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-medium text-[#1a1a18] bg-white border border-[#e8e8e0] rounded-lg hover:border-[#1a1a18] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}