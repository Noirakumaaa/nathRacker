import APIFETCH from 'lib/axios/axiosConfig';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { LoginInput, LoginResponse } from '~/types/authTypes';
import { useToastStore } from 'lib/zustand/ToastStore';
import { useNavigate } from 'react-router';

export function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { show } = useToastStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await APIFETCH.post<LoginResponse>('/auth/login', formData);
      queryClient.setQueryData(['me'], res.data);
      show(`${res.data.message}`, 'success');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Invalid email or password';
      setErrorMessage(message);
      show(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const highlights = [
    {
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Centralized records',
      desc: 'All your data in one place — no spreadsheets, no scattered files.',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Instant search',
      desc: 'Find any record by ID, name, date, or status in seconds.',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Role-based access',
      desc: 'Every user sees exactly what they need — nothing more.',
    },
    {
      icon: (
        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Full audit trail',
      desc: 'Every change is timestamped and attributed — nothing is anonymous.',
    },
  ];

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-ink) font-sans antialiased flex flex-col">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-(--color-bg)/90 backdrop-blur-md border-b border-(--color-border) h-14 sm:h-15 flex items-center justify-between px-5 sm:px-10">
        <a
          href="/"
          className="flex items-center gap-2.5 text-[16px] sm:text-[17px] font-semibold tracking-tight no-underline text-(--color-ink)"
        >
          <img src="/nathracker_icon_v9.svg" alt="NathRacker" className="w-10 h-10" />
          NathRacker
        </a>
        <a
          href="/"
          className="flex items-center gap-1.5 text-[13px] text-(--color-muted) hover:text-(--color-ink) no-underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back to home</span>
        </a>
      </nav>

      {/* BODY */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* LEFT PANEL — visible lg+ */}
        <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] border-r border-(--color-border) flex-col justify-between px-14 xl:px-20 py-16 animate-[fadeUp_0.5s_ease_both]">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Record Management System
            </div>
            <h2 className="text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.04em] leading-[1.1] text-(--color-ink) mb-4">
              Track and manage<br />
              <em className="not-italic font-light text-(--color-muted)">any record, your way.</em>
            </h2>
            <p className="text-[15px] text-(--color-muted) leading-[1.7] max-w-sm mb-10">
              A flexible platform for managing records across your organization — organized, searchable, and always up to date.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-col gap-2.5">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="flex items-start gap-4 bg-(--color-surface) border border-(--color-border) rounded-xl px-4 py-3.5 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-(--color-subtle) flex items-center justify-center shrink-0 mt-0.5">
                    {h.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-(--color-ink) tracking-tight">{h.title}</p>
                    <p className="text-[12px] text-(--color-muted) leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-[12px] text-(--color-muted)">Secure login</span>
          </div>
        </div>

        {/* RIGHT PANEL — form */}
        <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-8 py-10 sm:py-14 lg:py-16 animate-[fadeUp_0.5s_ease_both]">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-sm xl:max-w-md">

            {/* Badge — shown only below lg */}
            <div className="flex justify-center mb-7 lg:hidden">
              <div className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Record Management System
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8 lg:text-left">
              <h1 className="text-[clamp(26px,7vw,36px)] sm:text-[32px] font-semibold tracking-[-0.04em] leading-[1.1] text-(--color-ink) mb-2">
                Welcome back
              </h1>
              <p className="text-[14px] sm:text-[15px] text-(--color-muted) leading-relaxed">
                Sign in to continue to your{' '}
                <em className="not-italic font-light">your records.</em>
              </p>
            </div>

            {/* Card — bordered on sm+, flat on mobile */}
            <div className="bg-(--color-surface) sm:border sm:border-(--color-border) sm:rounded-2xl sm:p-7 lg:p-8">
              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-(--color-ink)">
                    Email address or Gov. Username
                  </label>
                  <input
                    type="text"
                    name="email"
                    disabled={isLoading}
                    className="block w-full px-4 py-3 border border-(--color-border) rounded-xl text-[14px] text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="email@example.com or govusername"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[13px] font-medium text-(--color-ink)">
                      Password
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-[13px] text-blue-600 hover:text-blue-800 no-underline hover:underline transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      disabled={isLoading}
                      className="block w-full px-4 pr-16 py-3 border border-(--color-border) rounded-xl text-[14px] text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[12px] font-medium text-(--color-muted) hover:text-(--color-ink) transition-colors bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="mt-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
                      <p className="text-[13px] text-red-600">{errorMessage}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-[10px] text-[15px] font-medium text-(--color-bg) bg-(--color-ink) hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign in →'
                  )}
                </button>
              </form>
            </div>

            {/* Secure indicator — shown below lg */}
            <div className="lg:hidden mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-[12px] text-(--color-muted)">Secure login</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-(--color-border) px-5 sm:px-10 py-5 sm:py-7 flex justify-between items-center gap-4">
        <p className="text-[13px] text-(--color-muted)">© 2026 NathRacker</p>
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