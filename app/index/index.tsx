import { useEffect, useRef } from "react";

const capabilities = [
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconBg: "bg-blue-50",
    title: "Record Tracking",
    desc: "Log and manage records of any type with structured fields, statuses, and full history per entry.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    iconBg: "bg-rose-50",
    title: "Instant Search",
    desc: "Look up any record by ID, name, date, or status in seconds — across all modules at once.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    iconBg: "bg-violet-50",
    title: "Team Access",
    desc: "Role-based permissions so each team member sees exactly what they need — nothing more.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    iconBg: "bg-emerald-50",
    title: "Verification",
    desc: "Mark records as verified with a named verifier and timestamp — full accountability on every entry.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    ),
    iconBg: "bg-amber-50",
    title: "Import Data",
    desc: "Upload .csv or .xlsx files to bring existing records straight in — no manual re-entry needed.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    iconBg: "bg-sky-50",
    title: "Reports & Summaries",
    desc: "Get a clear breakdown of your records by category, status, date, or team member at any time.",
  },
];

const stats = [
  { num: "6", label: "Record modules" },
  { num: "4", label: "Role levels" },
  { num: "∞", label: "Records tracked" },
  { num: "100%", label: "Audit trail" },
];

const features = [
  {
    num: "01",
    title: "Role-based access",
    desc: "Each user sees exactly what their role allows. Staff log records; managers get full oversight.",
  },
  {
    num: "02",
    title: "Cross-module search",
    desc: "Look up a single ID and pull its complete history across every module at once.",
  },
  {
    num: "03",
    title: "Full attribution on every record",
    desc: "Every entry is linked to the person who created it — nothing is anonymous.",
  },
  {
    num: "04",
    title: "Timestamps on everything",
    desc: "Automatic createdAt and updatedAt on every record so you always know when data was last touched.",
  },
  {
    num: "05",
    title: "Flexible filters",
    desc: "Drill into exactly the slice of data you need — by location, date, status, or team member.",
  },
  {
    num: "06",
    title: "Personalized user profiles",
    desc: "Session control, preferences, and alert settings for every account on the platform.",
  },
];

