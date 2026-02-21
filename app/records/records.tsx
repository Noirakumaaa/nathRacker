import React, { useState } from "react";
import { Database, FileText, Grid3X3, List } from "lucide-react";
import { BusTable } from "./busTable";
import { SwdiTable } from "./swdiTable";
import { PcnTable } from "./pcnTable";

export interface FilterState { search:string; encoded:string; dateFrom:string; dateTo:string; username:string; }
export type BusData = { id:number; username:string; lgu:string; barangay:string; hhId:string; granteeName:string; typeOfUpdate:string; encoded:'YES'|'NO'|'UPDATED'|'PENDING'; issue?:string; subjectOfChange:string; date:string; userId:number; };
export type SwdiData = { id:number; username:string; hhId:string; grantee:string; swdiScore:string; encoded:'YES'|'NO'|'UPDATED'|'PENDING'; issue?:string; date:string; userId:number; };
export type PcnData = { id:number; username:string; hhId:string; grantee:string; pcn:string; tr:string; encoded:'YES'|'NO'|'UPDATED'|'PENDING'; issue?:string; date:string; userId:number; };

export function getEncodedBadgeClass(encoded:string){
  switch(encoded){
    case 'YES': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'NO': return 'bg-red-50 text-red-700 border border-red-200';
    case 'UPDATED': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200';
    default: return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
}

const tabConfig = {
  BUS: { icon: Database, label: "Business Updates", color: "from-blue-600 to-indigo-600" },
  SWDI: { icon: Grid3X3, label: "SWDI Data", color: "from-purple-600 to-pink-600" },
  PCN: { icon: List, label: "PCN Records", color: "from-green-600 to-emerald-600" }
};

export default function DataDashboard() {
  const [activeTab, setActiveTab] = useState<"BUS"|"SWDI"|"PCN">("BUS");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7x2 mx-auto p-6">

        {/* Header with Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Title area */}
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-700 flex-shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">Global All Encoded Data</h1>
                <span className="text-gray-500 text-sm">
                  Manage and monitor your data across different modules
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {(["BUS","SWDI","PCN"] as const).map(tab => {
                const config = tabConfig[tab];
                const Icon = config.icon;
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {activeTab === "BUS" && <BusTable />}
          {activeTab === "SWDI" && <SwdiTable />}
          {activeTab === "PCN" && <PcnTable />}
        </div>

      </div>
    </div>
  );
}