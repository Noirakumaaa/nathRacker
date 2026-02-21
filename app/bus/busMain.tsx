import { FileText } from "lucide-react";

import RecentTable from "./busTableRecent";
import BusForm from "./busForm";

export default function BusMain() {
  return (
    <main className="p-6 h-full">
      <div className="max-h-screen overflow-y-auto">
        <div className="h-full max-w-full mx-auto flex flex-col">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
            <div className="px-6 py-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-700" />
              <h1 className="text-xl font-bold text-black">
                BUS ACCOMPLISHMENT TRACKING
              </h1>
              <span className="text-gray-500 text-sm ml-2">
                - Household Information Form
              </span>
            </div>
          </div>
          {/* BUS FORM */}
          <BusForm />
          {/* Recent Updates */}
          <RecentTable />
        </div>
      </div>
    </main>
  );
}
