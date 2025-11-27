import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { validatePassword, getPasswordStrength } from "../utils/passwordValidator";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    
    if (pwd) {
      const validation = validatePassword(pwd);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      setError("Password does not meet security requirements");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await apiClient.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = {
    gray: 'bg-gray-300',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur rounded-lg sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-linear-to-br from-green-500 to-green-600 rounded-full">
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Join Smart Helpdesk</h1>
            <p className="text-gray-600 text-sm sm:text-base">Create your account to get started</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4 flex gap-2 sm:gap-3">
              <span className="text-red-600 text-lg sm:text-xl shrink-0">⚠️</span>
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 placeholder-gray-500 text-sm sm:text-base ${
                  password && passwordErrors.length === 0 
                    ? 'border-green-500 focus:border-green-600 focus:ring-green-200' 
                    : password && passwordErrors.length > 0
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                }`}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 sm:mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strengthColors[passwordStrength.color]} transition-all`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold text-${passwordStrength.color}-600 whitespace-nowrap`}>
                      {passwordStrength.label}
                    </span>
                  </div>

                  {/* Password Requirements */}
                  {passwordErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 space-y-1">
                      {passwordErrors.map((err, idx) => (
                        <p key={idx} className="text-xs text-red-700 flex items-center gap-2">
                          <span>✕</span> {err}
                        </p>
                      ))}
                    </div>
                  )}

                  {passwordErrors.length === 0 && password.length >= 8 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <p className="text-xs text-green-700 font-semibold">✓ Password is secure</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span> <span className="hidden sm:inline">Creating account...</span>
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-green-600 hover:text-green-700 transition">
                Sign in
              </a>
            </p>
          </div>

          {/* Features */}
          <div className="rounded-lg bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 p-3 sm:p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase">What you'll get:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Create and manage support tickets</li>
              <li>✓ Track ticket status in real-time</li>
              <li>✓ View analytics and reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
