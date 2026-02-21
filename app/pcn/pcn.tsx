import { useEffect, useState } from 'react';
import { Save, RefreshCw, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { usePcn } from 'component/pcnMutation';
import type { PcnFields } from '~/types/pcnTypes';
import type { RootState } from 'redux/store';
import Pending from './pending';
import Encoded from './encoded';
import PcnRecent from './recentPcn';
import LoadingOverlay from 'component/overlayLoading';


const encodedOptions = [
    "PENDING",
    "NO",
    "UPDATED",
    "YES"]

function PCNForm() {
    const pcnMutation = usePcn()

    const User = useSelector((state: RootState) => state.user);

    const [activeTab, setActiveTab] = useState<'encode' | 'pending' | 'encoded'>('encode');

    const [error, setError] = useState<string>("")
    const [formData, setFormData] = useState<PcnFields>({
        userId: Number(User.id),
        username: User.name,
        hhId: '',
        grantee: '',
        pcn: '',
        tr: '',
        issue: '',
        date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0],
        encoded: 'PENDING'
    });

    useEffect(() => {
        if (User.id && User.name) {
            setFormData(prev => ({
                ...prev,
                userId: Number(User.id),
                username: User.name,
            }))
        }
    }, [User])


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value.toUpperCase()
        }))
    }

    const handleSubmit = async () => {
        if (!formData.pcn && !formData.tr) {
            setError("You must enter at least a PCN or TR")
            return
        }
        setError("")

        const {  ...rest } = formData
        const payload = {
            ...rest,
            date: new Date(formData.date).toISOString(),
        }

        pcnMutation.mutate(payload)
    
        //handleReset()
    }

    const handleReset = () => {
        setFormData({
            userId: Number(User.id),
            username: User.name,
            hhId: '',
            grantee: '',
            pcn: '',
            tr: '',
            issue: '',
            date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString().split('T')[0],
            encoded: 'PENDING'
        });
    };

    if (!User.id) return <LoadingOverlay />


    return (
        <div className="max-h-screen overflow-y-auto">
            <div className="h-full max-w-full mx-auto flex flex-col">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
                    <div className="px-6 py-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h1 className="text-xl font-bold text-black">PCN ACCOMPLISHMENT TRACKING</h1>
                        <span className="text-gray-500 text-sm ml-2">- Payment Control Number Form</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('encode')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'encode'
                                ? 'border-black text-black bg-gray-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending'
                                ? 'border-black text-black bg-gray-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setActiveTab('encoded')}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'encoded'
                                ? 'border-black text-black bg-gray-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Encoded
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {/* Tab Content */}
                {activeTab === "encode" && (
                    <div className="flex flex-col gap-4">
                        {/* Form Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
                            <div className="overflow-y-auto p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                    {/* Column 1 - Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                            Basic Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="hhId" className="block text-xs font-medium text-black mb-1">
                                                    HH ID <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="hhId"
                                                    name="hhId"
                                                    value={formData.hhId}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                                    placeholder="Enter HH ID"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="name" className="block text-xs font-medium text-black mb-1">
                                                    Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.grantee}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                                    placeholder="Enter Name"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="date" className="block text-xs font-medium text-black mb-1">
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    id="date"
                                                    name="date"
                                                    required
                                                    disabled={true}
                                                    value={formData.date}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2 - PCN & TR Details */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                            PCN Details
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="space-y-3">
                                                <div>
                                                    <label htmlFor="pcn" className="block text-xs font-medium text-black mb-1">
                                                        PCN
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="pcn"
                                                        name="pcn"
                                                        value={formData.pcn}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                                        placeholder="Enter PCN"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="tr" className="block text-xs font-medium text-black mb-1">
                                                        TR
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="tr"
                                                        name="tr"
                                                        value={formData.tr}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                                        placeholder="Enter TR"
                                                    />
                                                </div>

                                            </div>


                                            <div>
                                                <label htmlFor="encoded" className="block text-xs font-medium text-black mb-1">
                                                    Encoded
                                                </label>
                                                <select
                                                    id="encoded"
                                                    name="encoded"
                                                    value={formData.encoded}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                                                >
                                                    {encodedOptions.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3 - Issues & Actions */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                            Additional Info
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label htmlFor="issue" className="block text-xs font-medium text-black mb-1">
                                                    Issues
                                                </label>
                                                <textarea
                                                    id="issue"
                                                    name="issue"
                                                    value={formData.issue}
                                                    onChange={handleInputChange}
                                                    rows={1}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 resize-none text-black"
                                                    placeholder="Enter issues..."
                                                />
                                            </div>

                                            {error && (
                                                <p className="text-red-500 text-xs mt-1">{error}</p>
                                            )}

                                            <div className="space-y-2 pt-4">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="w-full bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Save size={16} />
                                                    Submit Form
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleReset}
                                                    className="w-full bg-gray-200 text-black px-4 py-2 rounded font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <RefreshCw size={16} />
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Section */}
                        <PcnRecent />
                    </div>
                )}


                {activeTab === 'pending' && (
                    <Pending />
                )}

                {activeTab === 'encoded' && (
                    <Encoded />
                )}
            </div>
        </div>
    );
}

export default function MainContent() {
    return (
        <main className="p-6 h-full">
            <PCNForm />
        </main>
    );
}