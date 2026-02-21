import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { get } from 'component/fetchComponent';
import type { EncodedDocument } from '~/types/dashboardTypes';


export function DailyStats({ timeRange }: { timeRange: string }) {
    const User = useSelector((state: RootState) => state.user);

    const { data: dailyStats, isLoading } = useQuery<EncodedDocument[]>({
        queryKey: ['dailyStats', User.id, timeRange],
        queryFn: () => {
            return get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/dailystats?id=${User.id}&days=${timeRange.slice(0, -1)}`)
        },
        enabled: !!User.id 
    });

    if(isLoading) return 

    return (
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Encoding Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="encoded" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Encoded" />
                    <Area type="monotone" dataKey="updated" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Updated" />
                    <Area type="monotone" dataKey="issues" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Issues" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}