import type { ToastProps, ToastStatus } from "~/types/toastType";



export const toastConfig: Record<ToastStatus, { icon: React.ReactNode; accent: string }> = {
  success: {
    accent: "#22c55e",
    icon: (
      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    accent: "#ef4444",
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  loading: {
    accent: "#6366f1",
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
        <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.7" />
        <path d="M6 1A5 5 0 0 1 11 6" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
};



export const Toast = ({ statusMessage, toastStatus, toastConfig } : ToastProps) => (
  <div
    style={{ animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
    className="fixed bottom-7 left-7 bg-(--color-surface) text-(--color-ink) px-4 py-3 rounded-[10px] shadow-[0_2px_16px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.06)] text-[13px] font-medium font-['DM_Sans',sans-serif] z-[9999] flex items-center gap-[10px] max-w-[300px]"
  >
    <span
      style={{ backgroundColor: toastConfig[toastStatus].accent }}
      className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
    >
      {toastConfig[toastStatus].icon}
    </span>
    <span className="text-[#555] leading-[1.4]">{statusMessage}</span>
    <style>{`
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);