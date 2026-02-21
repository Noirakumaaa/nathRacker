
import OfficePic from './office.jpg';
import { useState } from 'react';
import { useLogin } from 'component/authMutation';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  
  const login = useLogin()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    login.mutate(
      formData,
      {
        onSuccess: (data) => {
          window.location.href = "/dashboard";
        },
        onError: () => {
          setErrorMessage("Invalid email or password")
        }
      }
    )
  }


  return (
    <main className="flex min-h-screen bg-slate-50">
      {/* Home Arrow Button - Top Right */}
      <a
        href="/"
        className="fixed top-6 right-6 z-50 group flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200/50"
        title="Go to Home"
      >
        <svg
          className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </a>

      {/* Left: Gradient Background with Pattern */}
      <div className="hidden md:block md:w-1/2 h-screen relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700"></div>
        {/* Animated Background Pattern */}
        <img
          src={OfficePic}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          draggable={false}
        />
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Tracking System</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Monitor, track, and manage your assets with precision and ease
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg mb-3"></div>
                <h3 className="font-semibold mb-1">Real-time Tracking</h3>
                <p className="text-sm text-white/80">Live updates on all your work</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg mb-3"></div>
                <h3 className="font-semibold mb-1">Secure Dashboard</h3>
                <p className="text-sm text-white/80">Protected data analytics</p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right: Enhanced Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-white relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-50 to-transparent rounded-full blur-2xl -z-10"></div>

        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email address | GovUsername
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  className="block w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your Email or Government Username"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="block w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}

            { }
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
              >
                Create one now
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="absolute bottom-6 right-6 flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Secure Login</span>
        </div>
      </div>
    </main>
  );
}