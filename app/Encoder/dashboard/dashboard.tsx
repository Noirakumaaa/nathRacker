import { useQuery } from "@tanstack/react-query";
import { FileText, FileInput, IdCard, Layers, TrendingUp } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { StatCards } from "./StatCards";
import { TotalBreakdown } from "./TotalBreakdown";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import type { CountItem, RecentEntry, StatCard } from "~/types/dashboardTypes";
import type { me } from "~/types/authTypes";
import { moduleStyle } from "../../../component/styleConfig";

export default function Dashboard({ userData }: { userData: me }) {
  const { data: counts = [] } = useQuery<CountItem[]>({
    queryKey: ["documentCounts"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/count/documents`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch counts");
      const data = await res.json();
      return Array.isArray(data) ? data : (data.data ?? []);
    },
  });

  const { data: sparklines = {} } = useQuery<Record<string, number[]>>({
    queryKey: ["weeklyDocumentCounts"],
    queryFn: async (): Promise<Record<string, number[]>> => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/weekly-count`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch weekly counts");
      const data = await res.json();
      if (typeof data === "object" && !Array.isArray(data) && "data" in data)
        return data.data as Record<string, number[]>;
      return typeof data === "object" && !Array.isArray(data) ? data : {};
    },
  });

  const { data: recentBus = [], isLoading } = useQuery({
    queryKey: ["UserRecent"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/UserRecent`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to fetch recent");
      const data = await res.json();
      return (
        (data as any[])
          ?.slice(0, 8)
          .map((r: any) => ({ ...r, module: "BUS" })) ?? []
      );
    },
  });

  const getCount = (type: string) =>
    counts.find((c: any) => c.documentType === type)?.count ?? 0;

  const stats: StatCard[] = [
    {
      label: "BUS Records",
      value: getCount("BUS"),
      sub: "Beneficiary updates",
      tag: "BUS",
      tagClass: moduleStyle.BUS,
      icon: FileText,
      iconBg: "bg-indigo-50",
    },
    {
      label: "PCN Records",
      value: getCount("PCN"),
      sub: "PhilSys Card Number.",
      tag: "PCN",
      tagClass: moduleStyle.PCN,
      icon: IdCard,
      iconBg: "bg-rose-50",
    },
    {
      label: "SWDI Records",
      value: getCount("SWDI"),
      sub: "Social welfare scores",
      tag: "SWDI",
      tagClass: moduleStyle.SWDI,
      icon: FileInput,
      iconBg: "bg-emerald-50",
    },
    {
      label: "CVS",
      value: getCount("CVS"),
      sub: "CVS encoded records",
      tag: "CVS",
      tagClass: moduleStyle.CVS,
      icon: IdCard,
      iconBg: "bg-sky-50",
    },
    {
      label: "Verified Records",
      value: getCount("VERIFIED"),
      sub: "Verified records",
      tag: "VERIFIED",
      tagClass: moduleStyle.VERIFIED,
      icon: TrendingUp,
      iconBg: "bg-purple-50",
    },
    {
      label: "Miscellaneous",
      value: getCount("MISC"),
      sub: "Other encoded records",
      tag: "MISC",
      tagClass: moduleStyle.MISC,
      icon: Layers,
      iconBg: "bg-amber-50",
    },
  ];

  const total =
    getCount("BUS") + getCount("PCN") + getCount("SWDI") + getCount("MISC");
  const recentAll: RecentEntry[] = [...recentBus]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <main className="p-6 bg-[#fafaf8] min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-5">
        <DashboardHeader userData={userData} />
        <StatCards stats={stats} sparklines={sparklines} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3">
          <TotalBreakdown stats={stats} total={total} />
          <RecentActivity recentAll={recentAll} isLoading={isLoading} />
        </div>
        <QuickActions />
      </div>
    </main>
  );
}
