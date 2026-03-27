// component/LoadingScreen.tsx
import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fafaf8] z-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={24} className="animate-spin text-[#1a1a18]" />
        <p className="text-[13px] text-[#8a8a80]">Loading...</p>
      </div>
    </div>
  );
}