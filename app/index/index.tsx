import { useEffect, useRef } from "react";

const modules = [
  {
    tag: "BUS",
    tagClass: "bg-indigo-50 text-indigo-600",
    title: "Beneficiary Updates",
    desc: "Track household grantee changes, DRN references, control lists, and update history per LGU and barangay.",
  },
  {
    tag: "PCN",
    tagClass: "bg-rose-50 text-rose-600",
    title: "Pending Change Notif.",
    desc: "Log PCN records for household members with full subject-of-change tracking and compliance references.",
  },
  {
    tag: "CVS",
    tagClass: "bg-violet-50 text-violet-600",
    title: "CVS Monitoring",
    desc: "Record facility-level CVS form submissions per LGU and barangay with remarks and completion tracking.",
  },
  {
    tag: "SWDI",
    tagClass: "bg-emerald-50 text-emerald-600",
    title: "Social Welfare Scores",
    desc: "Record and monitor SWDI scores and level classifications per household with encoder attribution.",
  },
  {
    tag: "MISC",
    tagClass: "bg-amber-50 text-amber-600",
    title: "Miscellaneous",
    desc: "A flexible catch-all module for any record type that falls outside the standard categories.",
  },
];

const stats = [
  { num: "6", label: "Data modules" },
  { num: "4", label: "Role levels" },
  { num: "∞", label: "Records tracked" },
  { num: "100%", label: "Audit trail" },
];

