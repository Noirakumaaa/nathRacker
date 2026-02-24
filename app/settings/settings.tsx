import { useState } from "react";
import {
  Check, Eye, EyeOff, Upload, Download, Shield, Bell, Palette,
  Globe, User, Save, AlertCircle, Settings, RefreshCw,
  Copy, FileUp, X
} from "lucide-react";
import ImportData from "./import";

// ── shared classes ──────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 text-[13px] border border-[#e8e8e0] rounded-lg text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";
const labelCls =
  "block text-[11px] font-medium text-[#8a8a80] mb-1.5 uppercase tracking-wider";

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex w-10 h-[22px] rounded-full border transition-colors cursor-pointer flex-shrink-0 ${
        checked ? "bg-[#1a1a18] border-[#1a1a18]" : "bg-[#e8e8e0] border-[#e8e8e0]"
      }`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Save button ──────────────────────────────────────────────────────────────
function SaveButton({
  section,
  onClick,
  status,
}: {
  section: string;
  onClick: () => void;
  status: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer border ${
        status === "saved"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : status === "saving"
          ? "bg-[#f5f5f2] text-[#8a8a80] border-[#e8e8e0] cursor-not-allowed"
          : "bg-[#1a1a18] text-white border-[#1a1a18] hover:bg-[#333]"
      }`}
    >
      {status === "saving" ? (
        <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving…</>
      ) : status === "saved" ? (
        <><Check className="w-3.5 h-3.5" /> Saved</>
      ) : (
        <><Save className="w-3.5 h-3.5" /> Save</>
      )}
    </button>
  );
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-3 border-b border-[#e8e8e0] mb-5">
      <h3 className="text-[11px] font-semibold text-[#1a1a18] uppercase tracking-wider">
        {children}
      </h3>
    </div>
  );
}

