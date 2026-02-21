import type { BusFormFields } from "./../types/busTypes";
import { getEncodedBadgeClass } from "./../types/busTypes";

type BusViewModalProps = {
    item: BusFormFields | null;
    onClose: () => void;
}

function DetailRow({ label, value, className = "" }: { label: string; value?: React.ReactNode; className?: string }) {
    return (
        <div className={`grid grid-cols-2 gap-4 py-2.5 border-b border-gray-100 last:border-0 ${className}`}>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right break-words">{value ?? <span className="text-gray-300 italic">—</span>}</span>
        </div>
    );
}

export function BusViewModal({ item, onClose }: BusViewModalProps) {
    if (!item) return null;

    const formattedDate = item.date
        ? new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "—";

    const statusBadge = (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getEncodedBadgeClass(item.remarks)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {item.remarks === "YES" ? "Encoded" : item.remarks === "NO" ? "Not Encoded" : item.remarks || "—"}
        </span>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Decorative top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-t-2xl" />

                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 leading-tight">Record Details</h2>
                            <p className="text-xs text-gray-400 mt-0.5">HH ID: <span className="font-semibold text-gray-600">{item.hhId}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="overflow-y-auto px-7 py-5 space-y-6 flex-1">

                    {/* Section: Identification */}
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-3">Identification</p>
                        <div className="bg-gray-50 rounded-xl px-4 py-1">
                            <DetailRow label="HH ID" value={item.hhId} />
                            <DetailRow label="DRN" value={item.drn} />
                            <DetailRow label="CL" value={item.cl} />
                            <DetailRow label="LGU" value={item.lgu} />
                            <DetailRow label="Barangay" value={item.barangay} />
                        </div>
                    </section>

                    {/* Section: Grantee Info */}
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-3">Grantee Information</p>
                        <div className="bg-gray-50 rounded-xl px-4 py-1">
                            <DetailRow label="Name" value={item.granteeName} />
                            <DetailRow label="Subject of Change" value={item.subjectOfChange} />
                            <DetailRow label="Type of Update" value={item.typeOfUpdate} />
                            <DetailRow label="Update Info" value={item.updateInfo} />
                        </div>
                    </section>

                    {/* Section: Status & Encoding */}
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-3">Status & Encoding</p>
                        <div className="bg-gray-50 rounded-xl px-4 py-1">
                            <DetailRow label="Remarks" value={statusBadge} />
                            <DetailRow label="Issue" value={item.issue} />
                            <DetailRow label="Encoded By" value={item.encodedBy} />
                            <DetailRow label="Date" value={formattedDate} />
                        </div>
                    </section>

                    {/* Section: Notes */}
                    {item.note && (
                        <section>
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-3">Notes</p>
                            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                <p className="text-sm text-amber-800 leading-relaxed">{item.note}</p>
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer */}
                <div className="px-7 py-4 border-t border-gray-100 flex justify-end bg-gray-50/60 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}