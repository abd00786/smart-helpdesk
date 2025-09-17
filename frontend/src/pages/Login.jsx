import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full">
              <span className="text-2xl">🎫</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Helpdesk</h1>
            <p className="text-gray-600">Sign in to manage your tickets</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3">
              <span className="text-red-600 text-xl">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900 placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Create one
              </a>
            </p>
          </div>

          {/* Demo Hint */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
            <p className="text-xs text-blue-700 font-medium">Demo Credentials</p>
            <p className="text-xs text-blue-600 mt-1">Email: test@example.com | Pass: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
