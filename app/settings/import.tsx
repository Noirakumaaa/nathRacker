import { useState } from "react";
import { Check, Upload, Save, RefreshCw, X } from "lucide-react";

export default function ImportData() {
    const [fileType, setFileType] = useState("bus");
    const [file, setFile] = useState<File | null>(null);
    const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' | 'error' }>({});
    const [importError, setImportError] = useState<string>('');
    const [importErrors, setImportErrors] = useState<string[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
        else setFile(null);
    };

    const SaveButton = ({ section, onClick }: { section: string, onClick: () => void }) => {
        const status = saveStatus[section] || 'idle';
        return (
            <button
                onClick={onClick}
                disabled={status === 'saving'}
                className={`px-4 py-2 rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors ${status === 'saved'
                    ? 'bg-green-600 text-white'
                    : status === 'saving'
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                {status === 'saving' ? (
                    <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Saving...
                    </>
                ) : status === 'saved' ? (
                    <>
                        <Check className="w-4 h-4" />
                        Saved!
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Save
                    </>
                )}
            </button>
        );
    };

    const handleUpload = async () => {
        if (!file) return;
        
        // Show guide modal first
        setShowGuideModal(true);
    };

    const proceedWithUpload = async () => {
        setShowGuideModal(false);
        setSaveStatus({ ...saveStatus, import: 'saving' });
        setImportError('');
        setImportErrors([]);
        setShowErrorModal(false);

        // Simulate upload
        setTimeout(() => {
            const success = Math.random() > 0.3;
            if (success) {
                setSaveStatus({ ...saveStatus, import: 'saved' });
                setFile(null);
            } else {
                setSaveStatus({ ...saveStatus, import: 'error' });
                setImportErrors(['Row 5: Missing granteeName', 'Row 12: Invalid date format', 'Row 18: hhId already exists']);
                setShowErrorModal(true);
            }
            
            setTimeout(() => {
                setSaveStatus({ ...saveStatus, import: 'idle' });
            }, 2000);
        }, 1500);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-black mb-1">
                        Data Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    >
                        <option value="bus">Bus Records</option>
                        <option value="swdi">SWDI Data</option>
                        <option value="pcn">PCN Records</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-black mb-1">
                        Select File <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    />
                </div>

                {file && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="flex items-center space-x-3">
                            <Upload className="w-4 h-4 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">{file.name}</p>
                                <p className="text-xs text-blue-700">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {fileType.toUpperCase()} format
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {importError && <h1 className="text-red-600 text-sm">{importError}</h1>}

                <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <h4 className="text-xs font-medium text-black mb-2">Import Guidelines</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Ensure CSV file has proper headers</li>
                        <li>• Data should be clean and formatted</li>
                        <li>• Large files may take time to process</li>
                        <li>• Duplicate records will be skipped</li>
                    </ul>
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <SaveButton section="import" onClick={handleUpload} />
            </div>
            
            {/* Format Guide Modal */}
            {showGuideModal && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-[600px] max-w-full p-6 border border-gray-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-black">Import Format Guide</h3>
                            <button
                                onClick={() => setShowGuideModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fileType === 'bus' && (
                                <>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                                        <h4 className="font-semibold text-sm text-blue-900 mb-2">BUS Records Format</h4>
                                        <p className="text-xs text-blue-800 mb-3">Your CSV file must contain the following headers in this exact order:</p>
                                    </div>
                                    
                                    <div className="bg-gray-100 p-3 rounded border border-gray-300 overflow-x-auto">
                                        <code className="text-xs font-mono text-black whitespace-nowrap">
                                            lgu, barangay, hhId, granteeName, typeOfUpdate, encoded, issue, subjectOfChange, date
                                        </code>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-black">Column Descriptions:</h4>
                                        <ul className="text-xs text-gray-700 space-y-1.5 pl-4">
                                            <li><span className="font-medium">lgu:</span> Local Government Unit name</li>
                                            <li><span className="font-medium">barangay:</span> Barangay name</li>
                                            <li><span className="font-medium">hhId:</span> Household ID number</li>
                                            <li><span className="font-medium">granteeName:</span> Name of the grantee</li>
                                            <li><span className="font-medium">typeOfUpdate:</span> Type of update being made</li>
                                            <li><span className="font-medium">encoded:</span> Encoding status or date</li>
                                            <li><span className="font-medium">issue:</span> Issue description (if any)</li>
                                            <li><span className="font-medium">subjectOfChange:</span> What is being changed</li>
                                            <li><span className="font-medium">date:</span> Date of record</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <h4 className="font-semibold text-xs text-yellow-900 mb-1">Important Notes:</h4>
                                        <ul className="text-xs text-yellow-800 space-y-1 pl-3">
                                            <li>• Headers are case-sensitive and must match exactly</li>
                                            <li>• No extra spaces in header names</li>
                                            <li>• All columns are required</li>
                                            <li>• Empty values should be left blank, not filled with "N/A" or "-"</li>
                                        </ul>
                                    </div>
                                </>
                            )}

                            {fileType === 'swdi' && (
                                <>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                                        <h4 className="font-semibold text-sm text-blue-900 mb-2">SWDI Data Format</h4>
                                        <p className="text-xs text-blue-800 mb-3">Your CSV file must contain the following headers in this exact order:</p>
                                    </div>
                                    
                                    <div className="bg-gray-100 p-3 rounded border border-gray-300 overflow-x-auto">
                                        <code className="text-xs font-mono text-black whitespace-nowrap">
                                            hhId, grantee, swdiScore, encoded, issue, date
                                        </code>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-black">Column Descriptions:</h4>
                                        <ul className="text-xs text-gray-700 space-y-1.5 pl-4">
                                            <li><span className="font-medium">hhId:</span> Household ID number</li>
                                            <li><span className="font-medium">grantee:</span> Name of the grantee</li>
                                            <li><span className="font-medium">swdiScore:</span> SWDI Score value</li>
                                            <li><span className="font-medium">encoded:</span> Encoding status or date</li>
                                            <li><span className="font-medium">issue:</span> Issue description (if any)</li>
                                            <li><span className="font-medium">date:</span> Date of record</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <h4 className="font-semibold text-xs text-yellow-900 mb-1">Important Notes:</h4>
                                        <ul className="text-xs text-yellow-800 space-y-1 pl-3">
                                            <li>• Headers are case-sensitive and must match exactly</li>
                                            <li>• No extra spaces in header names</li>
                                            <li>• All columns are required</li>
                                            <li>• Empty values should be left blank, not filled with "N/A" or "-"</li>
                                        </ul>
                                    </div>
                                </>
                            )}

                            {fileType === 'pcn' && (
                                <>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                                        <h4 className="font-semibold text-sm text-blue-900 mb-2">PCN Records Format</h4>
                                        <p className="text-xs text-blue-800 mb-3">Your CSV file must contain the following headers in this exact order:</p>
                                    </div>
                                    
                                    <div className="bg-gray-100 p-3 rounded border border-gray-300 overflow-x-auto">
                                        <code className="text-xs font-mono text-black whitespace-nowrap">
                                            hhId, grantee, pcn, tr, encoded, issue, date
                                        </code>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-black">Column Descriptions:</h4>
                                        <ul className="text-xs text-gray-700 space-y-1.5 pl-4">
                                            <li><span className="font-medium">hhId:</span> Household ID number</li>
                                            <li><span className="font-medium">grantee:</span> Name of the grantee</li>
                                            <li><span className="font-medium">pcntr:</span> PCN value</li>
                                            <li><span className="font-medium">pcntr:</span> TR value</li>
                                            <li><span className="font-medium">encoded:</span> Encoding status or date</li>
                                            <li><span className="font-medium">issue:</span> Issue description (if any)</li>
                                            <li><span className="font-medium">date:</span> Date of record</li>
                                        </ul>
                                    </div>

                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <h4 className="font-semibold text-xs text-yellow-900 mb-1">Important Notes:</h4>
                                        <ul className="text-xs text-yellow-800 space-y-1 pl-3">
                                            <li>• Headers are case-sensitive and must match exactly</li>
                                            <li>• No extra spaces in header names</li>
                                            <li>• All columns are required</li>
                                            <li>• Empty values should be left blank, not filled with "N/A" or "-"</li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={() => setShowGuideModal(false)}
                                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={proceedWithUpload}
                                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                I Understand, Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-96 max-w-full p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-sm text-black">Import Errors</h4>
                        </div>
                        <ul className="text-xs text-red-600 max-h-64 overflow-y-auto space-y-2 pl-2">
                            {importErrors.map((err, i) => (
                                <li key={i} className="list-disc">{err}</li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}