import APIFETCH from 'lib/axios/axiosConfig';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToastStore } from 'lib/zustand/ToastStore';
import { useNavigate } from 'react-router';

type Step = 'email' | 'reset';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { show } = useToastStore();

  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      await APIFETCH.post('/auth/forgot-password', { email });
      show('Reset code sent to your email.', 'success');
      setStep('reset');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong.';
      setErrorMessage(message);
      show(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await APIFETCH.post('/auth/reset-password', { email, code, newPassword });
      show('Password reset successfully. Please sign in.', 'success');
      navigate('/login');
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Something went wrong.';
      setErrorMessage(message);
      show(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
          href="/login"
          className="flex items-center gap-1.5 text-[13px] text-(--color-muted) hover:text-(--color-ink) no-underline transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Back to login</span>
        </a>
      </nav>

      {/* BODY */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-8 py-10 sm:py-14 animate-[fadeUp_0.5s_ease_both]">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* Badge */}
          <div className="flex justify-center mb-7">
            <div className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Password Recovery
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${step === 'email' ? 'bg-(--color-ink) text-(--color-bg)' : 'bg-emerald-500 text-white'}`}>
              {step === 'reset' ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : '1'}
            </div>
            <div className={`h-px w-10 transition-colors ${step === 'reset' ? 'bg-emerald-500' : 'bg-(--color-border)'}`} />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${step === 'reset' ? 'bg-(--color-ink) text-(--color-bg)' : 'bg-(--color-subtle) text-(--color-muted)'}`}>
              2
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-[clamp(26px,7vw,36px)] sm:text-[32px] font-semibold tracking-[-0.04em] leading-[1.1] text-(--color-ink) mb-2">
              {step === 'email' ? 'Forgot password?' : 'Reset password'}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-(--color-muted) leading-relaxed">
              {step === 'email'
                ? 'Enter your email and we\'ll send you a 6-digit code.'
                : <>Code sent to <span className="font-medium text-(--color-ink)">{email}</span></>
              }
            </p>
          </div>

          {/* Card */}
          <div className="bg-(--color-surface) sm:border sm:border-(--color-border) sm:rounded-2xl sm:p-7 lg:p-8">

            {/* STEP 1 — Email */}
            {step === 'email' && (
              <form className="space-y-4 sm:space-y-5" onSubmit={handleSendCode}>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-(--color-ink)">
                    Email address
                  </label>
                  <input
                    type="email"
                    disabled={isLoading}
                    className="block w-full px-4 py-3 border border-(--color-border) rounded-xl text-[14px] text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
                    <p className="text-[13px] text-red-600">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-[10px] text-[15px] font-medium text-(--color-bg) bg-(--color-ink) hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending code…
                    </>
                  ) : (
                    'Send reset code →'
                  )}
                </button>
              </form>
            )}

            {/* STEP 2 — Code + New Password */}
            {step === 'reset' && (
              <form className="space-y-4 sm:space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-(--color-ink)">
                    6-digit code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    disabled={isLoading}
                    className="block w-full px-4 py-3 border border-(--color-border) rounded-xl text-[14px] text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-[0.3em] text-center font-mono"
                    placeholder="——————"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-(--color-ink)">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      disabled={isLoading}
                      className="block w-full px-4 pr-16 py-3 border border-(--color-border) rounded-xl text-[14px] text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-(--color-ink)">
                    Confirm new password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    className="block w-full px-4 py-3 border border-(--color-border) rounded-xl text-[14px] text-(--color-ink) placeholder-(--color-placeholder) bg-(--color-bg) focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-(--color-border-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block shrink-0" />
                    <p className="text-[13px] text-red-600">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-[10px] text-[15px] font-medium text-(--color-bg) bg-(--color-ink) hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-ink) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Resetting…
                    </>
                  ) : (
                    'Reset password →'
                  )}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => { setStep('email'); setErrorMessage(''); setCode(''); }}
                  className="w-full py-2 text-[13px] text-(--color-muted) hover:text-(--color-ink) transition-colors bg-transparent border-none cursor-pointer"
                >
                  Didn't receive a code? Send again
                </button>
              </form>
            )}
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
