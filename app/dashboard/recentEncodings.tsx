import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { ChevronUp, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { get } from "component/fetchComponent";
import type { EncodedDocument } from "~/types/dashboardTypes";
import type { JSX } from "react";
import type { RootState } from "redux/store";

const statusMap: Record<EncodedDocument['encoded'], { color: string; icon: JSX.Element }> = {
    YES: { color: 'text-green-600 bg-green-100', icon: <CheckCircle className="w-4 h-4" /> },
    NO: { color: 'text-red-600 bg-red-100', icon: <AlertTriangle className="w-4 h-4" /> },
    UPDATED: { color: 'text-yellow-600 bg-yellow-100', icon: <ChevronUp className="w-4 h-4" /> },
    PENDING: { color: 'text-blue-600 bg-blue-100', icon: <Clock className="w-4 h-4" /> }
};

export function RecentEncoding() {

    const User = useSelector((state: RootState) => state.user);

    const { data: recentEncodings, isLoading } = useQuery<EncodedDocument[]>({
        queryKey: ['recentData', User],
        queryFn: async (): Promise<EncodedDocument[]> => {
            const data = await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/recent?id=${User.id}`)
            return data as EncodedDocument[]
        },
        enabled: !!User.id
    });

    if (isLoading) return

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Encodings</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'HH ID', 'Name', 'Type', 'Encoded', 'Date'].map((col, i) => (
                                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recentEncodings?.map((enc) => {
                            const { color, icon } = statusMap[enc.encoded];
                            return (
                                <tr key={enc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{enc.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{enc.hhId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-900 truncate max-w-xs">{enc.name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enc.documentType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                                            {icon}<span className="ml-1">{enc.encoded}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(enc.date).toISOString().split("T")[0]}
                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    )
}