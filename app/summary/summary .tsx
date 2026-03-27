import { useQuery } from "@tanstack/react-query"
import BlankCalendar from "./monthlyEncoded"
import { useDispatch, useSelector } from ""
import type { RootState } from "redux/store"
import { Calendar, TrendingUp, FileText, Award, ChevronDown } from "lucide-react"
import { useState } from "react"
import { get } from "component/fetchComponent"
import { setSelectedMonth } from "redux/slice/summary/summerySlice"

export type EncodedDocument = {
  id: number
  hhId: string
  name: string
  documentType: string
  documentId: number
  encoded: string
  userId: number
  username: string
  date: string
  createdAt: string
}

export type SummaryStats = {
  totalDocuments: number
  documentsByType: Record<string, number>
  documentsByStatus: Record<string, number>
  dailyStats: Array<{ date: string } & Record<string, Record<string, number> | number>>
}

export type TodaysSummary = {
  [documentType: string]: {
    [status: string]: number
  }
}

function getYearMonth(month?: number | string) {
  const now = new Date();
  let date = now;
  const m = Number(month);

  if (m >= 1 && m <= 12) {
    date = new Date(now.getFullYear(), m - 1, 1);
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}


export default function EncodingSummary() {
  const dispatch = useDispatch()
  const User = useSelector((state: RootState) => state.user)
  const Selectedmonth = useSelector((state: RootState) => state.summary.selectedMonth)
  const [selectedPeriod, setSelectedPeriod] = useState<string>(Selectedmonth) // Default to January
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { data: summaryData, isLoading } = useQuery<SummaryStats>({
    queryKey: ["encodingSummary", selectedPeriod],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/monthlystats?id=${User.id}&month=${getYearMonth(selectedPeriod)}`)

      return data as SummaryStats
    },
    enabled: !!User.id
  })

  const monthOptions = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  }

  const dailyStats: Record<string, Record<string, Record<string, number>>> = {}
  summaryData?.dailyStats?.forEach(day => {
    const { date, ...rest } = day
    dailyStats[date] = rest as Record<string, Record<string, number>>
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'yes': case 'completed': case 'encoded': return 'bg-green-100 text-green-800'
      case 'no': case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'updated': return 'bg-blue-100 text-blue-800'
      case 'error': case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    color?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  if (!User.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Please log in to view your encoding summary.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 text-black">
      {/* Header with Period Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
        <div className="px-6 py-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-700" />
          <h1 className="text-xl font-bold text-black">Encoding Summary</h1>
          <span className="text-gray-500 text-sm ml-2">- Track your document encoding progress and achievements</span>
        </div>
        <div className="relative" style={{ position: 'fixed', top: '80px', right: '40px', zIndex: 50 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Calendar size={16} />
            {monthOptions[selectedPeriod as keyof typeof monthOptions]}
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {Object.entries(monthOptions).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedPeriod(key)

                    dispatch(setSelectedMonth(key))
                    setDropdownOpen(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${selectedPeriod === key ? "bg-blue-50 text-blue-600" : ""
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading summary data...</div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Documents"
              value={summaryData?.totalDocuments || 0}
              subtitle="Encoded documents"
              icon={FileText}
              color="blue"
            />

            <StatCard
              title="Completed"
              value={summaryData?.documentsByStatus?.['YES'] || summaryData?.documentsByStatus?.[''] || 0}
              subtitle="Successfully encoded"
              icon={Award}
              color="green"
            />

            <StatCard
              title="Document Types"
              value={Object.keys(summaryData?.documentsByType || {}).length}
              subtitle="Different types processed"
              icon={TrendingUp}
              color="purple"
            />

            <StatCard
              title="Daily Average"
              value={summaryData?.dailyStats ?
                Math.round(summaryData.totalDocuments / Math.max(summaryData.dailyStats.length, 1)) : 0}
              subtitle="Documents per day"
              icon={Calendar}
              color="orange"
            />
          </div>

          {/* Document Types Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                Document Types
              </h3>
              <div className="space-y-3">
                {Object.entries(summaryData?.documentsByType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (count / (summaryData?.totalDocuments || 1)) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                Status Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(summaryData?.documentsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (count / (summaryData?.totalDocuments || 1)) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <BlankCalendar />
        </>
      )}
    </div>
  )
}