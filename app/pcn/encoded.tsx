import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { Copy } from "lucide-react"
import { get } from "component/fetchComponent"
import LoadingOverlay  from "component/overlayLoading"
import type { Pcn } from "~/types/pcnTypes"
import type { RootState } from "redux/store"

const Encoded = () => {
    const user = useSelector((state: RootState) => state.user)

    const { data: encodedPCN, isLoading } = useQuery<Pcn[]>({
        queryKey: ["encodedPCN", user],
        queryFn: async (): Promise<Pcn[]> => {
            const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/pcn/encoded?id=${user.id}`)

            return data as Pcn[]
        },
        enabled: !!user.id,
    })

    if (isLoading) {
        return (<LoadingOverlay />)
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
            <div className="p-6 max-h-140">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                    All Encoded PCN
                </h3>
                <div className="overflow-auto max-h-[calc(100vh-300px)]">
                    <table className="min-w-full text-xs border text-black border-gray-200 rounded-lg">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-3 py-2">HH ID</th>
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">PCN</th>
                                <th className="px-3 py-2">TR</th>
                                <th className="px-3 py-2">Encoded</th>
                                <th className="px-3 py-2">Issue</th>
                                <th className="px-3 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encodedPCN && encodedPCN.filter(entry => entry.encoded !== "PENDING").length > 0 ? (
                                encodedPCN
                                    .filter(entry => entry.encoded !== "PENDING")
                                    .map(entry => (
                                        <tr key={entry.id}>
                                            <td className="px-3 py-2 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {entry.hhId}
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(entry.hhId)}
                                                        className="text-gray-600 hover:text-gray-800 p-1"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-center">{entry.grantee}</td>

                                            {/* Show PCN only if not empty */}
                                            <td className="px-3 py-2 text-center">
                                                {entry.pcn ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        {entry.pcn}
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(entry.pcn)}
                                                            className="text-gray-600 hover:text-gray-800 p-1"
                                                        >
                                                            <Copy size={12} />
                                                        </button>
                                                    </div>
                                                ) : "-"}
                                            </td>

                                            {/* Show TR only if not empty */}
                                            <td className="px-3 py-2 text-center">{entry.tr || "-"}</td>

                                            <td className="px-3 py-2 text-center">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${entry.encoded === "YES"
                                                        ? "bg-green-100 text-green-800"
                                                        : entry.encoded === "UPDATED"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {entry.encoded}
                                                </span>
                                            </td>

                                            <td className="px-3 py-2 text-center">{entry.issue || "No issues"}</td>
                                            <td className="px-3 py-2 text-center">{new Date(entry.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                                        No encoded data
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Encoded
