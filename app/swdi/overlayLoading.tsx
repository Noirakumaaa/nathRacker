import { Database } from "lucide-react"

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin text-blue-600 mb-4">
          <Database className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingOverlay
