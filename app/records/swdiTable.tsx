import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import type { FilterState } from "./records";
import type { RootState } from "redux/store";
import { useQuery } from "@tanstack/react-query";
import { get } from "component/fetchComponent";
import { getEncodedBadgeClass } from "./records";
import type { SwdiData } from "./records";

export function SwdiTable() {

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        encoded: '',
        dateFrom: '',
        dateTo: '',
        username: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 10;

    const { data: swdiData = [], isLoading, refetch } = useQuery<SwdiData[]>({
        queryKey: ['swdiData'],
        queryFn: async () => await get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/swdi/records`)
    });

    const filteredData = useMemo(() => swdiData.filter(item => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = filters.search ? [
            item.hhId, item.grantee, item.swdiScore, item.issue || '', item.date
        ].some(v => v.toLowerCase().includes(searchTerm)) : true;

        const matchesEncoded = filters.encoded ? item.encoded === filters.encoded : true;
        const matchesUsername = filters.username ? item.username === filters.username : true;

        const itemDate = new Date(item.date);
        const from = filters.dateFrom ? new Date(filters.dateFrom + 'T00:00:00') : null;
        const to = filters.dateTo ? new Date(filters.dateTo + 'T23:59:59') : null;
        const matchesDate = (!from || itemDate >= from) && (!to || itemDate <= to);

        return matchesSearch && matchesEncoded && matchesUsername && matchesDate;
    }), [swdiData, filters]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            encoded: '',
            dateFrom: '',
            dateTo: '',
            username: ''
        });
        setCurrentPage(1);
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };


    const getScoreColor = (score: string) => {
        const numScore = parseFloat(score);
        if (numScore >= 80) return 'text-green-700 bg-green-100';
        if (numScore >= 60) return 'text-yellow-700 bg-yellow-100';
        if (numScore >= 40) return 'text-orange-700 bg-orange-100';
        return 'text-red-700 bg-red-100';
    };

    return (
        <div className="p-6 bg-white min-h-screen">
 
            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-sm border text-black border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                            disabled={isLoading}
                        >
                            <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            Filters
                        </button>
                    </div>

                    <div className="text-sm text-black bg-gray-50 px-3 py-2 rounded-lg">
                        Showing {paginatedData.length} of {filteredData.length} records
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Search</label>
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Search HH ID, grantee, score..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Encoded Status</label>
                                <select
                                    value={filters.encoded}
                                    onChange={(e) => handleFilterChange('encoded', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                >
                                    <option value="">All Status</option>
                                    <option value="Encoded">Encoded</option>
                                    <option value="Not Encoded">Not Encoded</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Username</label>
                                <input
                                    type="text"
                                    value={filters.username}
                                    onChange={(e) => handleFilterChange('username', e.target.value)}
                                    placeholder="Filter by username..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Date From</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Date To</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border text-black border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full max-h-10 divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">HH ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Grantee</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">SWDI Score</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Issue</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-black">Loading SWDI records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <div className="text-black">
                                            <svg className="mx-auto h-12 w-12 text-black mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-lg font-medium mb-1">No SWDI records found</p>
                                            <p className="text-sm">Try adjusting your filters or refresh the data</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => (
                                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                        <td className="px-4 py-4 text-sm text-black">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{item.hhId}</span>
                                                <button
                                                    onClick={() => copyToClipboard(item.hhId)}
                                                    className="p-1 text-black hover:text-black hover:bg-gray-100 rounded transition-colors duration-200"
                                                    title="Copy HH ID"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-black font-medium">{item.grantee}</td>
                                        <td className="px-4 py-4 text-sm">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(item.swdiScore)}`}>
                                                {item.swdiScore}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEncodedBadgeClass(item.encoded)}`}>
                                                {item.encoded}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-black">
                                            {item.issue ? (
                                                <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">{item.issue}</span>
                                            ) : (
                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">No issues</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-black">
                                            {new Date(item.date).toLocaleDateString('en-US')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-4">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-black">
                                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{' '}
                                    <span className="font-medium">{filteredData.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-black hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return (
                                                <span key={pageNum} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}