import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [sla, setSla] = useState(null);
  const [trends, setTrends] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const statsRes = await apiClient.get("/analytics/stats");
      const slaRes = await apiClient.get("/analytics/sla-metrics");
      const trendsRes = await apiClient.get("/analytics/trends");
      const heatmapRes = await apiClient.get("/analytics/resolution-heatmap");

      setStats(statsRes.data);
      setSla(slaRes.data);
      setTrends(trendsRes.data);
      setHeatmap(heatmapRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl sm:text-6xl mb-4 animate-bounce">📊</div>
          <p className="text-base sm:text-lg text-gray-600 font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon, label, value, color }) => (
    <div className={`bg-linear-to-br ${color} rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white`}>
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <span className="text-3xl sm:text-4xl">{icon}</span>
      </div>
      <p className="text-white/80 text-xs sm:text-sm font-medium">{label}</p>
      <p className="text-2xl sm:text-4xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-6 sm:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
            <span className="text-3xl sm:text-4xl">📊</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Real-time insights and performance metrics</p>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard 
            icon="📈" 
            label="Total Tickets" 
            value={stats?.status?.total || 0}
            color="from-blue-500 to-blue-600"
          />
          <StatCard 
            icon="🔴" 
            label="Open" 
            value={stats?.status?.open || 0}
            color="from-red-500 to-red-600"
          />
          <StatCard 
            icon="🟡" 
            label="In Progress" 
            value={stats?.status?.in_progress || 0}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard 
            icon="🟢" 
            label="Resolved" 
            value={stats?.status?.resolved || 0}
            color="from-green-500 to-green-600"
          />
          <StatCard 
            icon="⚪" 
            label="Closed" 
            value={stats?.status?.closed || 0}
            color="from-gray-500 to-gray-600"
          />
        </div>

        {/* SLA Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-t-4 border-green-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
              <span className="text-3xl sm:text-4xl">✅</span>
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm">SLA Compliance Rate</p>
                <p className="text-2xl sm:text-4xl font-bold text-green-600">{sla?.slaComplianceRate}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Percentage of tickets met SLA deadline</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-t-4 border-blue-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
              <span className="text-3xl sm:text-4xl">⏱️</span>
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm">Avg Resolution Time</p>
                <p className="text-2xl sm:text-4xl font-bold text-blue-600">{sla?.averageResolutionTime}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Average minutes to resolve tickets</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-t-4 border-purple-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
              <span className="text-3xl sm:text-4xl">🎯</span>
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm">SLA Met Count</p>
                <p className="text-2xl sm:text-4xl font-bold text-purple-600">{sla?.slaMet || 0}/{sla?.tickets || 0}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Tickets resolved within SLA window</p>
          </div>
        </div>

        {/* Priority & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Priority Distribution */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">📊</span>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Tickets by Priority</h2>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📍</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Low</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-green-600">{stats?.priority?.low || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📌</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Medium</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-yellow-600">{stats?.priority?.medium || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⚠️</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">High</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-orange-600">{stats?.priority?.high || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🔥</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Urgent</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-red-600">{stats?.priority?.urgent || 0}</span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">🏷️</span>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Tickets by Category</h2>
            </div>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">💻</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Hardware</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-blue-600">{stats?.category?.hardware || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">⚙️</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Software</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-purple-600">{stats?.category?.software || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🌐</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Network</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-green-600">{stats?.category?.network || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📋</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Other</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-gray-600">{stats?.category?.other || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">📈</span>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Ticket Trends (Last {trends?.period} days)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(trends?.byCategory || {}).map(([category, count]) => (
              <div key={category} className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 capitalize font-semibold text-xs sm:text-sm mb-2">{category}</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{count}</p>
                <p className="text-xs text-gray-500 mt-2">tickets created</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