const features = [
  {
    num: "01",
    title: "Role-based access",
    desc: "Encoders focus on data entry. Admins get full oversight. Each role sees exactly what it needs.",
  },
  {
    num: "02",
    title: "HH ID search across all modules",
    desc: "Look up a single household ID and pull its complete history from BUS, PCN, CVS, SWDI, and Misc at once.",
  },
  {
    num: "03",
    title: "Full encoder attribution",
    desc: "Every record is linked to its encoder by both user ID and government username — nothing is anonymous.",
  },
  {
    num: "04",
    title: "Timestamps on everything",
    desc: "Automatic createdAt and updatedAt on every record so you always know when data was last touched.",
  },
  {
    num: "05",
    title: "Filter by LGU, barangay, date, encoder",
    desc: "Drill into exactly the slice of data you need without sifting through unrelated records.",
  },
  {
    num: "06",
    title: "Personalized user profiles",
    desc: "Session control, timezone, 2FA, alert preferences, and theme settings for every account.",
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
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a18] font-sans antialiased">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#fafaf8]/90 backdrop-blur-md border-b border-[#e8e8e0] h-15 flex items-center justify-between px-10">
        <a
          href="#"
          className="flex items-center gap-2 text-[17px] font-semibold tracking-tight no-underline text-[#1a1a18]"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse" />
          NathRacker
        </a>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#8a8a80] hover:bg-[#e8e8e0] hover:text-[#1a1a18] transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a18] text-white hover:bg-[#333] transition-colors cursor-pointer"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-180 mx-auto px-10 pt-24 pb-20 text-center animate-[fadeUp_0.5s_ease_both]">
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          Encoding Tracking System
        </div>
        <h1 className="text-[clamp(40px,7vw,64px)] font-semibold tracking-[-0.04em] leading-[1.08] text-[#1a1a18] mb-6">
          All your encoded
          <br />
          records,{" "}
          <em className="not-italic font-light text-[#8a8a80]">
            in one place.
          </em>
        </h1>
        <p className="text-[18px] text-[#8a8a80] leading-[1.65] max-w-120 mx-auto mb-10 font-normal">
          NathRacker tracks every BUS, PCN, CVS, SWDI, and Miscellaneous record
          you encode — organized, searchable, and always up to date.
        </p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-7 py-3 rounded-[10px] text-[15px] font-medium bg-[#1a1a18] text-white hover:bg-[#333] transition-colors cursor-pointer"
          >
            Start tracking →
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-7 py-3 rounded-[10px] text-[15px] font-medium bg-transparent text-[#1a1a18] border border-[#e8e8e0] hover:border-[#1a1a18] transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </section>

      {/* MODULES */}
      <div
        ref={addReveal}
        className="max-w-250 mx-auto px-10 py-14 opacity-0 translate-y-5 transition-all duration-700"
      >
        {/* Standard modules grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
          {modules.map((m) => (
            <div
              key={m.tag}
              className="bg-white border border-[#e8e8e0] rounded-xl p-6 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-200"
            >
              <span
                className={`inline-block font-mono text-[10px] font-medium px-2 py-1 rounded-[5px] mb-4 tracking-[0.05em] ${m.tagClass}`}
              >
                {m.tag}
              </span>
              <h3 className="text-[15px] font-semibold tracking-tight text-[#1a1a18] mb-1.5">
                {m.title}
              </h3>
              <p className="text-[13px] text-[#8a8a80] leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Verifications module — full width, under development */}
        <div className="relative bg-white border border-dashed border-[#c8c8c0] rounded-xl p-6 overflow-hidden group">
          {/* Subtle diagonal stripe background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #1a1a18 0, #1a1a18 1px, transparent 0, transparent 50%)",
              backgroundSize: "10px 10px",
            }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center gap-4">
            {/* Left: tag + title + desc */}
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-block font-mono text-[10px] font-medium px-2 py-1 rounded-[5px] tracking-[0.05em] bg-sky-50 text-sky-600">
                  VER
                </span> 
                {/* Under development badge */}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Under Development
                </span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight text-[#1a1a18] mb-1.5">
                Verifications
              </h3>
              <p className="text-[13px] text-[#8a8a80] leading-relaxed max-w-160">
                Centralized verification tracking for BUS and
                CVS records. Admins can mark records as verified,
                log the verifier's name, and audit the full verification trail
                across all modules — coming soon.
              </p>
            </div>

            {/* Right: upcoming features preview */}
            <div className="shrink-0 flex flex-col gap-2 md:items-end">
              {[
                "Verify by record ID or HH ID",
                "verifiedBy + verified status fields",
                "Cross-module verification dashboard",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 opacity-50"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span className="text-[12.5px] text-[#8a8a80]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div
        ref={addReveal}
        className="border-t border-b border-[#e8e8e0] bg-white opacity-0 translate-y-5 transition-all duration-700"
      >
        <div className="max-w-250 mx-auto px-10 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-10 pl-8 ${i === 0 ? "pl-0" : ""} ${i < stats.length - 1 ? "border-r border-[#e8e8e0]" : ""}`}
            >
              <div className="text-[36px] font-semibold tracking-[-0.04em] text-[#1a1a18] leading-none mb-1.5">
                {s.num}
              </div>
              <div className="text-[13px] text-[#8a8a80]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* IMPORT FEATURE */}
      <section
        ref={addReveal}
        className="max-w-250 mx-auto px-10 py-20 opacity-0 translate-y-5 transition-all duration-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 items-center">
          {/* Left — text */}
          <div>
            <h2 className="text-[32px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#1a1a18] mb-4">
              Import your existing
              <br />
              <em className="not-italic font-light text-[#8a8a80]">
                tracked data.
              </em>
            </h2>
            <p className="text-[15px] text-[#8a8a80] leading-[1.7] mb-6">
              Already have records in a spreadsheet? Upload a{" "}
              <span className="font-mono text-[13px] bg-[#f0f0ec] text-[#1a1a18] px-1.5 py-0.5 rounded">
                .csv
              </span>{" "}
              or{" "}
              <span className="font-mono text-[13px] bg-[#f0f0ec] text-[#1a1a18] px-1.5 py-0.5 rounded">
                .xlsx
              </span>{" "}
              file and bring your BUS, PCN, CVS, SWDI, or Miscellaneous data
              straight into NathRacker — no manual re-entry needed.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Supports .csv and .xlsx formats",
                "Maps columns to module fields automatically",
                "Validates HH IDs and flags errors before import",
                "Preview records before confirming",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a18] shrink-0" />
                  <span className="text-[13.5px] text-[#8a8a80]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — upload card mockup */}
          <div className="bg-white border border-[#e8e8e0] rounded-2xl p-8">
            {/* Module selector */}
            <div className="mb-5">
              <p className="text-[12px] font-medium text-[#8a8a80] mb-2 uppercase tracking-wider">
                Select module
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[
                  {
                    tag: "BUS",
                    active: true,
                    cls: "bg-indigo-50 text-indigo-600 border-indigo-200",
                  },
                  {
                    tag: "PCN",
                    active: false,
                    cls: "bg-white text-[#8a8a80] border-[#e8e8e0]",
                  },
                  {
                    tag: "CVS",
                    active: false,
                    cls: "bg-white text-[#8a8a80] border-[#e8e8e0]",
                  },
                  {
                    tag: "SWDI",
                    active: false,
                    cls: "bg-white text-[#8a8a80] border-[#e8e8e0]",
                  },
                  {
                    tag: "MISC",
                    active: false,
                    cls: "bg-white text-[#8a8a80] border-[#e8e8e0]",
                  },
                ].map((m) => (
                  <button
                    key={m.tag}
                    className={`font-mono text-[11px] font-medium py-2 rounded-lg border tracking-wider transition-colors cursor-pointer ${m.cls}`}
                  >
                    {m.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div className="border-2 border-dashed border-[#e8e8e0] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#c8c8c0] transition-colors mb-5">
              <div className="w-10 h-10 bg-[#f5f5f2] rounded-xl flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-[#8a8a80]"
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
              <p className="text-[13px] font-medium text-[#1a1a18] mb-1">
                Drop your file here
              </p>
              <p className="text-[12px] text-[#8a8a80] mb-3">
                .csv or .xlsx — max 10MB
              </p>
              <button className="px-4 py-2 rounded-lg text-[12px] font-medium bg-[#f5f5f2] text-[#1a1a18] hover:bg-[#e8e8e0] transition-colors cursor-pointer border border-[#e8e8e0]">
                Browse file
              </button>
            </div>

            {/* Preview rows (static mockup) */}
            <div className="border border-[#e8e8e0] rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-[#f5f5f2] border-b border-[#e8e8e0]">
                {["HH ID", "Grantee Name", "Status"].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-medium text-[#8a8a80] uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {[
                ["HH-2024-0883", "Juan Dela Cruz", "Ready"],
                ["HH-2024-1120", "Maria Santos", "Ready"],
                ["HH-2024-0771", "Pedro Reyes", "Warning"],
              ].map(([id, name, status]) => (
                <div
                  key={id}
                  className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-[#e8e8e0] last:border-none"
                >
                  <span className="text-[12px] font-mono text-[#1a1a18]">
                    {id}
                  </span>
                  <span className="text-[12px] text-[#1a1a18]">{name}</span>
                  <span
                    className={`text-[11px] font-medium ${status === "Ready" ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {status === "Ready" ? "✓ Ready" : "⚠ Warning"}
                  </span>
                </div>
              ))}
            </div>

            {/* Confirm button */}
            <button className="w-full mt-4 py-2.5 rounded-lg text-[13px] font-medium bg-[#1a1a18] text-white hover:bg-[#333] transition-colors cursor-pointer">
              Confirm import →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        ref={addReveal}
        className="max-w-250 mx-auto px-10 py-20 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-20 items-start opacity-0 translate-y-5 transition-all duration-700"
      >
        <div>
          <h2 className="text-[32px] font-semibold tracking-[-0.03em] leading-[1.2] text-[#1a1a18] mb-3.5">
            Everything you need to stay on top of encoding.
          </h2>
          <p className="text-[15px] text-[#8a8a80] leading-[1.7]">
            Designed around how field encoders actually work — fast entry, clear
            filters, and full visibility for admins.
          </p>
        </div>
        <div className="flex flex-col">
          {features.map((f, i) => (
            <div
              key={f.num}
              className={`flex gap-4 py-5.5 ${i < features.length - 1 ? "border-b border-[#e8e8e0]" : ""} ${i === 0 ? "pt-0" : ""}`}
            >
              <span className="font-mono text-[11px] text-[#e8e8e0] pt-1 min-w-6">
                {f.num}
              </span>
              <div>
                <h4 className="text-[15px] font-semibold text-[#1a1a18] mb-1 tracking-tight">
                  {f.title}
                </h4>
                <p className="text-[13.5px] text-[#8a8a80] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-250 mx-auto h-px bg-[#e8e8e0]" />

      {/* CTA */}
      <section
        ref={addReveal}
        className="max-w-250 mx-auto px-10 py-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 opacity-0 translate-y-5 transition-all duration-700"
      >
        <h2 className="text-[clamp(28px,4vw,42px)] font-semibold tracking-[-0.03em] leading-[1.15] text-[#1a1a18] max-w-100">
          Ready to track your{" "}
          <em className="not-italic font-light text-[#8a8a80]">
            encoded records?
          </em>
        </h2>
        <div className="flex flex-col gap-2.5 items-start shrink-0">
          <p className="text-[14px] text-[#8a8a80]">
            Free to use. No setup required.
          </p>
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-7 py-3 rounded-lg text-[15px] font-medium bg-[#1a1a18] text-white hover:bg-[#333] transition-colors cursor-pointer"
          >
            Create an account →
          </button>
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-[14px] text-[#8a8a80] hover:text-[#1a1a18] transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Already have one? Sign in
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e8e8e0] px-10 py-7 max-w-250 mx-auto flex flex-col md:flex-zZrow justify-between items-center gap-4">
        <p className="text-[13px] text-[#8a8a80]">© 2026 NathRacker</p>
        <div className="flex gap-5">
          <a
            href="/login"
            className="text-[13px] text-[#8a8a80] hover:text-[#1a1a18] transition-colors no-underline"
          >
            Login
          </a>
          <a
            href="/register"
            className="text-[13px] text-[#8a8a80] hover:text-[#1a1a18] transition-colors no-underline"
          >
            Register
          </a>
        </div>
      </footer>

      {/* Keyframe for hero animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}