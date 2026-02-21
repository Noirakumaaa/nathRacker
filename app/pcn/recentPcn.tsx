import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "redux/store"
import { Copy } from "lucide-react"
import { useEffect } from "react"
import { setNewData } from "redux/slice/pcn/pcnSlice"
import { get } from "component/fetchComponent"


export type Pcn = {
  id: number
  hhId: string
  grantee: string
  pcn: string
  tr: string
  encoded: "YES" | "NO" | "UPDATED" | "PENDING"
  issue?: string
  date: string
  userId: number
  username: string
  createdAt?: string
  updatedAt?: string
}

export default function PcnRecent() {
  const dispatch = useDispatch<AppDispatch>()
  const User = useSelector((state: RootState) => state.user)
  const newPcnData = useSelector((state: RootState) => state.pcn.newData)

  const { data: recentPcn, isLoading, refetch } = useQuery<Pcn[]>({
    queryKey: ["recentPcn", User],
    queryFn: async ():Promise <Pcn[]> => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/pcn/recent?id=${User.id}`)
      return data as Pcn[]
    },
    enabled: !!User.id,
  })

  useEffect(() => {
    if (newPcnData) {
      refetch()
      dispatch(setNewData(false))
    }
  }, [newPcnData])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto mt-4 flex-shrink-0">
      <div className="p-6">
        <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
          Recent PCN Updates
        </h3>

        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm text-black rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">HH ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">PCN</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">TR</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Encoded</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Issue</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : !recentPcn || recentPcn.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                    No recent PCN updates
                  </td>
                </tr>
              ) : (
                recentPcn.map((update, index) => (
                  <tr
                    key={update.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {update.hhId}
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(update.hhId)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">{update.grantee}</td>

                    <td className="px-4 py-3 text-center">
                      {update.pcn ? (
                        <div className="flex items-center justify-center gap-2">
                          {update.pcn}
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(update.pcn)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      ) : "-"}
                    </td>

                    <td className="px-4 py-3 text-center">{update.tr || "-"}</td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${update.encoded === "YES"
                            ? "bg-green-100 text-green-800"
                            : update.encoded === "NO"
                              ? "bg-red-100 text-red-800"
                              : update.encoded === "UPDATED"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {update.encoded}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center" title={update.issue}>
                      {update.issue || "No issues"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {new Date(update.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}
