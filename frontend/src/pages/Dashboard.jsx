import { useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../api/apiClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post("/tickets", { 
        title, 
        description, 
        category,
        priority,
        status: "open" 
      });
      setSuccess("✓ Ticket created successfully!");
      setTitle("");
      setDescription("");
      setCategory("other");
      setPriority("medium");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "View Tickets", icon: "🎫", color: "from-blue-500 to-blue-600", action: () => navigate("/tickets") },
    { label: "Analytics", icon: "📊", color: "from-purple-500 to-purple-600", action: () => navigate("/analytics") },
    { label: "IT Support", icon: "🔧", color: "from-orange-500 to-orange-600", action: () => navigate("/it-support") },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-6 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <span className="text-3xl sm:text-4xl">👋</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Welcome to Smart Helpdesk</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage your support tickets efficiently</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat, idx) => (
            <button
              key={idx}
              onClick={stat.action}
              className={`rounded-lg md:rounded-xl bg-linear-to-br ${stat.color} p-4 md:p-5 lg:p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition cursor-pointer`}
            >
              <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
              <div className="text-sm md:text-base lg:text-lg font-semibold">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {/* Create Ticket Form - Takes 2 cols */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg p-4 md:p-5 lg:p-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
              <span className="text-2xl sm:text-3xl">📝</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Ticket</h2>
            </div>

            {error && (
              <div className="rounded-lg sm:rounded-xl bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3">
                <span className="text-red-600 text-lg sm:text-xl shrink-0">❌</span>
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg sm:rounded-xl bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6 flex gap-2 sm:gap-3 animate-pulse">
                <span className="text-green-600 text-lg sm:text-xl shrink-0">✓</span>
                <p className="text-xs sm:text-sm text-green-700 font-semibold">{success}</p>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Issue Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Network connection issue"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows="4"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900 resize-none text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900 text-sm sm:text-base"
                  >
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="network">Network</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-900 text-sm sm:text-base"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin">⏳</span> Creating Ticket...
                  </span>
                ) : (
                  "Create Ticket"
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-gray-900">Quick Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Be specific with your issue title</li>
                <li>✓ Provide detailed description</li>
                <li>✓ Select appropriate category</li>
                <li>✓ Set priority level</li>
              </ul>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="font-bold text-gray-900">Recent Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Open Tickets</span>
                  <span className="font-bold text-blue-600">→</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">In Progress</span>
                  <span className="font-bold text-orange-600">→</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Resolved</span>
                  <span className="font-bold text-green-600">→</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/analytics")}
                className="w-full mt-4 py-2 text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                View Full Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
