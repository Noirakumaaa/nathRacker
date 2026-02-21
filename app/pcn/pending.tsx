import { useQuery, useMutation } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import type { RootState } from "redux/store"
import { Copy, X, Edit3, Check } from "lucide-react"
import React from "react"
import { get, post} from '../../component/fetchComponent'

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

const Pending = () => {
    const User = useSelector((state: RootState) => state.user)


    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [editValue, setEditValue] = React.useState<string>("")
    const [editIssueValue, setEditIssueValue] = React.useState<string>("")

    const { data: pendingPCN, refetch } = useQuery<Pcn[]>({
        queryKey: ["pendingPCN"],
        queryFn: async (): Promise <Pcn[]> => {
            const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/pcn/pending?id=${User.id}`, User.csrf)
            return data as Pcn[]
        },
        enabled: !!User.id,
    })

    const mutation = useMutation({
        mutationFn: async ({ id, encoded, issue }: { id: number; encoded: string; issue?: string }) => {
            const data = await post(`${import.meta.env.VITE_BACKEND_API_URL}/v1/pcn/${id}`, {id, encoded, issue}, User.csrf)
            return data
        },
        onSuccess: () => refetch(),
    })


    const handleEditEncoded = (id: number, currentValue: string) => {
        setEditingId(id)
        setEditValue(currentValue)
        setEditIssueValue("")
    }

    const handleSaveEncoded = (id: number) => {
        mutation.mutate({ id, encoded: editValue, issue: editValue === "NO" ? editIssueValue : undefined })
        setEditingId(null)
        setEditValue("")
        setEditIssueValue("")
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditValue("")
        setEditIssueValue("")
    }

    if (!User) return <div className="p-6">Please log in to view pending PCN records.</div>;


    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
            <div className="p-6 max-h-140">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                    All Pending PCN
                </h3>
                <div className="overflow-auto max-h-[calc(100vh-300px)]">
                    <table className="min-w-full text-xs border text-black border-gray-200 rounded-lg">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-center">HH ID</th>
                                <th className="px-3 py-2 text-center">Name</th>
                                <th className="px-3 py-2 text-center">PCN</th>
                                <th className="px-3 py-2 text-center">TR</th>
                                <th className="px-3 py-2 text-center">Encoded</th>
                                <th className="px-3 py-2 text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPCN && pendingPCN.filter((entry) => entry.encoded === "PENDING").length > 0 ? (
                                pendingPCN
                                    .filter((entry) => entry.encoded === "PENDING")
                                    .map((entry) => (
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
                                            <td className="px-3 py-2 text-center">
                                                {entry.tr ? entry.tr : "-"}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {editingId === entry.id ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <select
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="text-xs border rounded px-1 py-1"
                                                        >
                                                            <option value="YES">YES</option>
                                                            <option value="NO">NO</option>
                                                            <option value="UPDATED">UPDATED</option>
                                                        </select>
                                                        {editValue === "NO" && (
                                                            <input
                                                                type="text"
                                                                value={editIssueValue}
                                                                onChange={(e) => setEditIssueValue(e.target.value)}
                                                                placeholder="Enter issue..."
                                                                className="text-xs border rounded px-1 py-1"
                                                            />
                                                        )}
                                                        <button
                                                            onClick={() => handleSaveEncoded(entry.id)}
                                                            className="text-green-600 hover:text-green-800 p-1"
                                                            disabled={editValue === "NO" && !editIssueValue}
                                                        >
                                                            <Check size={12} />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1">
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
                                                        <button
                                                            onClick={() => handleEditEncoded(entry.id, entry.encoded)}
                                                            className="text-gray-600 hover:text-gray-800 p-1"
                                                        >
                                                            <Edit3 size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-3 py-2 text-center">
                                                {new Date(entry.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                                        No pending data
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

export default Pending
