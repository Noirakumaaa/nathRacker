import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { redirect } from "react-router";
import OfficePic from "./office.jpg";


export function Register() {
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    govUsername: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        },
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
    }
  };



  return (
    <main className="flex min-h-screen">
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

      {/* Left: Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 bg-white relative">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Create Account
            </h2>
            <p className="text-gray-600">Join us to start tracking your work</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Government Username
              </label>
              <input
                type="text"
                name="username"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your PPIS username"
                value={formData.govUsername}
                onChange={(e) =>
                  setFormData({ ...formData, govUsername: e.target.value })
                }
                required
              />
            </div>


            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

      
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                required
              />
              <span className="ml-2 text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Gradient Background with Pattern */}
      <div className="hidden md:block md:w-1/2 h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-600 via-teal-600 to-blue-700"></div>

        {/* Background Pattern */}
        <img
          src={OfficePic}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          draggable={false}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-black">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h1 className="text-4xl font-bold mb-4">Join Our Platform</h1>
              <p className="text-xl text-black leading-relaxed">
                Get started with powerful work tracking and management tools
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-12">
              <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
                <div className="w-8 h-8 bg-black bg-opacity-20 rounded-lg mb-3"></div>
                <h3 className="font-semibold mb-2">Complete Control</h3>
                <p className="text-sm text-black">
                  Full visibility and control over all your work
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6 text-left">
                <div className="w-8 h-8 bg-black bg-opacity-20 rounded-lg mb-3"></div>
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-black">
                  Detailed reports and insights to optimize your operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Toast - Bottom Left */}
      {registerSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            backgroundColor: "#22c55e",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "14px",
            fontWeight: 500,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ✓ Registered successfully!
        </div>
      )}
    </main>
  );
}
