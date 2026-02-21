import { useState, useMemo } from 'react';
import {  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronUp, TrendingUp, Database, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import LoadingOverlay from 'component/overlayLoading';
import { useQuery } from '@tanstack/react-query';
import { DailyStats } from './dailyStats';
import { RecentEncoding } from './recentEncodings';
import { get } from 'component/fetchComponent';
import type { RootState } from '../../redux/store';
import type { EncodedDocument } from '~/types/dashboardTypes';

const EncodingDashboard = () => {
  
  const User = useSelector((state: RootState) => state.user); 
  const [timeRange, setTimeRange] = useState('1d');

  const { data: allEncodedData } = useQuery<EncodedDocument[]>({
    queryKey: ['allData', User.id, timeRange],
    queryFn: async () => {
        return await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/encoded/total?id=${User.id}&days=${timeRange.slice(0, -1)}`)
    },
    enabled: !!User.id,
  });

  const stats = useMemo(() => {
    const data = allEncodedData || [];
    const counts = { total_encoded: data.length, encoded: 0, updated: 0, issues: 0 };
    data.forEach(d => {
      if (d.encoded === "YES") counts.encoded++;
      if (d.encoded === "UPDATED") counts.updated++;
      if (d.encoded === "NO") counts.issues++;
    });
    return counts;
  }, [allEncodedData]);

  const encodingTypeData = useMemo(() => {
    const data = allEncodedData || [];
    const counts = data.reduce<Record<string, number>>((acc, d) => {
      acc[d.documentType] = (acc[d.documentType] || 0) + 1;
      return acc;
    }, {});
    const colors: Record<string, string> = { SWDI: '#3B82F6', BUS: '#10B981', PCN: '#F59E0B', Document: '#EF4444' };
    return Object.entries(counts).map(([type, count]) => ({ type, name: type, count, color: colors[type] || '#888888' }));
  }, [allEncodedData]);


  if(!User.email) return <LoadingOverlay />

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Encoding Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your encoding performance and statistics</p>
        </div>

        <div className="mb-6 flex space-x-2">
          {['1d', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Encoded', value: stats.total_encoded, color: 'blue', icon: <Database className="w-6 h-6 text-blue-600" /> },
            { title: 'Encoded', value: stats.encoded, color: 'green', icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
            { title: 'Updated', value: stats.updated, color: 'yellow', icon: <ChevronUp className="w-6 h-6 text-yellow-600" /> },
            { title: 'Issues', value: stats.issues, color: 'red', icon: <AlertTriangle className="w-6 h-6 text-red-600" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm text-${stat.color}-600 mt-1`}>↗ +12% from last week</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Daily Stats Section */}
          <DailyStats timeRange={timeRange} />


          {/* Encoding by Type Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Encoding by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={encodingTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" label={({ name }) => name}>
                  {encodingTypeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Encodings Table Section */}
        <RecentEncoding />

      </div>
    </div>
  );
};

export default EncodingDashboard;
