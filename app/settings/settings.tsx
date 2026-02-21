import { useState } from "react"
import { Check, Eye, EyeOff, Upload, Download, Shield, Bell, Palette, Globe, Clock, User, Save, AlertCircle, Settings, RefreshCw } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "redux/store"
import ImportData from "./import"

export default function SettingsPage() {


  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [showPassword, setShowPassword] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' | 'error' }>({})
  const [general, setGeneral] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: false,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
  })

  const [appearance, setAppearance] = useState("light")
  const [backup, setBackup] = useState("weekly")
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
  })
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC")

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "language", label: "Language", icon: Globe },
    { id: "backup", label: "Backup", icon: Download },
    { id: "import", label: "Import Data", icon: Upload },
  ]

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneral({ ...general, [e.target.name]: e.target.value })
  }

  const handleNotificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked })
  }



  const handleSave = async (section: string) => {
    setSaveStatus({ ...saveStatus, [section]: 'saving' })
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaveStatus({ ...saveStatus, [section]: 'saved' })
    setTimeout(() => {
      setSaveStatus({ ...saveStatus, [section]: 'idle' })
    }, 2000)

    if (section === 'security') {
      const sessionTimeSave = await fetch('/api/auth/sessionTimeout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionTime: security.sessionTimeout,
        }),
      });
    }
  }



  const handleReset = () => {
    setGeneral({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    })
    setFile(null)
  }


  const SaveButton = ({ section, onClick }: { section: string, onClick: () => void }) => {
    const status = saveStatus[section] || 'idle'
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
    )
  }


  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6 text-black">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={general.firstName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={general.username}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={general.phone}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={general.lastName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={general.email}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-black mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={general.password}
                      onChange={handleGeneralChange}
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <SaveButton section="general" onClick={() => handleSave("general")} />
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-black rounded font-medium hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                  <div>
                    <label className="text-sm font-medium text-black capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <p className="text-xs text-gray-500">
                      {key === 'emailAlerts' && 'Receive important updates via email'}
                      {key === 'smsAlerts' && 'Get text messages for urgent notifications'}
                      {key === 'pushNotifications' && 'Browser notifications for real-time alerts'}
                      {key === 'weeklyReports' && 'Weekly summary of your activity'}
                      {key === 'securityAlerts' && 'Immediate alerts for security events'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleNotificationsChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              <SaveButton section="notifications" onClick={() => handleSave("notifications")} />
            </div>
          </div>
        )

      case "appearance":
        return (
          <div className="space-y-6 text-black">
            <div>
              <label className="block text-xs font-medium text-black mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {['light', 'dark'].map((theme) => (
                  <div
                    key={theme}
                    className={`cursor-pointer rounded border-2 p-3 transition-all ${appearance === theme
                      ? 'border-black bg-gray-50'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onClick={() => setAppearance(theme)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${theme === 'light' ? 'bg-white border-2 border-gray-300' : 'bg-gray-800'}`}></div>
                      <span className="text-sm font-medium capitalize">{theme} Theme</span>
                    </div>
                    {appearance === theme && (
                      <div className="mt-2">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <SaveButton section="appearance" onClick={() => handleSave("appearance")} />
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-xs font-medium text-yellow-800">Security Recommendation</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Enable two-factor authentication for enhanced account security.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-black">Two-Factor Authentication</label>
                  <p className="text-xs text-gray-500">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.twoFactor}
                    onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-black">Login Alerts</label>
                  <p className="text-xs text-gray-500">Get notified of new login attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.loginAlerts}
                    onChange={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-black mb-1">Session Timeout</label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <SaveButton section="security" onClick={() => handleSave("security")} />
            </div>
          </div>
        )

      case "language":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-black"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                  <option value="CET">CET</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <SaveButton section="language" onClick={() => handleSave("language")} />
            </div>
          </div>
        )

      case "backup":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-black mb-2">Backup Frequency</label>
              <div className="space-y-2">
                {[
                  { value: 'daily', label: 'Daily Backup', desc: 'Every day at 2 AM' },
                  { value: 'weekly', label: 'Weekly Backup', desc: 'Every Sunday at 2 AM' },
                  { value: 'monthly', label: 'Monthly Backup', desc: 'First of each month' },
                  { value: 'manual', label: 'Manual Only', desc: 'Only when triggered' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`cursor-pointer rounded border-2 p-3 transition-all ${backup === option.value
                      ? 'border-black bg-gray-50'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onClick={() => setBackup(option.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="backup"
                        value={option.value}
                        checked={backup === option.value}
                        onChange={() => { }}
                        className="text-black"
                      />
                      <div>
                        <div className="text-sm font-medium text-black">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Backup Now
              </button>
            </div>

            <div className="flex gap-2 pt-4">
              <SaveButton section="backup" onClick={() => handleSave("backup")} />
            </div>
          </div>
        )

      case "import":
        return <ImportData />

      default:
        return null
    }
  }

  return (
    <main className="p-6 h-full max-h-screen overflow-y-auto">
      <div className="h-full max-w-full mx-auto flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex-shrink-0">
          <div className="px-6 py-4 flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-700" />
            <h1 className="text-xl font-bold text-black">SYSTEM SETTINGS</h1>
            <span className="text-gray-500 text-sm ml-2">- Account Configuration</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
              <nav className="p-4 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded transition-colors ${activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-black text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h3>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}