import type { me } from "~/types/authTypes";

export function DashboardHeader({ userData }: { userData: me }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-[#e8e8e0] rounded-xl px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-[15px] font-semibold tracking-tight text-[#1a1a18]">
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
          ,{" "}
          <span className="text-blue-600">
            {userData?.firstName} {userData?.lastName}
          </span>
        </h1>
        <p className="text-[12px] text-[#8a8a80] mt-0.5">{today}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        <span className="text-[12px] text-[#8a8a80]">All systems online</span>
      </div>
    </div>
  );
}
