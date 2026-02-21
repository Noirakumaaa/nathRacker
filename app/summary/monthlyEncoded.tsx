import { Calendar } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "component/fetchComponent";
import { useSelector } from "react-redux";
import { type RootState } from "redux/store";
import LoadingOverlay from "component/overlayLoading";

export type StatsData = {
  date: string;
  documentType: "PCN" | "BUS" | "SWDI";
  encoded: number;
  updated: number;
  issues: number;
};
type TotalsData = {
  PCN: { encoded: number; updated: number; issues: number };
  BUS: { encoded: number; updated: number; issues: number };
  SWDI: { encoded: number; updated: number; issues: number };
};


type GroupedData = {
  date: string;
  PCN: { encoded: number; updated: number; issues: number };
  BUS: { encoded: number; updated: number; issues: number };
  SWDI: { encoded: number; updated: number; issues: number };
};

function getYearMonth(month?: number | string) {
  const now = new Date();
  let date = now;
  const m = Number(month);

  if (m >= 1 && m <= 12) {
    date = new Date(now.getFullYear(), m - 1, 1);
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}


export default function BlankCalendar() {
  const User = useSelector((state: RootState) => state.user);
  const selectedPeriod = useSelector((state: RootState) => state.summary.selectedMonth);


  const { data, isLoading } = useQuery<StatsData[]>({
    queryKey: ["statsData", selectedPeriod],
    queryFn: async () => {
      const res = await get(
        `${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/recentmonthlyeverydaystats?id=${User.id}&month=${getYearMonth(selectedPeriod)}`
      );
      return res as StatsData[];
    },
    enabled: !!User.id,
  });

  if (isLoading) return <LoadingOverlay />;
  if (!selectedPeriod) return <LoadingOverlay />

const groupedData: Record<string, GroupedData> = data?.reduce<Record<string, GroupedData>>((acc, item) => {
  if (!acc[item.date]) {
    acc[item.date] = {
      date: item.date,
      PCN: { encoded: 0, updated: 0, issues: 0 },
      BUS: { encoded: 0, updated: 0, issues: 0 },
      SWDI: { encoded: 0, updated: 0, issues: 0 },
    };
  }

  acc[item.date][item.documentType] = {
    encoded: item.encoded,
    updated: item.updated,
    issues: item.issues,
  };

  return acc;
}, {}) ?? {};


  // Filter out dates where all values are 0
  const filteredData = Object.values(groupedData).filter(item => {
    const dailyTotal =
      item.PCN.encoded + item.PCN.updated + item.PCN.issues +
      item.BUS.encoded + item.BUS.updated + item.BUS.issues +
      item.SWDI.encoded + item.SWDI.updated + item.SWDI.issues;

    return dailyTotal > 0;
  });

  const sortedData = filteredData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totals = sortedData.reduce(
    (acc, item) => {
      acc.PCN.encoded += item.PCN.encoded;
      acc.PCN.updated += item.PCN.updated;
      acc.PCN.issues += item.PCN.issues;

      acc.BUS.encoded += item.BUS.encoded;
      acc.BUS.updated += item.BUS.updated;
      acc.BUS.issues += item.BUS.issues;

      acc.SWDI.encoded += item.SWDI.encoded;
      acc.SWDI.updated += item.SWDI.updated;
      acc.SWDI.issues += item.SWDI.issues;

      return acc;
    },
    {
      PCN: { encoded: 0, updated: 0, issues: 0 },
      BUS: { encoded: 0, updated: 0, issues: 0 },
      SWDI: { encoded: 0, updated: 0, issues: 0 },
    }
  );

  const isYearly = selectedPeriod === "thisYear";
  const dateLabel = isYearly ? "Month" : "Day";

  function exportToCSV(data: GroupedData[], totals: TotalsData) {
    const headers = [
      "Date",
      "Activity",
      "PCN Encoded", "PCN Updated", "PCN Issues",
      "BUS Encoded", "BUS Updated", "BUS Issues",
      "SWDI Encoded", "SWDI Updated", "SWDI Issues",
      "Total"
    ];

    const rows = data.map(item => {
      const activity = [
        item.PCN.encoded + item.PCN.updated + item.PCN.issues > 0 ? "PCN" : null,
        item.BUS.encoded + item.BUS.updated + item.BUS.issues > 0 ? "BUS" : null,
        item.SWDI.encoded + item.SWDI.updated + item.SWDI.issues > 0 ? "SWDI" : null
      ].filter(Boolean).join(", ");

      const dailyTotal =
        item.PCN.encoded + item.PCN.updated + item.PCN.issues +
        item.BUS.encoded + item.BUS.updated + item.BUS.issues +
        item.SWDI.encoded + item.SWDI.updated + item.SWDI.issues;

      return [
        item.date,
        `"${activity}"`,
        item.PCN.encoded, item.PCN.updated, item.PCN.issues,
        item.BUS.encoded, item.BUS.updated, item.BUS.issues,
        item.SWDI.encoded, item.SWDI.updated, item.SWDI.issues,
        dailyTotal
      ].join(",");
    });

    const totalsActivity = [
      totals.PCN.encoded + totals.PCN.updated + totals.PCN.issues > 0 ? "PCN" : null,
      totals.BUS.encoded + totals.BUS.updated + totals.BUS.issues > 0 ? "BUS" : null,
      totals.SWDI.encoded + totals.SWDI.updated + totals.SWDI.issues > 0 ? "SWDI" : null
    ].filter(Boolean).join(", ");

    const totalsRow = [
      "TOTAL",
      `"${totalsActivity}"`,
      totals.PCN.encoded, totals.PCN.updated, totals.PCN.issues,
      totals.BUS.encoded, totals.BUS.updated, totals.BUS.issues,
      totals.SWDI.encoded, totals.SWDI.updated, totals.SWDI.issues,
      totals.PCN.encoded + totals.PCN.updated + totals.PCN.issues +
      totals.BUS.encoded + totals.BUS.updated + totals.BUS.issues +
      totals.SWDI.encoded + totals.SWDI.updated + totals.SWDI.issues
    ].join(",");

    const csvContent = [headers.join(","), ...rows, totalsRow].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "MonthlyStats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 font-semibold text-black text-lg">
          <Calendar size={20} />
          Daily / Monthly Stats by Document Type
        </div>
        <div>
          <button
            onClick={() => exportToCSV(sortedData, totals)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-700 sticky left-0 bg-white border-r border-gray-200">
                {dateLabel}
              </th>
              <th className="text-center py-2 px-2 font-medium text-purple-700 bg-purple-50 border-l border-purple-200" colSpan={3}>PCN</th>
              <th className="text-center py-2 px-2 font-medium text-orange-700 bg-orange-50 border-l border-orange-200" colSpan={3}>BUS</th>
              <th className="text-center py-2 px-2 font-medium text-teal-700 bg-teal-50 border-l border-teal-200" colSpan={3}>SWDI</th>
              <th className="text-center py-2 px-2 font-medium text-gray-700 bg-gray-100 border-l border-gray-300">TOTAL</th>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-700 sticky left-0 bg-white border-r border-gray-200"></th>
              <th className="text-center py-1 px-2 text-xs font-medium text-green-700 bg-green-50">Encoded</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-blue-700 bg-blue-50">Updated</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-red-700 bg-red-50">Issues</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-green-700 bg-green-50 border-l border-orange-200">Encoded</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-blue-700 bg-blue-50">Updated</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-red-700 bg-red-50">Issues</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-green-700 bg-green-50 border-l border-teal-200">Encoded</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-blue-700 bg-blue-50">Updated</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-red-700 bg-red-50">Issues</th>
              <th className="text-center py-1 px-2 text-xs font-medium text-gray-700 bg-gray-100 border-l border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item) => {
                const dailyTotal =
                  item.PCN.encoded + item.PCN.updated + item.PCN.issues +
                  item.BUS.encoded + item.BUS.updated + item.BUS.issues +
                  item.SWDI.encoded + item.SWDI.updated + item.SWDI.issues;

                return (
                  <tr key={item.date} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 sticky left-0 bg-white border-r border-gray-200 font-medium">
                      {item.date}
                    </td>
                    <td className="text-center py-2 px-2 bg-green-25">{item.PCN.encoded}</td>
                    <td className="text-center py-2 px-2 bg-blue-25">{item.PCN.updated}</td>
                    <td className="text-center py-2 px-2 bg-red-25">{item.PCN.issues}</td>
                    <td className="text-center py-2 px-2 bg-green-25 border-l border-orange-200">{item.BUS.encoded}</td>
                    <td className="text-center py-2 px-2 bg-blue-25">{item.BUS.updated}</td>
                    <td className="text-center py-2 px-2 bg-red-25">{item.BUS.issues}</td>
                    <td className="text-center py-2 px-2 bg-green-25 border-l border-teal-200">{item.SWDI.encoded}</td>
                    <td className="text-center py-2 px-2 bg-blue-25">{item.SWDI.updated}</td>
                    <td className="text-center py-2 px-2 bg-red-25">{item.SWDI.issues}</td>
                    <td className="text-center py-2 px-2 bg-gray-50 font-bold">{dailyTotal}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="py-4 px-2 text-center text-gray-500" colSpan={11}>
                  No data
                </td>
              </tr>
            )}

            {sortedData.length > 0 && (
              <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                <td className="py-3 px-2 sticky left-0 bg-gray-100 border-r border-gray-200">TOTAL</td>
                <td className="text-center py-3 px-2 bg-green-100 font-bold text-green-800">{totals.PCN.encoded}</td>
                <td className="text-center py-3 px-2 bg-blue-100 font-bold text-blue-800">{totals.PCN.updated}</td>
                <td className="text-center py-3 px-2 bg-red-100 font-bold text-red-800">{totals.PCN.issues}</td>
                <td className="text-center py-3 px-2 bg-green-100 font-bold text-green-800 border-l border-orange-200">{totals.BUS.encoded}</td>
                <td className="text-center py-3 px-2 bg-blue-100 font-bold text-blue-800">{totals.BUS.updated}</td>
                <td className="text-center py-3 px-2 bg-red-100 font-bold text-red-800">{totals.BUS.issues}</td>
                <td className="text-center py-3 px-2 bg-green-100 font-bold text-green-800 border-l border-teal-200">{totals.SWDI.encoded}</td>
                <td className="text-center py-3 px-2 bg-blue-100 font-bold text-blue-800">{totals.SWDI.updated}</td>
                <td className="text-center py-3 px-2 bg-red-100 font-bold text-red-800">{totals.SWDI.issues}</td>
                <td className="text-center py-3 px-2 bg-gray-100 font-bold">
                  {totals.PCN.encoded + totals.PCN.updated + totals.PCN.issues +
                    totals.BUS.encoded + totals.BUS.updated + totals.BUS.issues +
                    totals.SWDI.encoded + totals.SWDI.updated + totals.SWDI.issues}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}