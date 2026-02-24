import { useState } from "react";
import { redirect } from "react-router";
import OfficePic from "./office.jpg";

export function Register() {
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    govUsername: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        setRegisterSuccess(true);
        setTimeout(() => {
          redirect("/login");
        }, 4000);
      } else {
        console.error("Registration failed");
      }
    } catch (err) {
      console.error("Network error during registration", err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "block w-full px-4 py-3 border border-[#e8e8e0] rounded-lg text-[14px] text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors";

  const labelClass = "block text-[13px] font-medium text-[#1a1a18] mb-1.5";

  return (
    <main className="flex min-h-screen bg-[#fafaf8] font-sans antialiased">

      {/* Left panel — form */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-8 lg:px-20 py-16 bg-[#fafaf8] relative">

        {/* Back home */}
        <a
          href="/"
          className="absolute top-6 left-8 lg:left-20 flex items-center gap-1.5 text-[13px] text-[#8a8a80] hover:text-[#1a1a18] no-underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </a>

        <div className="max-w-[440px] w-full mx-auto">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            <span className="text-[#1a1a18] text-[17px] font-semibold tracking-tight">NathRacker</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1a1a18] mb-2">
              Create an account
            </h1>
            <p className="text-[14px] text-[#8a8a80]">
              Join NathRacker to start tracking your encoded records.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Name row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass}>First Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={set("firstName")}
                  required
                />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Last Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={set("lastName")}
                  required
                />
              </div>
            </div>

            {/* Gov username */}
            <div>
              <label className={labelClass}>Government Username</label>
              <input
                type="text"
                name="username"
                className={inputClass}
                placeholder="Enter your PPIS username"
                value={formData.govUsername}
                onChange={set("govUsername")}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                className={inputClass}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={set("phone")}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                className={inputClass}
                placeholder="email@example.com"
                value={formData.email}
                onChange={set("email")}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={inputClass + " pr-16"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={set("password")}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[12px] font-medium text-[#8a8a80] hover:text-[#1a1a18] transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#e8e8e0] text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                required
              />
              <span className="text-[13px] text-[#8a8a80] leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-[#1a1a18] font-medium hover:underline no-underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#1a1a18] font-medium hover:underline no-underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg text-[14px] font-medium text-white bg-[#1a1a18] hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-8 pt-6 border-t border-[#e8e8e0] text-center">
            <p className="text-[13px] text-[#8a8a80]">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#1a1a18] font-medium hover:underline no-underline transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — image side */}
      <div className="hidden md:flex md:w-[45%] h-screen sticky top-0 flex-col relative overflow-hidden bg-[#1a1a18]">
        <img
          src={OfficePic}
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a18]/40 via-transparent to-[#1a1a18]/80" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span className="text-white text-[17px] font-semibold tracking-tight">NathRacker</span>
          </a>

          {/* Bottom content */}
          <div>
            <p className="text-white/40 text-[11px] font-mono tracking-widest uppercase mb-4">
              Encoding Tracking System
            </p>
            <h2 className="text-white text-[32px] font-semibold tracking-tight leading-[1.2] mb-4">
              Start tracking<br />
              <span className="font-light text-white/60 italic">from day one.</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-[320px]">
              One account gives you access to all four modules — BUS, PCN, SWDI, and Miscellaneous — with full audit trails and role-based access.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {[
                "Full encoder attribution on every record",
                "HH ID search across all modules",
                "Role-based access for encoders & admins",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-[13px] text-white/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {registerSuccess && (
        <div className="fixed bottom-6 left-6 flex items-center gap-2.5 bg-[#1a1a18] text-white px-4 py-3 rounded-lg shadow-lg text-[13px] font-medium z-50 animate-[fadeUp_0.3s_ease_both]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Registered successfully! Redirecting…
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}