// ── Import tab (matching landing page import section) ────────────────────────
function ImportTab() {
  const [activeModule, setActiveModule] = useState<"BUS" | "PCN" | "SWDI" | "MISC">("BUS");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const modules = [
    { tag: "BUS" as const,  cls: "bg-indigo-50 text-indigo-600 border-indigo-200",  active: "bg-indigo-50 text-indigo-600 border-indigo-200" },
    { tag: "PCN" as const,  cls: "bg-rose-50 text-rose-600 border-rose-200",        active: "bg-rose-50 text-rose-600 border-rose-200" },
    { tag: "SWDI" as const, cls: "bg-emerald-50 text-emerald-600 border-emerald-200", active: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { tag: "MISC" as const, cls: "bg-amber-50 text-amber-600 border-amber-200",     active: "bg-amber-50 text-amber-600 border-amber-200" },
  ];

  const mockRows = [
    { id: "HH-2024-0883", name: "Juan Dela Cruz",  status: "Ready"   },
    { id: "HH-2024-1120", name: "Maria Santos",    status: "Ready"   },
    { id: "HH-2024-0771", name: "Pedro Reyes",     status: "Warning" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader>Import Data</SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 items-start">
        {/* Left — description */}
        <div>
          <h2 className="text-[20px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#1a1a18] mb-3">
            Import your existing<br />
            <em className="not-italic font-light text-[#8a8a80]">tracked data.</em>
          </h2>
          <p className="text-[14px] text-[#8a8a80] leading-[1.7] mb-5">
            Already have records in a spreadsheet? Upload a{" "}
            <span className="font-mono text-[12px] bg-[#f0f0ec] text-[#1a1a18] px-1.5 py-0.5 rounded">.csv</span>{" "}
            or{" "}
            <span className="font-mono text-[12px] bg-[#f0f0ec] text-[#1a1a18] px-1.5 py-0.5 rounded">.xlsx</span>{" "}
            file and bring your data straight into NathRacker — no manual re-entry needed.
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              "Supports .csv and .xlsx formats",
              "Maps columns to module fields automatically",
              "Validates HH IDs and flags errors before import",
              "Preview records before confirming",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a18] shrink-0" />
                <span className="text-[13px] text-[#8a8a80]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — upload card */}
        <div className="bg-[#fafaf8] border border-[#e8e8e0] rounded-2xl p-6">
          {/* Module selector */}
          <div className="mb-5">
            <p className="text-[11px] font-medium text-[#8a8a80] mb-2 uppercase tracking-wider">Select module</p>
            <div className="grid grid-cols-4 gap-2">
              {modules.map((m) => (
                <button
                  key={m.tag}
                  type="button"
                  onClick={() => setActiveModule(m.tag)}
                  className={`font-mono text-[10px] font-medium py-2 rounded-lg border tracking-wider transition-colors cursor-pointer ${
                    activeModule === m.tag
                      ? m.cls
                      : "bg-white text-[#8a8a80] border-[#e8e8e0] hover:border-[#c8c8c0]"
                  }`}
                >
                  {m.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const dropped = e.dataTransfer.files[0];
              if (dropped) setFile(dropped);
            }}
            className={`border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center text-center transition-colors mb-5 ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-[#e8e8e0] hover:border-[#c8c8c0]"
            }`}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FileUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-medium text-[#1a1a18]">{file.name}</p>
                  <p className="text-[11px] text-[#8a8a80]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="ml-2 text-[#c4c4b8] hover:text-[#8a8a80] transition-colors cursor-pointer bg-transparent border-none"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-white border border-[#e8e8e0] rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-4 h-4 text-[#8a8a80]" />
                </div>
                <p className="text-[13px] font-medium text-[#1a1a18] mb-1">Drop your file here</p>
                <p className="text-[12px] text-[#8a8a80] mb-3">.csv or .xlsx — max 10 MB</p>
                <label className="px-4 py-2 rounded-lg text-[12px] font-medium bg-white text-[#1a1a18] border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors cursor-pointer">
                  Browse file
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFile(f);
                    }}
                  />
                </label>
              </>
            )}
          </div>

          {/* Preview rows */}
          <div className="border border-[#e8e8e0] rounded-xl overflow-hidden mb-4">
            <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-[#fafaf8] border-b border-[#e8e8e0]">
              {["HH ID", "Grantee Name", "Status"].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-[#8a8a80] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {mockRows.map(({ id, name, status }) => (
              <div key={id} className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-[#e8e8e0] last:border-none">
                <span className="text-[11px] font-mono text-[#1a1a18]">{id}</span>
                <span className="text-[12px] text-[#1a1a18]">{name}</span>
                <span className={`text-[11px] font-medium ${status === "Ready" ? "text-emerald-600" : "text-amber-600"}`}>
                  {status === "Ready" ? "✓ Ready" : "⚠ Warning"}
                </span>
              </div>
            ))}
          </div>

          {/* Confirm */}
          <button
            type="button"
            disabled={!file}
            className="w-full py-2.5 rounded-lg text-[13px] font-medium bg-[#1a1a18] text-white hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm import →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});

  const [general, setGeneral] = useState({
    username: "", email: "", password: "",
    firstName: "", lastName: "", phone: "",
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: false, smsAlerts: false,
    pushNotifications: true, weeklyReports: true, securityAlerts: true,
  });
  const [appearance, setAppearance] = useState("light");
  const [backup, setBackup] = useState("weekly");
  const [security, setSecurity] = useState({
    twoFactor: false, loginAlerts: true, sessionTimeout: "30",
  });
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  const tabs = [
    { id: "general",       label: "General",       icon: User     },
    { id: "notifications", label: "Notifications",  icon: Bell     },
    { id: "appearance",    label: "Appearance",     icon: Palette  },
    { id: "security",      label: "Security",       icon: Shield   },
    { id: "language",      label: "Language",       icon: Globe    },
    { id: "backup",        label: "Backup",         icon: Download },
    { id: "import",        label: "Import Data",    icon: Upload   },
  ];

  const getStatus = (s: string) => (saveStatus[s] || "idle") as "idle" | "saving" | "saved" | "error";

  const handleSave = async (section: string) => {
    setSaveStatus((p) => ({ ...p, [section]: "saving" }));
    await new Promise((r) => setTimeout(r, 1000));
    setSaveStatus((p) => ({ ...p, [section]: "saved" }));
    setTimeout(() => setSaveStatus((p) => ({ ...p, [section]: "idle" })), 2000);

    if (section === "security") {
      await fetch("/api/auth/sessionTimeout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionTime: security.sessionTimeout }),
      });
    }
  };

  const handleReset = () => {
    setGeneral({ username: "", email: "", password: "", firstName: "", lastName: "", phone: "" });
  };

  const notifLabels: Record<string, { title: string; desc: string }> = {
    emailAlerts:        { title: "Email Alerts",          desc: "Receive important updates via email" },
    smsAlerts:          { title: "SMS Alerts",            desc: "Get text messages for urgent notifications" },
    pushNotifications:  { title: "Push Notifications",   desc: "Browser notifications for real-time alerts" },
    weeklyReports:      { title: "Weekly Reports",        desc: "Weekly summary of your activity" },
    securityAlerts:     { title: "Security Alerts",       desc: "Immediate alerts for security events" },
  };

  const renderContent = () => {
    switch (activeTab) {

      case "general":
        return (
          <div className="space-y-5">
            <SectionHeader>General Settings</SectionHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>First Name <span className="text-red-400">*</span></label>
                  <input type="text" name="firstName" value={general.firstName} onChange={(e) => setGeneral({ ...general, firstName: e.target.value })} className={inputCls} placeholder="Enter first name" />
                </div>
                <div>
                  <label className={labelCls}>Username <span className="text-red-400">*</span></label>
                  <input type="text" name="username" value={general.username} onChange={(e) => setGeneral({ ...general, username: e.target.value })} className={inputCls} placeholder="Enter username" />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" name="phone" value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className={inputCls} placeholder="Enter phone number" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Last Name <span className="text-red-400">*</span></label>
                  <input type="text" name="lastName" value={general.lastName} onChange={(e) => setGeneral({ ...general, lastName: e.target.value })} className={inputCls} placeholder="Enter last name" />
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                  <input type="email" name="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className={inputCls} placeholder="Enter email" />
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={general.password} onChange={(e) => setGeneral({ ...general, password: e.target.value })} className={inputCls + " pr-16"} placeholder="Enter new password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#8a8a80] hover:text-[#1a1a18] transition-colors cursor-pointer bg-transparent border-none">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 pt-2">
              <SaveButton section="general" status={getStatus("general")} onClick={() => handleSave("general")} />
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium bg-white text-[#1a1a18] border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-5">
            <SectionHeader>Notification Settings</SectionHeader>
            <div className="divide-y divide-[#f5f5f2]">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-4 first:pt-0">
                  <div>
                    <p className="text-[13px] font-medium text-[#1a1a18]">{notifLabels[key]?.title}</p>
                    <p className="text-[12px] text-[#8a8a80] mt-0.5">{notifLabels[key]?.desc}</p>
                  </div>
                  <Toggle
                    checked={value}
                    onChange={() => setNotifications({ ...notifications, [key]: !value })}
                  />
                </div>
              ))}
            </div>
            <div className="pt-2">
              <SaveButton section="notifications" status={getStatus("notifications")} onClick={() => handleSave("notifications")} />
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-5">
            <SectionHeader>Appearance</SectionHeader>
            <div>
              <label className={labelCls}>Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {(["light", "dark"] as const).map((theme) => (
                  <div
                    key={theme}
                    onClick={() => setAppearance(theme)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      appearance === theme
                        ? "border-[#1a1a18] bg-[#fafaf8]"
                        : "border-[#e8e8e0] hover:border-[#c8c8c0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg border ${theme === "light" ? "bg-white border-[#e8e8e0]" : "bg-[#1a1a18] border-[#1a1a18]"}`} />
                        <span className="text-[13px] font-medium text-[#1a1a18] capitalize">{theme}</span>
                      </div>
                      {appearance === theme && <Check className="w-4 h-4 text-[#1a1a18]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <SaveButton section="appearance" status={getStatus("appearance")} onClick={() => handleSave("appearance")} />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-5">
            <SectionHeader>Security</SectionHeader>
            <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[12px] font-medium text-amber-800">Security Recommendation</p>
                <p className="text-[12px] text-amber-700 mt-0.5">Enable two-factor authentication for enhanced account security.</p>
              </div>
            </div>
            <div className="divide-y divide-[#f5f5f2]">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a18]">Two-Factor Authentication</p>
                  <p className="text-[12px] text-[#8a8a80] mt-0.5">Add an extra layer of security</p>
                </div>
                <Toggle checked={security.twoFactor} onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })} />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a18]">Login Alerts</p>
                  <p className="text-[12px] text-[#8a8a80] mt-0.5">Get notified of new login attempts</p>
                </div>
                <Toggle checked={security.loginAlerts} onChange={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })} />
              </div>
              <div className="py-4">
                <label className={labelCls}>Session Timeout</label>
                <select value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} className={inputCls}>
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
            <div className="pt-2">
              <SaveButton section="security" status={getStatus("security")} onClick={() => handleSave("security")} />
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-5">
            <SectionHeader>Language & Region</SectionHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputCls}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputCls}>
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                  <option value="CET">CET</option>
                </select>
              </div>
            </div>
            <div className="pt-2">
              <SaveButton section="language" status={getStatus("language")} onClick={() => handleSave("language")} />
            </div>
          </div>
        );

      case "backup":
        return (
          <div className="space-y-5">
            <SectionHeader>Backup</SectionHeader>
            <div>
              <label className={labelCls}>Backup Frequency</label>
              <div className="space-y-2">
                {[
                  { value: "daily",   label: "Daily Backup",   desc: "Every day at 2 AM"       },
                  { value: "weekly",  label: "Weekly Backup",  desc: "Every Sunday at 2 AM"    },
                  { value: "monthly", label: "Monthly Backup", desc: "First of each month"     },
                  { value: "manual",  label: "Manual Only",    desc: "Only when triggered"     },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setBackup(opt.value)}
                    className={`cursor-pointer rounded-xl border-2 px-4 py-3 transition-all flex items-center gap-4 ${
                      backup === opt.value
                        ? "border-[#1a1a18] bg-[#fafaf8]"
                        : "border-[#e8e8e0] hover:border-[#c8c8c0]"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${backup === opt.value ? "border-[#1a1a18]" : "border-[#c8c8c0]"}`}>
                      {backup === opt.value && <div className="w-2 h-2 rounded-full bg-[#1a1a18]" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#1a1a18]">{opt.label}</p>
                      <p className="text-[12px] text-[#8a8a80]">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium bg-white text-[#1a1a18] border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Download Backup Now
            </button>
            <div className="pt-2">
              <SaveButton section="backup" status={getStatus("backup")} onClick={() => handleSave("backup")} />
            </div>
          </div>
        );

      case "import":
        return <ImportTab />;

      default:
        return null;
    }
  };

  return (
    <main className="p-6 h-full max-h-screen overflow-y-auto bg-[#fafaf8] font-sans antialiased">
      <div className="h-full max-w-full mx-auto flex flex-col gap-4">

        {/* Header */}
        <div className="bg-white border border-[#e8e8e0] rounded-xl px-6 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#f5f5f2] flex items-center justify-center">
            <Settings className="w-4 h-4 text-[#8a8a80]" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[15px] font-semibold tracking-tight text-[#1a1a18]">System Settings</h1>
            <span className="text-[13px] text-[#8a8a80]">— Account Configuration</span>
          </div>
        </div>

        {/* Main panel */}
        <div className="bg-white border border-[#e8e8e0] rounded-xl flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <div className="w-56 border-r border-[#e8e8e0] flex-shrink-0 bg-[#fafaf8]">
            <nav className="p-3 space-y-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#1a1a18] text-white"
                        : "text-[#8a8a80] hover:text-[#1a1a18] hover:bg-[#e8e8e0]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
}