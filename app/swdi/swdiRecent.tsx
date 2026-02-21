import { useQuery } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "redux/store";
import { setCurrentSwdi, setNewData } from "redux/slice/swdi/swdiSlice";
import { useEffect } from "react";
import { Copy } from "lucide-react"
import { get } from "component/fetchComponent";
import type { SwdiData } from "~/types/swdiTypes";

export default function SwdiRecent() {
  const dispatch = useDispatch<AppDispatch>()
  const newSwdiData = useSelector((state: RootState) => state.swdi.newData)

  const { data: recentSwdi, isLoading, error, refetch } = useQuery<SwdiData[]>({
    queryKey: ['recentSwdi'],
    queryFn: async () => {
      const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/swdi/recent`)
      return data as SwdiData[]
    }
  })

  const handleEdit = (id: number) => {
    const entryToEdit = recentSwdi?.find(entry => entry.id === id)
    if (!entryToEdit) return

    const { date, createdAt,updatedAt,id : _, userId, username, ...rest } = entryToEdit
    const dt = new Date(date)
    const formatted =
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}T` +
      `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`


     console.log({...rest}) 
    dispatch(setCurrentSwdi({
      ...rest,
      issue : "",
      date : ""
    }))
  }

  useEffect(() => {
    if (newSwdiData) {
      refetch()
      dispatch(setNewData(false))
    }
  }, [newSwdiData])


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-auto mt-4 flex-shrink-0">
      <div className="p-6">
        <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
          Recent Updates
        </h3>

        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm text-black rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">HH ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Grantee</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">SWDI Score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Encoded</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Issue</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : !recentSwdi || recentSwdi.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                    No recent updates
                  </td>
                </tr>
              ) : (
                recentSwdi.map((update, index) => (
                  <tr
                    key={update.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span>{update.hhId}</span>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(update.hhId)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        <Copy size={14} color="gray" />
                      </button>
                    </td>
                    <td className="px-4 py-3">{update.grantee}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium">
                        {update.swdiScore}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${update.encoded === "YES"
                            ? "bg-green-100 text-green-800"
                            : update.encoded === "NO"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {update.encoded}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 max-w-xs truncate"
                      title={update.issue}
                    >
                      {update.issue || "No issues"}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(update.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(update.id)}
                      >
                        Load
                      </button>
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
