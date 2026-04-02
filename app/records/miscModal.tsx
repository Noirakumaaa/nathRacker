import type { MiscFormFields } from "./../types/miscTypes";
import { getEncodedBadgeClass } from "./../types/miscTypes";

type MiscViewModalProps = {
  item: MiscFormFields | null;
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
      <span className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider">{label}</span>
      <span className="text-[13px] font-medium text-(--color-ink) text-right break-words">
        {value ?? <span className="text-[#d4d4cc] italic font-normal">—</span>}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-wider mb-3 flex items-center gap-2">
      <span className="w-3 h-px bg-(--color-border) inline-block" />
      {children}
    </p>
  );
}

export function MiscViewModal({ item, onClose }: MiscViewModalProps) {
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getEncodedBadgeClass(item.remarks)}`}
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
        className="absolute inset-0 bg-(--color-ink)/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-(--color-surface) rounded-2xl w-full max-w-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border border-(--color-border) shadow-[0_24px_60px_rgba(0,0,0,0.15)]">

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-rose-400 via-orange-400 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-medium px-2 py-1 rounded-md bg-rose-50 text-rose-600 tracking-wider">
              MISC
            </span>
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-(--color-ink)">Record Details</h2>
              <p className="text-[12px] text-(--color-muted) mt-0.5 font-mono">{item.hhId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-border) text-(--color-muted) hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer bg-(--color-surface)"
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
            <div className="bg-(--color-bg) rounded-xl px-4 py-1">
              <DetailRow label="HH ID" value={item.hhId} />
              <DetailRow label="DRN" value={item.drn} />
              <DetailRow label="CL" value={item.cl} />
              <DetailRow label="LGU" value={item.lgu} />
              <DetailRow label="Barangay" value={item.barangay} />
            </div>
          </section>

          {/* Grantee Information */}
          <section>
            <SectionLabel>Grantee Information</SectionLabel>
            <div className="bg-(--color-bg) rounded-xl px-4 py-1">
              <DetailRow label="Name" value={item.granteeName} />
              <DetailRow label="Subject of Change" value={item.subjectOfChange} />
            </div>
          </section>

          {/* Document */}
          <section>
            <SectionLabel>Document</SectionLabel>
            <div className="bg-(--color-bg) rounded-xl px-4 py-1">
              <DetailRow label="Document Type" value={item.documentType} />
            </div>
          </section>

          {/* Status & Encoding */}
          <section>
            <SectionLabel>Status & Encoding</SectionLabel>
            <div className="bg-(--color-bg) rounded-xl px-4 py-1">
              <DetailRow label="Remarks" value={statusBadge} />
              <DetailRow label="Issue" value={item.issue} />
              <DetailRow label="Encoded By" value={item.encodedBy} />
              <DetailRow label="Date" value={formattedDate} />
            </div>
          </section>

          {/* Notes */}
          {item.note && (
            <section>
              <SectionLabel>Note</SectionLabel>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-[13px] text-amber-800 leading-relaxed">{item.note}</p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-(--color-border) flex justify-end bg-(--color-bg) rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-medium text-(--color-ink) bg-(--color-surface) border border-(--color-border) rounded-lg hover:border-(--color-ink) transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}