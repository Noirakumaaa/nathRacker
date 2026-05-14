import { Outlet, useParams } from "react-router"
import AaModuleTable from "~/features/aa/AaModuleTable"

export default function AaModuleViewRoute() {
  const { moduleCode } = useParams<{ moduleCode: string }>()

  return (
    <div className="relative flex min-h-full">
      <div className="flex-1">
        <AaModuleTable moduleCode={moduleCode ?? ""} />
      </div>
      {/* Drawer renders here when a document ID is in the URL */}
      <Outlet />
    </div>
  )
}