export default function IndexPage() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-5");
          }
        });
      },
      { threshold: 0.08 },
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-ink) font-sans antialiased">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-(--color-bg)/90 backdrop-blur-md border-b border-(--color-border) h-15 flex items-center justify-between px-6 sm:px-10">
        <a
          href="#"
          className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight no-underline text-(--color-ink)"
        >
          <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-10 h-10" />
          NathRacker
        </a>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-(--color-muted) hover:bg-(--color-border) hover:text-(--color-ink) transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-(--color-ink) text-(--color-bg) hover:opacity-85 transition-colors cursor-pointer"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-180 mx-auto px-6 sm:px-10 pt-24 pb-20 text-center animate-[fadeUp_0.5s_ease_both]">
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          Record Management System
        </div>
        <h1 className="text-[clamp(36px,7vw,64px)] font-semibold tracking-[-0.04em] leading-[1.08] text-(--color-ink) mb-6">
          Track and manage
          <br />
          your records,{" "}
          <em className="not-italic font-light text-(--color-muted)">
            all in one place.
          </em>
        </h1>
        <p className="text-[18px] text-(--color-muted) leading-[1.65] max-w-120 mx-auto mb-10 font-normal">
          NathRacker gives your team a single platform to log, search, verify,
          and manage records — organized, auditable, and always up to date.
        </p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-7 py-3 rounded-[10px] text-[15px] font-medium bg-(--color-ink) text-(--color-bg) hover:opacity-85 transition-colors cursor-pointer"
          >
            Get started →
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-7 py-3 rounded-[10px] text-[15px] font-medium bg-transparent text-(--color-ink) border border-(--color-border) hover:border-(--color-ink) transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </section>

      {/* CAPABILITIES GRID */}
      <div
        ref={addReveal}
        className="max-w-250 mx-auto px-6 sm:px-10 py-14 opacity-0 translate-y-5 transition-all duration-700"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-200"
            >
              <div className={`w-9 h-9 ${c.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                {c.icon}
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight text-(--color-ink) mb-1.5">
                {c.title}
              </h3>
              <p className="text-[13px] text-(--color-muted) leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div
        ref={addReveal}
        className="border-t border-b border-(--color-border) bg-(--color-surface) opacity-0 translate-y-5 transition-all duration-700"
      >
        <div className="max-w-250 mx-auto px-6 sm:px-10 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-10 ${i === 0 ? "pl-0" : "pl-8"} ${i < stats.length - 1 ? "border-r border-(--color-border)" : ""}`}
            >
              <div className="text-[36px] font-semibold tracking-[-0.04em] text-(--color-ink) leading-none mb-1.5">
                {s.num}
              </div>
              <div className="text-[13px] text-(--color-muted)">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* IMPORT FEATURE */}
      <section
        ref={addReveal}
        className="max-w-250 mx-auto px-6 sm:px-10 py-20 opacity-0 translate-y-5 transition-all duration-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 items-center">
          {/* Left — text */}
          <div>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em] leading-[1.2] text-(--color-ink) mb-4">
              Import your existing
              <br />
              <em className="not-italic font-light text-(--color-muted)">
                records instantly.
              </em>
            </h2>
            <p className="text-[15px] text-(--color-muted) leading-[1.7] mb-6">
              Already have data in a spreadsheet? Upload a{" "}
              <span className="font-mono text-[13px] bg-[#f0f0ec] text-(--color-ink) px-1.5 py-0.5 rounded">
                .csv
              </span>{" "}
              or{" "}
              <span className="font-mono text-[13px] bg-[#f0f0ec] text-(--color-ink) px-1.5 py-0.5 rounded">
                .xlsx
              </span>{" "}
              file and bring your records straight into NathRacker — no
              manual re-entry needed.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Supports .csv and .xlsx formats",
                "Maps columns to record fields automatically",
                "Validates IDs and flags errors before import",
                "Preview all rows before confirming",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-(--color-ink) shrink-0" />
                  <span className="text-[13.5px] text-(--color-muted)">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — upload card mockup */}
          <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl p-8">
            {/* Drop zone */}
            <div className="border-2 border-dashed border-(--color-border) rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-(--color-border-hover) transition-colors mb-5">
              <div className="w-10 h-10 bg-(--color-subtle) rounded-xl flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-(--color-muted)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>
              <p className="text-[13px] font-medium text-(--color-ink) mb-1">
                Drop your file here
              </p>
              <p className="text-[12px] text-(--color-muted) mb-3">
                .csv or .xlsx — max 10MB
              </p>
              <button className="px-4 py-2 rounded-lg text-[12px] font-medium bg-(--color-subtle) text-(--color-ink) hover:bg-(--color-border) transition-colors cursor-pointer border border-(--color-border)">
                Browse file
              </button>
            </div>

            {/* Preview rows (static mockup) */}
            <div className="border border-(--color-border) rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-(--color-subtle) border-b border-(--color-border)">
                {["Record ID", "Name", "Status"].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-medium text-(--color-muted) uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {[
                ["REC-2024-0883", "Juan Dela Cruz", "Ready"],
                ["REC-2024-1120", "Maria Santos", "Ready"],
                ["REC-2024-0771", "Pedro Reyes", "Warning"],
              ].map(([id, name, status]) => (
                <div
                  key={id}
                  className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-(--color-border) last:border-none"
                >
                  <span className="text-[12px] font-mono text-(--color-ink)">
                    {id}
                  </span>
                  <span className="text-[12px] text-(--color-ink)">{name}</span>
                  <span
                    className={`text-[11px] font-medium ${status === "Ready" ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {status === "Ready" ? "✓ Ready" : "⚠ Warning"}
                  </span>
                </div>
              ))}
            </div>

            {/* Confirm button */}
            <button className="w-full mt-4 py-2.5 rounded-lg text-[13px] font-medium bg-(--color-ink) text-(--color-bg) hover:opacity-85 transition-colors cursor-pointer">
              Confirm import →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={addReveal}
        className="max-w-250 mx-auto px-6 sm:px-10 py-20 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-20 items-start opacity-0 translate-y-5 transition-all duration-700"
      >
        <div>
          <h2 className="text-[32px] font-semibold tracking-[-0.03em] leading-[1.2] text-(--color-ink) mb-3.5">
            Everything you need to stay on top of your records.
          </h2>
          <p className="text-[15px] text-(--color-muted) leading-[1.7]">
            Designed around how teams actually work — fast entry, clear
            filters, and full visibility for everyone who needs it.
          </p>
        </div>
        <div className="flex flex-col">
          {features.map((f, i) => (
            <div
              key={f.num}
              className={`flex gap-4 py-5.5 ${i < features.length - 1 ? "border-b border-(--color-border)" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <span className="font-mono text-[11px] text-(--color-border) pt-1 min-w-6">
                {f.num}
              </span>
              <div>
                <h4 className="text-[15px] font-semibold text-(--color-ink) mb-1 tracking-tight">
                  {f.title}
                </h4>
                <p className="text-[13.5px] text-(--color-muted) leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-250 mx-auto h-px bg-(--color-border)" />

      {/* CTA */}
      <section
        ref={addReveal}
        className="max-w-250 mx-auto px-6 sm:px-10 py-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 opacity-0 translate-y-5 transition-all duration-700"
      >
        <h2 className="text-[clamp(28px,4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.15] text-(--color-ink) max-w-100">
          Ready to take control of{" "}
          <em className="not-italic font-light text-(--color-muted)">
            your records?
          </em>
        </h2>
        <div className="flex flex-col gap-2.5 items-start shrink-0">
          <p className="text-[14px] text-(--color-muted)">
            No setup required.
          </p>
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-7 py-3 rounded-lg text-[15px] font-medium bg-(--color-ink) text-(--color-bg) hover:opacity-85 transition-colors cursor-pointer"
          >
            Contact the admin →
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-[14px] text-(--color-muted) hover:text-(--color-ink) transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Already have one? Sign in
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-(--color-border) px-6 sm:px-10 py-7 max-w-250 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-7 h-7" />
          <p className="text-[13px] text-(--color-muted)">© 2026 NathRacker</p>
        </div>
  
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
