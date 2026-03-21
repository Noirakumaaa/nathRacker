import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "redux/store";
import { get } from "component/fetchComponent";
import {
  FileText,
  FileInput,
  IdCard,
  Layers,
  TrendingUp,
  Clock,
  Copy,
  Loader2,
  InboxIcon,
  ArrowUpRight,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type StatCard = {
  label: string;
  value: number | string;
  sub: string;
  tag: string;
  tagClass: string;
  icon: React.ElementType;
  iconBg: string;
};

type RecentEntry = {
  id: number;
  idNumber: string;
  name?: string;
  grantee?: string;
  date: string;
  remarks?: string;
  encoded?: string;
  documentType: string;
  module?: string;
};

type CountItem = {
  documentType: string;
  count: number;
};

// ── Module tag styles ────────────────────────────────────────────────────────
const moduleStyle: Record<string, string> = {
  BUS: "bg-indigo-50 text-indigo-600",
  PCN: "bg-rose-50 text-rose-600",
  SWDI: "bg-emerald-50 text-emerald-600",
  MISC: "bg-amber-50 text-amber-600",
  CVS: "bg-sky-50 text-sky-600",
  VERIFIED: "bg-purple-50 text-purple-600",
};

const encodedStyle = (v?: string) => {
  if (v === "YES") return "bg-emerald-50 text-emerald-600";
  if (v === "NO") return "bg-red-50 text-red-500";
  if (v === "UPDATED") return "bg-blue-50 text-blue-600";
  return "bg-[#f5f5f2] text-[#8a8a80]";
};

// ── Mini bar chart ───────────────────────────────────────────────────────────
function MiniBar({ values = [], color }: { values?: number[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} transition-all duration-300`}
          style={{
            height: `${Math.max((v / max) * 100, 4)}%`,
            opacity:
              i === values.length - 1 ? 1 : 0.4 + (i / values.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const user = useSelector((state: RootState) => state.user);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Fetch counts
  const { data: counts = [] } = useQuery<CountItem[]>({
    queryKey: ["documentCounts"],
    queryFn: async () => {
      const res = (await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/count/documents`,
      )) as CountItem[] | { data: CountItem[] };
      return Array.isArray(res) ? res : (res.data ?? []);
    },
  });

  // Fetch weekly counts (for sparklines)
  const { data: sparklines = {} } = useQuery<Record<string, number[]>>({
    queryKey: ["weeklyDocumentCounts"],
    queryFn: async (): Promise<Record<string, number[]>> => {
      const res = (await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/weekly-count`,
      )) as Record<string, number[]> | { data: Record<string, number[]> } | any;
      if (typeof res === "object" && !Array.isArray(res) && "data" in res) {
        return res.data as Record<string, number[]>;
      }
      return typeof res === "object" && !Array.isArray(res) ? res : {};
    },
  });

  const busCount =
    counts.find((c: any) => c.documentType === "BUS")?.count ?? 0;

  const swdiCount =
    counts.find((c: any) => c.documentType === "SWDI")?.count ?? 0;

  const pcnCount =
    counts.find((c: any) => c.documentType === "PCN")?.count ?? 0;

  const miscCount =
    counts.find((c: any) => c.documentType === "MISC")?.count ?? 0;

  const cvsCount =
    counts.find((c: any) => c.documentType === "CVS")?.count ?? 0;

  const verifiedCount =
    counts.find((c: any) => c.documentType === "VERIFIED")?.count ?? 0;

  // Fetch recent across all modules
  const { data: recentBus = [], isLoading: loadBus } = useQuery({
    queryKey: ["UserRecent"],
    queryFn: async () => {
      const d = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/alldocuments/UserRecent`,
      );
      return (
        (d as any[])?.slice(0, 8).map((r: any) => ({ ...r, module: "BUS" })) ??
        []
      );
    },
  });

  const isLoading = loadBus;

  // Merge + sort recent
  const recentAll: RecentEntry[] = [...recentBus]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const total = busCount + pcnCount + swdiCount + miscCount;

  const stats: StatCard[] = [
    {
      label: "BUS Records",
      value: busCount,
      sub: "Beneficiary updates",
      tag: "BUS",
      tagClass: moduleStyle.BUS,
      icon: FileText,
      iconBg: "bg-indigo-50",
    },
    {
      label: "PCN Records",
      value: pcnCount,
      sub: "PhilSys Card Number.",
      tag: "PCN",
      tagClass: moduleStyle.PCN,
      icon: IdCard,
      iconBg: "bg-rose-50",
    },
    {
      label: "SWDI Records",
      value: swdiCount,
      sub: "Social welfare scores",
      tag: "SWDI",
      tagClass: moduleStyle.SWDI,
      icon: FileInput,
      iconBg: "bg-emerald-50",
    },

    {
      label: "CVS",
      value: cvsCount,
      sub: "CVS encoded records",
      tag: "CVS",
      tagClass: moduleStyle.CVS,
      icon: IdCard,
      iconBg: "bg-sky-50",
    },
    {
      label: "Verified Records",
      value: verifiedCount,
      sub: "Verified records",
      tag: "VERIFIED",
      tagClass: moduleStyle.VERIFIED,
      icon: TrendingUp,
      iconBg: "bg-purple-50",
    },
    {
      label: "Miscellaneous",
      value: miscCount,
      sub: "Other encoded records",
      tag: "MISC",
      tagClass: moduleStyle.MISC,
      icon: Layers,
      iconBg: "bg-amber-50",
    },
  ];

  // // Fake weekly sparkline (replace with real data if available)
  // const sparklines: Record<string, number[]> = {
  //   BUS:  [12,18,14,22,16,20,busCount  % 30 || 8],
  //   PCN:  [5, 9, 7, 11,8, 13,pcnCount  % 20 || 4],
  //   SWDI: [3, 6, 4, 8, 5, 9, swdiCount % 15 || 3],
  //   MISC: [2, 4, 3, 5, 4, 6, miscCount % 10 || 2],
  // };

  const sparkColor: Record<string, string> = {
    BUS: "bg-indigo-400",
    PCN: "bg-rose-400",
    SWDI: "bg-emerald-400",
    MISC: "bg-amber-400",
    CVS: "bg-sky-400",
    VERIFIED: "bg-purple-400",
  };
  return (
    <main className="p-6 bg-[#fafaf8] min-h-screen font-sans antialiased">
      <div className="max-w-full mx-auto flex flex-col gap-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
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
                {user.firstName} {user.lastName}
              </span>
            </h1>
            <p className="text-[12px] text-[#8a8a80] mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-[12px] text-[#8a8a80]">
              All systems online
            </span>
          </div>
        </div>

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.tag}
                className="bg-white border border-[#e8e8e0] rounded-xl p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center`}
                  >
                    <Icon size={16} className={s.tagClass.split(" ")[1]} />
                  </div>
                  <span
                    className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wider ${s.tagClass}`}
                  >
                    {s.tag}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-[30px] font-semibold tracking-[-0.04em] text-[#1a1a18] leading-none">
                    {s.value.toLocaleString()}
                  </p>
                  <p className="text-[12px] text-[#8a8a80] mt-1">{s.label}</p>
                </div>
                <MiniBar
                  values={sparklines[s.tag] ?? [0, 0, 0, 0, 0, 0, 0]}
                  color={sparkColor[s.tag]}
                />
                <p className="text-[11px] text-[#c4c4b8] mt-2">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Total + breakdown ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3">
          {/* Total */}
          <div className="bg-[#1a1a18] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">
                Total Encoded
              </p>
              <p className="text-[52px] font-semibold tracking-[-0.05em] text-white leading-none">
                {total.toLocaleString()}
              </p>
              <p className="text-[13px] text-white/50 mt-2">
                records across all modules
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.tag} className="bg-white/5 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-mono text-white/40 tracking-wider">
                    {s.tag}
                  </p>
                  <p className="text-[18px] font-semibold text-white leading-tight mt-0.5">
                    {Number(s.value).toLocaleString()}
                  </p>
                  <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/40 transition-all duration-700"
                      style={{
                        width:
                          total > 0
                            ? `${(Number(s.value) / total) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-[#e8e8e0] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e8e8e0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-[#8a8a80]" />
                <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
                  Recent Activity
                </p>
              </div>
              <span className="text-[11px] font-mono bg-[#f5f5f2] text-[#8a8a80] px-2.5 py-1 rounded-full">
                {recentAll.length} entries
              </span>
            </div>

            <div className="overflow-y-auto max-h-[360px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#c4c4b8]">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-[12px]">Loading activity…</span>
                </div>
              ) : recentAll.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-2">
                  <InboxIcon size={22} className="text-[#d4d4cc]" />
                  <span className="text-[12px] text-[#8a8a80]">
                    No recent activity
                  </span>
                </div>
              ) : (
                <table className="min-w-full text-xs">
                  <thead className="bg-[#fafaf8] border-b border-[#e8e8e0] sticky top-0">
                    <tr>
                      {["Module", "HH ID", "Grantee", "Status", "Date"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#8a8a80] uppercase tracking-widest whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f5f2]">
                    {recentAll.map((entry, i) => (
                      <tr
                        key={`${entry.documentType}-${entry.id}`}
                        className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#fafaf8]"}`}
                      >
                        <td className="px-4 py-2.5">
                          <span
                            className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded-md tracking-wider ${moduleStyle[entry.documentType]}`}
                          >
                            {entry.documentType}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5 group">
                            <span className="font-mono text-[11px] text-[#1a1a18]">
                              {entry.idNumber}
                            </span>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(entry.idNumber)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c4c4b8] hover:text-[#8a8a80] cursor-pointer bg-transparent border-none"
                            >
                              <Copy size={10} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[12px] text-[#1a1a18] max-w-[140px] truncate">
                          {entry.name ?? entry.name ?? (
                            <span className="text-[#d4d4cc]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${encodedStyle(entry.remarks ?? entry.encoded)}`}
                          >
                            {entry.remarks ?? entry.encoded ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-[#8a8a80] whitespace-nowrap tabular-nums">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick actions ───────────────────────────────────────────────── */}
        <div className="bg-white border border-[#e8e8e0] rounded-xl p-6">
          <p className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider mb-4">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "New BUS Entry",
                href: "/bus",
                tag: "BUS",
                tagClass: moduleStyle.BUS,
                icon: FileText,
              },
              {
                label: "New PCN Entry",
                href: "/PCN",
                tag: "PCN",
                tagClass: moduleStyle.PCN,
                icon: IdCard,
              },
              {
                label: "New SWDI Entry",
                href: "/swdi",
                tag: "SWDI",
                tagClass: moduleStyle.SWDI,
                icon: FileInput,
              },
              {
                label: "View All Records",
                href: "/records",
                tag: "ALL",
                tagClass: "bg-[#f5f5f2] text-[#8a8a80]",
                icon: Layers,
              },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <a
                  key={a.href}
                  href={a.href}
                  className="group flex items-center justify-between p-4 border border-[#e8e8e0] rounded-xl hover:border-[#1a1a18] hover:bg-[#fafaf8] transition-all no-underline"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={14}
                      className="text-[#8a8a80] group-hover:text-[#1a1a18] transition-colors"
                    />
                    <span className="text-[13px] font-medium text-[#1a1a18]">
                      {a.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={13}
                    className="text-[#c4c4b8] group-hover:text-[#1a1a18] transition-colors"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
