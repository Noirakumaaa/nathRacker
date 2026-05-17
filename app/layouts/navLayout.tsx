import { useState, useEffect, useRef } from "react"
import { useNavigation } from "react-router"
import type { ReactNode } from "react"
import Sidebar from "~/components/sideMenu"
import TopNavbar from "~/components/navigation"
import { ErrorBoundary } from "~/components/ErrorBoundary"

type LayoutWrapperProps = {
  children: ReactNode
}

function TopProgressBar() {
  const navigation = useNavigation()
  const isNavigating = navigation.state === "loading"
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isNavigating) {
      setVisible(true)
      setWidth(20)
      timerRef.current = setInterval(() => {
        setWidth((w) => (w < 85 ? w + Math.random() * 8 : w))
      }, 200)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setWidth(100)
      const hide = setTimeout(() => {
        setVisible(false)
        setWidth(0)
      }, 300)
      return () => clearTimeout(hide)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isNavigating])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-(--color-border)">
      <div
        className="h-full bg-(--color-ink) transition-all duration-200 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const updateSidebarOption = (_option: string) => {}

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-(--color-bg)">
      <TopProgressBar />

      {/* Fixed Top Navigation */}
      <TopNavbar onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          updateSidebarOption={updateSidebarOption}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto pt-16">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default LayoutWrapper
