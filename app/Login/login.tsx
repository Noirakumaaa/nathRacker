import APIFETCH from 'lib/axios/axiosConfig';
import OfficePic from './office.jpg';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { LoginInput, LoginResponse } from '~/types/authTypes';
import { useToastStore } from 'lib/zustand/ToastStore';
import { useNavigate } from 'react-router';
export function Login() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { show } = useToastStore()
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await APIFETCH.post<LoginResponse>('/auth/login', formData);
      queryClient.setQueryData(['me'], res.data);
      show('Login successful! Redirecting...', 'success'); 
      navigate(`/dashboard`)
    } catch {
      setErrorMessage('Invalid email or password');
      show('Invalid email or password', 'error'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#fafaf8] font-sans antialiased">

      {/* Left panel — image side */}
      <div className="hidden md:flex md:w-[45%] h-screen sticky top-0 flex-col relative overflow-hidden bg-[#1a1a18]">
        <img
          src={OfficePic}
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a18]/40 via-transparent to-[#1a1a18]/80" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <a href="/" className="flex items-center gap-2 no-underline">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span className="text-white text-[17px] font-semibold tracking-tight">NathRacker</span>
          </a>

          <div>
            <p className="text-white/40 text-[11px] font-mono tracking-widest uppercase mb-4">Encoding Tracking System</p>
            <h2 className="text-white text-[32px] font-semibold tracking-tight leading-[1.2] mb-4">
              All your encoded<br />
              <span className="font-light text-white/60 italic">records, in one place.</span>
            </h2>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-[320px]">
              BUS, PCN, SWDI, and Miscellaneous — organized, searchable, and always up to date.
            </p>

            <div className="flex gap-2 mt-6 flex-wrap">
              {['BUS', 'PCN', 'SWDI', 'MISC', 'CVS'].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/10 text-white/60 tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-8 lg:px-20 bg-[#fafaf8] relative">

        <a
          href="/"
          className="absolute top-6 right-6 flex items-center gap-1.5 text-[13px] text-[#8a8a80] hover:text-[#1a1a18] no-underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </a>

        <div className="max-w-[400px] w-full mx-auto">

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              <span className="text-[#1a1a18] text-[17px] font-semibold tracking-tight">NathRacker</span>
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1a1a18] mb-2">
              Welcome back
            </h1>
            <p className="text-[14px] text-[#8a8a80]">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#1a1a18]">
                Email address or Gov. Username
              </label>
              <input
                type="text"
                name="email"
                disabled={isLoading}
                className="block w-full px-4 py-3 border border-[#e8e8e0] rounded-lg text-[14px] text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="email@example.com or govusername"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[13px] font-medium text-[#1a1a18]">
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
                  className="block w-full px-4 pr-16 py-3 border border-[#e8e8e0] rounded-lg text-[14px] text-[#1a1a18] placeholder-[#c4c4b8] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-[#c8c8c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[12px] font-medium text-[#8a8a80] hover:text-[#1a1a18] transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {errorMessage && (
                <div className="mt-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block flex-shrink-0" />
                  <p className="text-[13px] text-red-600">{errorMessage}</p>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#e8e8e0] text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[13px] text-[#8a8a80]">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg text-[14px] font-medium text-white bg-[#1a1a18] hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
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

          <div className="mt-8 pt-6 border-t border-[#e8e8e0] text-center">
            <p className="text-[13px] text-[#8a8a80]">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-[#1a1a18] font-medium hover:underline transition-colors no-underline"
              >
                Create one
              </a>
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-8 lg:left-20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span className="text-[12px] text-[#8a8a80]">Secure login</span>
        </div>
      </div>
    </main>
  );
}