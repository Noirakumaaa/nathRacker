import { useState, useCallback, useEffect } from "react";
import { useThemeStore } from "lib/zustand/ThemeStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import APIFETCH from "lib/axios/axiosConfig";
import { useToastStore } from "lib/zustand/ToastStore";
import {
  Check,
  Upload,
  Download,
  Shield,
  Bell,
  Palette,
  Globe,
  User,
  Save,
  AlertCircle,
  Settings,
  RefreshCw,
  FileUp,
  X,
  Lock,
  Database,
  Languages,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Zap,
  Clock,
} from "lucide-react";

// ── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#fafaf8",
  surface: "#ffffff",
  border: "#e8e8e0",
  borderHover: "#c8c8c0",
  ink: "#1a1a18",
  muted: "#8a8a80",
  placeholder: "#c4c4b8",
  subtle: "#f5f5f2",
};

// ── Shared primitives ─────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 text-[13px] border border-(--color-border) rounded-lg text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-surface) focus:outline-none focus:ring-2 focus:ring-(--color-ink) focus:border-transparent hover:border-(--color-border-hover) transition-colors";

const labelCls =
  "block text-[10px] font-semibold text-(--color-muted) mb-1.5 uppercase tracking-widest";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label}{" "}
        {required && <span className="text-red-400 normal-case">*</span>}
      </label>
      {children}
    </div>
  );
}

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
      className={`relative inline-flex w-10 h-5.5 rounded-full border transition-all duration-200 cursor-pointer shrink-0 ${
        checked
          ? "bg-(--color-ink) border-(--color-ink)"
          : "bg-(--color-border) border-(--color-border)"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4.5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle");

  const trigger = useCallback(async (fn?: () => Promise<void>) => {
    setStatus("saving");
    await new Promise((r) => setTimeout(r, 900));
    if (fn) await fn().catch(() => setStatus("error"));
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2200);
  }, []);

  return { status, trigger };
}

function SaveBtn({
  status,
  onClick,
}: {
  status: SaveStatus;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer border ${
        status === "saved"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : status === "saving"
            ? "bg-(--color-subtle) text-(--color-muted) border-(--color-border) cursor-not-allowed"
            : status === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-(--color-ink) text-(--color-bg) border-(--color-ink) hover:opacity-85"
      }`}
    >
      {status === "saving" ? (
        <>
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Saving…
        </>
      ) : status === "saved" ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Saved
        </>
      ) : status === "error" ? (
        <>
          <AlertCircle className="w-3.5 h-3.5" />
          Error
        </>
      ) : (
        <>
          <Save className="w-3.5 h-3.5" />
          Save changes
        </>
      )}
    </button>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="pb-5 border-b border-(--color-border) mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-(--color-subtle) rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-(--color-ink)" />
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-(--color-ink) tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[12px] text-(--color-muted) mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RowDivider({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-(--color-subtle) last:border-none">
      <div className="flex-1 pr-8">
        <p className="text-[13px] font-medium text-(--color-ink)">{label}</p>
        {description && (
          <p className="text-[12px] text-(--color-muted) mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

type UserInfo =  { 
  firstName : string;
  lastName : string;
  phone : string
  password : string;
  user : {
    govUsername : string;
    email : string
  }
}

// ── 1. General Settings ───────────────────────────────────────────────────────
function GeneralSettings() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    govUsername: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const { status, trigger } = useSaveStatus();

  const { data : userInfo } = useQuery({
    queryKey : ["SettingsUserInfo"],
    queryFn : async () => {
      const res = await APIFETCH.get<UserInfo>(`/settings/UserInfo`)
      return res.data
    }
  })

  useEffect(()=>{
    if(!userInfo) return
    setForm(()=>({
      firstName : userInfo.firstName ?? "",
      lastName  : userInfo.lastName  ?? "",
      govUsername  : userInfo.user.govUsername  ?? "",
      email     : userInfo.user.email     ?? "",
      phone     : userInfo.phone     ?? "",
      password  : "",
    }))
  },[userInfo])

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <SectionTitle
        icon={User}
        title="General"
        subtitle="Manage your personal information and account credentials"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <Field label="First Name" required>
          <input
            type="text"
            value={form.firstName}
            onChange={set("firstName")}
            className={inputCls}
            placeholder="Juan"
          />
        </Field>
        <Field label="Last Name" required>
          <input
            type="text"
            value={form.lastName}
            onChange={set("lastName")}
            className={inputCls}
            placeholder="Dela Cruz"
          />
        </Field>
        <Field label="Username" required>
          <input
            type="text"
            value={form.govUsername}
            onChange={set("govUsername")}
            className={inputCls}
            placeholder="juandelacruz"
          />
        </Field>
        <Field label="Email Address" required>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            className={inputCls}
            placeholder="juan@example.com"
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            className={inputCls}
            placeholder="+63 9XX XXX XXXX"
          />
        </Field>
        <Field label="New Password">
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              className={inputCls + " pr-14"}
              placeholder="Insert New Password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
      </div>

      <div className="flex items-center gap-2.5">
        <SaveBtn status={status} onClick={() => trigger()} />
        <button
          type="button"
          onClick={() =>
            setForm({
              firstName: "",
              lastName: "",
              govUsername: "",
              email: "",
              phone: "",
              password: "",
            })
          }
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-(--color-muted) border border-(--color-border) bg-(--color-surface) hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

// ── 2. Notification Settings ──────────────────────────────────────────────────
function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    emailAlerts: false,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    securityAlerts: true,
  });
  const { status, trigger } = useSaveStatus();

  const items: {
    key: keyof typeof prefs;
    label: string;
    desc: string;
    icon: React.ElementType;
  }[] = [
    {
      key: "emailAlerts",
      label: "Email Alerts",
      desc: "Important updates sent to your inbox",
      icon: Bell,
    },
    {
      key: "smsAlerts",
      label: "SMS Alerts",
      desc: "Text messages for urgent notifications",
      icon: Zap,
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      desc: "Real-time browser notifications",
      icon: Monitor,
    },
    {
      key: "weeklyReports",
      label: "Weekly Reports",
      desc: "Activity summary delivered every Sunday",
      icon: Clock,
    },
    {
      key: "securityAlerts",
      label: "Security Alerts",
      desc: "Immediate alerts for suspicious account activity",
      icon: Shield,
    },
  ];

  return (
    <div>
      <SectionTitle
        icon={Bell}
        title="Notifications"
        subtitle="Choose what you want to be notified about"
      />

      <div className="mb-6">
        {items.map(({ key, label, desc, icon: Icon }) => (
          <RowDivider key={key} label={label} description={desc}>
            <Toggle
              checked={prefs[key]}
              onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
            />
          </RowDivider>
        ))}
      </div>

      <SaveBtn status={status} onClick={() => trigger()} />
    </div>
  );
}

// ── 3. Appearance Settings ────────────────────────────────────────────────────
function AppearanceSettings() {
  const { theme, setTheme } = useThemeStore();
  const [density, setDensity] = useState<"comfortable" | "compact">(
    "comfortable",
  );
  const { status, trigger } = useSaveStatus();

  const themes = [
    {
      id: "light" as const,
      label: "Light",
      icon: Sun,
      preview: "bg-[#f7f7f3] border-[#e0e0d8]",
    },
    {
      id: "dark" as const,
      label: "Dark",
      icon: Moon,
      preview: "bg-[#1c1c1a] border-[#303030]",
    },
    {
      id: "system" as const,
      label: "System",
      icon: Monitor,
      preview: "bg-gradient-to-br from-[#f7f7f3] to-[#1c1c1a] border-[#a0a098]",
    },
  ];

  return (
    <div>
      <SectionTitle
        icon={Palette}
        title="Appearance"
        subtitle="Customize how NathRacker looks for you"
      />

      <div className="mb-6">
        <label className={labelCls}>Theme</label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {themes.map(({ id, label, icon: Icon, preview }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={`group relative flex flex-col items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                theme === id
                  ? "border-(--color-ink) bg-(--color-bg)"
                  : "border-(--color-border) hover:border-(--color-border-hover) bg-(--color-surface)"
              }`}
            >
              <div className={`w-full h-12 rounded-lg border ${preview}`} />
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-(--color-muted)" />
                  <span className="text-[12px] font-medium text-(--color-ink)">
                    {label}
                  </span>
                </div>
                {theme === id && (
                  <Check className="w-3.5 h-3.5 text-(--color-ink)" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>


      <SaveBtn
        status={status}
        onClick={() =>
          trigger(async () => {
            await APIFETCH.put("/settings/theme", {
              theme: theme === "dark" ? "DARK" : "LIGHT",
            });
          })
        }
      />
    </div>
  );
}



// ── 4. Security Settings ──────────────────────────────────────────────────────
function SecuritySettings() {
  const [sec, setSec] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });
  const { show } = useToastStore()
  const { status, trigger } = useSaveStatus();

  const sessionTimeoutFormatReversed: { [key: number]: string } = {
  900000: "15",
  1800000: "30",
  3600000: "1",
  7200000: "2",
  10800000: "3",
  14400000: "4",
  31536000000: "never"
};


  const { data: SecurityData } = useQuery({
    queryKey : ["SecurityData"],
    queryFn : async () =>{
      const res = await APIFETCH.get("/settings/security")
      return res.data
    }
  })


  useEffect(() => {
    if (!SecurityData) return;
    setSec({
      twoFactor: SecurityData.twoFactorAuth,
      loginAlerts: SecurityData.loginAlert,
      sessionTimeout: sessionTimeoutFormatReversed[SecurityData.sessionTime]
    });
  }, [SecurityData])

  const handleSave = () =>
    trigger(async () => {
      const res = await APIFETCH.put("/settings/security", {
        sessionTime: sec.sessionTimeout === "never" ? "never" : Number(sec.sessionTimeout) as 15 | 30 | 1 | 2 | 4,
        loginAlert: sec.loginAlerts,
        twoFactorAuth: sec.twoFactor,
      });
      if(res.data.updated){
        show(`${res.data.message}`, "success")
      }else if (!res.data.updated){
        show(`${res.data.message}`, "error")
      }
    });

  return (
    <div>
      <SectionTitle
        icon={Shield}
        title="Security"
        subtitle="Control how your account is protected"
      />

      {!sec.twoFactor && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-100 rounded-xl mb-6">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-semibold text-amber-800">
              Recommendation
            </p>
            <p className="text-[12px] text-amber-700 mt-0.5 leading-relaxed">
              Enable two-factor authentication to significantly improve your
              account security.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <RowDivider
          label="Two-Factor Authentication"
          description="Require a verification code in addition to your password"
        >
          <Toggle
            checked={sec.twoFactor}
            onChange={() => setSec((s) => ({ ...s, twoFactor: !s.twoFactor }))}
          />
        </RowDivider>
        <RowDivider
          label="Login Alerts"
          description="Get notified by email when a new device logs into your account"
        >
          <Toggle
            checked={sec.loginAlerts}
            onChange={() =>
              setSec((s) => ({ ...s, loginAlerts: !s.loginAlerts }))
            }
          />
        </RowDivider>
        <div className="py-4">
          <label className={labelCls}>Session Timeout</label>
          <p className="text-[12px] text-(--color-muted) mb-2">
            Automatically log out after a period of inactivity
          </p>
          <select
            value={sec.sessionTimeout}
            onChange={(e) =>
              setSec((s) => ({ ...s, sessionTimeout: e.target.value }))
            }
            className={inputCls + " max-w-xs"}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <SaveBtn status={status} onClick={handleSave} />
    </div>
  );
}

// ── 5. Language & Region Settings ─────────────────────────────────────────────
function LanguageSettings() {
  const [lang, setLang] = useState("en");
  const [tz, setTz] = useState("Asia/Manila");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const { status, trigger } = useSaveStatus();

  return (
    <div>
      <SectionTitle
        icon={Globe}
        title="Language & Region"
        subtitle="Set your preferred language, timezone, and date format"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Field label="Language">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className={inputCls}
          >
            <option value="en">English</option>
            <option value="fil">Filipino</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </Field>
        <Field label="Timezone">
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className={inputCls}
          >
            <option value="Asia/Manila">Asia/Manila (PHT, UTC+8)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Los_Angeles">
              America/Los_Angeles (PST)
            </option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </Field>
        <Field label="Date Format">
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className={inputCls}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </Field>
      </div>

      <SaveBtn status={status} onClick={() => trigger()} />
    </div>
  );
}

// ── 6. Backup Settings ────────────────────────────────────────────────────────
function BackupSettings() {
  const [freq, setFreq] = useState("weekly");
  const { status, trigger } = useSaveStatus();

  const options = [
    {
      value: "daily",
      label: "Daily",
      desc: "Every day at 2:00 AM",
      badge: "Recommended",
    },
    {
      value: "weekly",
      label: "Weekly",
      desc: "Every Sunday at 2:00 AM",
      badge: null,
    },
    {
      value: "monthly",
      label: "Monthly",
      desc: "First day of each month",
      badge: null,
    },
    {
      value: "manual",
      label: "Manual",
      desc: "Only when you trigger it",
      badge: null,
    },
  ];

  return (
    <div>
      <SectionTitle
        icon={Database}
        title="Backup"
        subtitle="Configure automatic backups of your data"
      />

      <div className="mb-6">
        <label className={labelCls}>Backup Frequency</label>
        <div className="space-y-2 mt-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFreq(opt.value)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                freq === opt.value
                  ? "border-(--color-ink) bg-(--color-bg)"
                  : "border-(--color-border) hover:border-(--color-border-hover) bg-(--color-surface)"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${freq === opt.value ? "border-(--color-ink)" : "border-(--color-border-hover)"}`}
              >
                {freq === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-(--color-ink)" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-(--color-ink)">
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-(--color-muted) mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-(--color-bg) border border-(--color-border) rounded-xl mb-5">
        <p className="text-[12px] font-medium text-(--color-ink) mb-1">
          Last backup
        </p>
        <p className="text-[12px] text-(--color-muted)">
          March 28, 2026 — 2:04 AM · 3 records backed up
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <SaveBtn status={status} onClick={() => trigger()} />
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-(--color-ink) border border-(--color-border) bg-(--color-surface) hover:border-(--color-ink) transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download now
        </button>
      </div>
    </div>
  );
}

// ── 7. Import Settings ────────────────────────────────────────────────────────
type Module = "BUS" | "PCN" | "SWDI" | "CVS" | "MISC";

type FieldMeta = {
  hint: string;
  required: boolean;
  type: "string" | "number" | "date" | "optional-string";
};

const MODULE_SCHEMA: Record<
  Module,
  {
    color: string;
    pillBg: string;
    pillText: string;
    pillBorder: string;
    headerBg: string;
    headerText: string;
    headerBorder: string;
    fields: Record<string, FieldMeta>;
  }
> = {
  BUS: {
    color: "indigo",
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-700",
    pillBorder: "border-indigo-200",
    headerBg: "bg-indigo-50",
    headerText: "text-indigo-800",
    headerBorder: "border-indigo-100",
    fields: {
      LGU: {
        hint: 'Local Government Unit name  e.g. "Quezon City"',
        required: true,
        type: "string",
      },
      BARANGAY: {
        hint: 'Barangay name  e.g. "Batasan Hills"',
        required: true,
        type: "string",
      },
      HHID: {
        hint: 'Household ID  e.g. "HH-2024-0883"',
        required: true,
        type: "string",
      },
      GRANTEE: {
        hint: "Full name of the grantee",
        required: true,
        type: "string",
      },
      'TYPE OF UPDATE': {
        hint: "Type of update being encoded",
        required: true,
        type: "string",
      },
      REMARKS: {
        hint: "General remarks about the record",
        required: true,
        type: "string",
      },
      'UPDATE INFO': {
        hint: "Details about the update",
        required: true,
        type: "string",
      },
      'SUBJECT OF CHANGE': {
        hint: "Who or What is Being Changed",
        required: true,
        type: "string",
      },
      'BDM - NUMBER': {
        hint: "Document Reference Number",
        required: true,
        type: "string",
      },
      'BDM - CITY LINK or SWA': { hint: "Control List identifier", required: true, type: "string" },
      'DATE': {
        hint: "Date of record — format: MM/DD/YYYY",
        required: true,
        type: "date",
      },
      'ISSUES': {
        hint: "Issue description — leave blank if none",
        required: false,
        type: "optional-string",
      },
      'NOTE': {
        hint: "Optional additional note",
        required: false,
        type: "optional-string",
      },
    },
  },
  PCN: {
    color: "rose",
    pillBg: "bg-rose-50",
    pillText: "text-rose-700",
    pillBorder: "border-rose-200",
    headerBg: "bg-rose-50",
    headerText: "text-rose-800",
    headerBorder: "border-rose-100",
    fields: {
      hhId: {
        hint: 'Household ID  e.g. "HH-2024-0883"',
        required: true,
        type: "string",
      },
      granteeName: {
        hint: "Full name of the grantee",
        required: true,
        type: "string",
      },
      lgu: {
        hint: "Local Government Unit — leave blank if unknown",
        required: true,
        type: "string",
      },
      barangay: {
        hint: "Barangay name — leave blank if unknown",
        required: true,
        type: "string",
      },
      remarks: { hint: "General remarks", required: true, type: "string" },
      subjectOfChange: {
        hint: "What is being changed",
        required: true,
        type: "string",
      },
      PCN: {
        hint: "PCN value — leave blank if not applicable (At least one PCN or LRN)",
        required: true,
        type: "string",
      },
      LRN: {
        hint: "LRN value — leave blank if not applicable (At least one PCN or LRN)",
        required: true,
        type: "string",
      },
      drn: {
        hint: "Document Reference Number — leave blank if not applicable",
        required: false,
        type: "optional-string",
      },
      cl: {
        hint: "Control List — leave blank if not applicable",
        required: false,
        type: "optional-string",
      },
      date: {
        hint: "Date of record — format: MM/DD/YYYY",
        required: true,
        type: "date",
      },
      issue: {
        hint: "Issue description — leave blank if none",
        required: false,
        type: "optional-string",
      },
      note: {
        hint: "Optional additional note",
        required: false,
        type: "optional-string",
      },
    },
  },
  SWDI: {
    color: "emerald",
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-700",
    pillBorder: "border-emerald-200",
    headerBg: "bg-emerald-50",
    headerText: "text-emerald-800",
    headerBorder: "border-emerald-100",
    fields: {
      hhId: {
        hint: 'Household ID  e.g. "HH-2024-0883"',
        required: true,
        type: "string",
      },
      lgu: {
        hint: "Local Government Unit name",
        required: true,
        type: "string",
      },
      barangay: { hint: "Barangay name", required: true, type: "string" },
      grantee: {
        hint: "Full name of the grantee",
        required: true,
        type: "string",
      },
      swdiScore: {
        hint: "Numeric SWDI score  e.g. 3.5",
        required: true,
        type: "number",
      },
      swdiLevel: {
        hint: 'SWDI level label  e.g. "Poor"',
        required: true,
        type: "string",
      },
      remarks: { hint: "General remarks", required: true, type: "string" },
      date: {
        hint: "Date of record — format: MM/DD/YYYY",
        required: true,
        type: "date",
      },
      cl: {
        hint: "Control List — leave blank if not applicable",
        required: false,
        type: "optional-string",
      },
      drn: {
        hint: "Document Reference Number — leave blank if not applicable",
        required: false,
        type: "optional-string",
      },
      issue: {
        hint: "Issue description — leave blank if none",
        required: false,
        type: "optional-string",
      },
      note: {
        hint: "Optional additional note",
        required: false,
        type: "optional-string",
      },
    },
  },
  CVS: {
    color: "sky",
    pillBg: "bg-sky-50",
    pillText: "text-sky-700",
    pillBorder: "border-sky-200",
    headerBg: "bg-sky-50",
    headerText: "text-sky-800",
    headerBorder: "border-sky-100",
    fields: {
      idNumber: {
        hint: "ID number of the individual",
        required: true,
        type: "string",
      },
      lgu: {
        hint: "Local Government Unit name",
        required: true,
        type: "string",
      },
      barangay: { hint: "Barangay name", required: true, type: "string" },
      facilityName: {
        hint: "Name of the facility",
        required: true,
        type: "string",
      },
      formType: { hint: "Type of CVS form", required: true, type: "string" },
      remarks: { hint: "General remarks", required: true, type: "string" },
      Period: { hint: "CVS PERIOD", required: true, type: "string" },
      Issue: {
        hint: "Issue Description",
        required: false,
        type: "optional-string",
      },
      date: {
        hint: "Date of record — format: MM/DD/YYYY",
        required: true,
        type: "date",
      },
    },
  },
  MISC: {
    color: "amber",
    pillBg: "bg-amber-50",
    pillText: "text-amber-700",
    pillBorder: "border-amber-200",
    headerBg: "bg-amber-50",
    headerText: "text-amber-800",
    headerBorder: "border-amber-100",
    fields: {
      lgu: {
        hint: "Local Government Unit name",
        required: false,
        type: "optional-string",
      },
      barangay: {
        hint: "Barangay name",
        required: false,
        type: "optional-string",
      },
      hhId: {
        hint: 'Household ID  e.g. "HH-2024-0883"',
        required: true,
        type: "string",
      },
      granteeName: {
        hint: "Full name of the grantee",
        required: true,
        type: "string",
      },
      documentType: {
        hint: 'Type of document  e.g. "Certificate"',
        required: true,
        type: "string",
      },
      remarks: { hint: "General remarks", required: true, type: "string" },
      date: {
        hint: "Date of record — format: MM/DD/YYYY",
        required: true,
        type: "date",
      },
      subjectOfChange: {
        hint: "What is being changed — leave blank if none",
        required: false,
        type: "optional-string",
      },
      drn: {
        hint: "Document Reference Number — leave blank if none",
        required: false,
        type: "optional-string",
      },
      cl: {
        hint: "Control List — leave blank if none",
        required: false,
        type: "optional-string",
      },
      issue: {
        hint: "Issue description — leave blank if none",
        required: false,
        type: "optional-string",
      },
      note: {
        hint: "Optional additional note",
        required: false,
        type: "optional-string",
      },
    },
  },
};

// Active tab button colors
const moduleActiveColors: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-300",
  rose: "bg-rose-50   text-rose-700   border-rose-300",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-300",
  sky: "bg-sky-50    text-sky-700    border-sky-300",
  amber: "bg-amber-50  text-amber-700  border-amber-300",
};

// Type badge styles
const typeBadgeColors: Record<string, string> = {
  string: "bg-blue-50 text-blue-600 border-blue-200",
  number: "bg-violet-50 text-violet-600 border-violet-200",
  date: "bg-orange-50 text-orange-600 border-orange-200",
  "optional-string": "bg-(--color-subtle) text-(--color-muted) border-(--color-border)",
};
const typeLabel: Record<string, string> = {
  string: "text",
  number: "number",
  date: "date",
  "optional-string": "optional",
};

function ImportSettings() {
  const [module, setModule] = useState<Module>("BUS");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setDrag] = useState(false);
  const [showGuide, setGuide] = useState(false);
  const [showErrors, setErrors] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const { status, trigger } = useSaveStatus();
  const { show } = useToastStore();

  const schema = MODULE_SCHEMA[module];
  const fieldEntries = Object.entries(schema.fields);
  const requiredFields = fieldEntries.filter(([, m]) => m.required);
  const optionalFields = fieldEntries.filter(([, m]) => !m.required);

  const importMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const endpoint = `settings/import?module=${module}`;
      const res = await APIFETCH.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      show("Import successful", "success");
      setFile(null);
    },
    onError: (err: any) => {
      const errors: string[] = err?.response?.data?.errors ?? [];
      if (errors.length > 0) {
        setImportErrors(errors);
        setErrors(true);
      }
      show(err?.response?.data?.message ?? "Import failed", "error");
    },
  });

  const handleImport = () => {
    if (!file) return;
    setGuide(true);
  };

  const proceedImport = () => {
    setGuide(false);
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", module);
    trigger(async () => {
      await importMutation.mutateAsync(formData);
    });
  };

  const modules: Module[] = ["BUS", "PCN", "SWDI", "CVS", "MISC"];

  return (
    <div>
      <SectionTitle
        icon={Upload}
        title="Import Data"
        subtitle="Bring your existing records into NathRacker via CSV or XLSX"
      />

      {/* Module tabs */}
      <div className="mb-5">
        <label className={labelCls}>Module</label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {modules.map((m) => {
            const col = MODULE_SCHEMA[m].color;
            const active = module === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setModule(m)}
                className={`font-mono text-[11px] font-semibold py-2.5 rounded-xl border tracking-widest transition-all cursor-pointer ${
                  active
                    ? moduleActiveColors[col]
                    : "bg-(--color-surface) text-[#5a5a52] border-(--color-border) hover:border-(--color-border-hover) hover:text-(--color-ink)"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schema preview — colored pills with tooltip hints */}
      <div
        className={`mb-5 p-4 border rounded-xl ${schema.headerBg} ${schema.headerBorder} border`}
      >
        <div className="flex items-center justify-between mb-3">
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest ${schema.headerText}`}
          >
            Expected columns — hover a field for hint
          </p>
          <span className={`text-[10px] font-medium ${schema.headerText}`}>
            {requiredFields.length} required · {optionalFields.length} optional
          </span>
        </div>

        {/* Required */}
        {requiredFields.length > 0 && (
          <div className="mb-2.5">
            <p className="text-[9px] font-semibold text-(--color-muted) uppercase tracking-widest mb-1.5">
              Required
            </p>
            <div className="flex flex-wrap gap-1.5">
              {requiredFields.map(([f, meta]) => (
                <div key={f} className="relative group">
                  <span
                    className={`font-mono text-[11px] px-2.5 py-1 rounded-md border cursor-default select-none flex items-center gap-1.5 ${schema.pillBg} ${schema.pillText} ${schema.pillBorder}`}
                  >
                    {f}
                    <span
                      className={`text-[9px] font-semibold px-1 py-0.5 rounded border ${typeBadgeColors[meta.type]}`}
                    >
                      {typeLabel[meta.type]}
                    </span>
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 z-10 hidden group-hover:block">
                    <div className="bg-(--color-ink) text-(--color-bg) text-[11px] rounded-lg px-3 py-2 whitespace-nowrap shadow-lg max-w-65 leading-snug">
                      {meta.hint}
                    </div>
                    <div className="w-2 h-2 bg-(--color-ink) rotate-45 ml-3 -mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional */}
        {optionalFields.length > 0 && (
          <div>
            <p className="text-[9px] font-semibold text-(--color-muted) uppercase tracking-widest mb-1.5">
              Optional
            </p>
            <div className="flex flex-wrap gap-1.5">
              {optionalFields.map(([f, meta]) => (
                <div key={f} className="relative group">
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-md border cursor-default select-none flex items-center gap-1.5 bg-(--color-surface) text-(--color-muted) border-(--color-border)">
                    {f}
                    <span
                      className={`text-[9px] font-semibold px-1 py-0.5 rounded border ${typeBadgeColors["optional-string"]}`}
                    >
                      optional
                    </span>
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 z-10 hidden group-hover:block">
                    <div className="bg-(--color-ink) text-(--color-bg) text-[11px] rounded-lg px-3 py-2 whitespace-nowrap shadow-lg max-w-65 leading-snug">
                      {meta.hint}
                    </div>
                    <div className="w-2 h-2 bg-(--color-ink) rotate-45 ml-3 -mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) setFile(f);
        }}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors mb-5 ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-(--color-border) hover:border-(--color-border-hover)"
        }`}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FileUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-medium text-(--color-ink)">
                {file.name}
              </p>
              <p className="text-[12px] text-(--color-muted)">
                {(file.size / 1024).toFixed(1)} KB · {module}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="ml-2 text-(--color-placeholder) hover:text-(--color-muted) cursor-pointer bg-transparent border-none"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-11 h-11 bg-(--color-surface) border border-(--color-border) rounded-xl flex items-center justify-center mb-3">
              <Upload className="w-4 h-4 text-(--color-muted)" />
            </div>
            <p className="text-[13px] font-medium text-(--color-ink) mb-1">
              Drop your file here
            </p>
            <p className="text-[12px] text-(--color-muted) mb-3">
              .csv or .xlsx — max 10 MB
            </p>
            <label className="px-4 py-2 rounded-lg text-[12px] font-medium bg-(--color-surface) text-(--color-ink) border border-(--color-border) hover:border-(--color-ink) transition-colors cursor-pointer">
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

      <button
        type="button"
        onClick={handleImport}
        disabled={!file || status === "saving"}
        className="w-full py-2.5 rounded-xl text-[13px] font-medium bg-(--color-ink) text-(--color-bg) hover:opacity-85 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "saving"
          ? "Importing…"
          : status === "saved"
            ? "✓ Import complete"
            : "Confirm import →"}
      </button>

      {/* Guide modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-2xl shadow-2xl w-full max-w-150 max-h-[85vh] overflow-y-auto border border-(--color-border)">
            <div
              className={`px-6 py-5 border-b flex items-center justify-between ${schema.headerBg} ${schema.headerBorder} rounded-t-2xl`}
            >
              <div>
                <h3
                  className={`text-[14px] font-semibold ${schema.headerText}`}
                >
                  Import Format — {module}
                </h3>
                <p className="text-[12px] text-(--color-muted) mt-0.5">
                  Verify your file matches this structure before proceeding
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGuide(false)}
                className="text-(--color-muted) hover:text-(--color-ink) cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Header row */}
              <div>
                <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-widest mb-2">
                  Required headers (exact, in order)
                </p>
                <div className="bg-(--color-subtle) rounded-lg p-3 overflow-x-auto">
                  <code className="text-[12px] font-mono text-(--color-ink) whitespace-nowrap">
                    {Object.keys(schema.fields).join(", ")}
                  </code>
                </div>
              </div>

              {/* Required fields table */}
              <div>
                <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-widest mb-2">
                  Required fields
                </p>
                <div className="border border-(--color-border) rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[140px_60px_1fr] gap-0 px-4 py-2 bg-(--color-bg) border-b border-(--color-border)">
                    <span className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider">
                      Column
                    </span>
                    <span className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider">
                      Type
                    </span>
                    <span className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider">
                      Hint
                    </span>
                  </div>
                  {requiredFields.map(([f, meta]) => (
                    <div
                      key={f}
                      className="grid grid-cols-[140px_60px_1fr] gap-0 px-4 py-2.5 border-b border-(--color-subtle) last:border-none items-start"
                    >
                      <code
                        className={`text-[11px] font-mono font-semibold ${schema.pillText}`}
                      >
                        {f}
                      </code>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border w-fit ${typeBadgeColors[meta.type]}`}
                      >
                        {typeLabel[meta.type]}
                      </span>
                      <span className="text-[12px] text-[#5a5a52] leading-snug">
                        {meta.hint}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional fields table */}
              {optionalFields.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-(--color-muted) uppercase tracking-widest mb-2">
                    Optional fields
                  </p>
                  <div className="border border-(--color-border) rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[140px_60px_1fr] gap-0 px-4 py-2 bg-(--color-bg) border-b border-(--color-border)">
                      <span className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider">
                        Column
                      </span>
                      <span className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider">
                        Type
                      </span>
                      <span className="text-[10px] font-semibold text-(--color-muted) uppercase tracking-wider">
                        Hint
                      </span>
                    </div>
                    {optionalFields.map(([f, meta]) => (
                      <div
                        key={f}
                        className="grid grid-cols-[140px_60px_1fr] gap-0 px-4 py-2.5 border-b border-(--color-subtle) last:border-none items-start"
                      >
                        <code className="text-[11px] font-mono text-(--color-muted)">
                          {f}
                        </code>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border w-fit ${typeBadgeColors["optional-string"]}`}
                        >
                          optional
                        </span>
                        <span className="text-[12px] text-(--color-muted) leading-snug">
                          {meta.hint}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-[11px] font-semibold text-amber-800 mb-1">
                  Before you proceed
                </p>
                <ul className="text-[12px] text-amber-700 space-y-0.5">
                  <li>
                    • Headers are case-sensitive — match exactly as shown above
                  </li>
                  <li>
                    • Leave optional fields blank, do not write "N/A" or "-"
                  </li>
                  <li>• Dates must be in MM/DD/YYYY format</li>
                  <li>• Numeric fields must contain numbers only</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-(--color-border) flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setGuide(false)}
                className="px-4 py-2 text-[13px] font-medium text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedImport}
                className="px-4 py-2 text-[13px] font-medium bg-(--color-ink) text-(--color-bg) rounded-lg hover:opacity-85 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" /> I understand, proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error modal */}
      {showErrors && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-2xl shadow-2xl w-full max-w-sm border border-(--color-border)">
            <div className="px-6 py-5 border-b border-(--color-border) flex items-center gap-3">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-(--color-ink)">
                  Import failed
                </h4>
                <p className="text-[12px] text-(--color-muted)">
                  {importErrors.length} error
                  {importErrors.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            <ul className="px-6 py-4 space-y-2 max-h-48 overflow-y-auto">
              {importErrors.map((err, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span className="text-[12px] text-(--color-ink)">{err}</span>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 border-t border-(--color-border) flex justify-end">
              <button
                type="button"
                onClick={() => setErrors(false)}
                className="px-4 py-2 text-[13px] font-medium text-(--color-muted) border border-(--color-border) rounded-lg hover:border-(--color-ink) hover:text-(--color-ink) transition-colors cursor-pointer"
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

// ── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "general", label: "General", icon: User, component: GeneralSettings },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    component: NotificationSettings,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    component: AppearanceSettings,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    component: SecuritySettings,
  },
  // {
  //   id: "language",
  //   label: "Language",
  //   icon: Globe,
  //   component: LanguageSettings,
  // },
  // { id: "backup", label: "Backup", icon: Database, component: BackupSettings },
  {
    id: "import",
    label: "Import Data",
    icon: Upload,
    component: ImportSettings,
  },
] as const;

// ── Main shell ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("general");

  const ActiveComponent = TABS.find((t) => t.id === activeTab)!.component;

  return (
    <main className="p-6 h-full max-h-screen overflow-y-auto bg-(--color-bg) font-sans antialiased">
      <div className="h-full max-w-full mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-(--color-subtle) flex items-center justify-center">
            <Settings className="w-4 h-4 text-(--color-muted)" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold tracking-tight text-(--color-ink)">
              Settings
            </h1>
            <ChevronRight className="w-3.5 h-3.5 text-(--color-placeholder)" />
            <span className="text-[13px] text-(--color-muted)">
              {TABS.find((t) => t.id === activeTab)!.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="bg-(--color-surface) border border-(--color-border) rounded-xl flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-52 border-r border-(--color-border) shrink-0 bg-(--color-bg) py-3 px-2.5">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = id === activeTab;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left mb-0.5 ${
                    active
                      ? "bg-(--color-ink) text-(--color-bg)"
                      : "text-[#5a5a52] hover:text-(--color-ink) hover:bg-(--color-surface)"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </main>
  );
}
