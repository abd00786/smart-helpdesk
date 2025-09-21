import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import TicketCard from "../components/TicketCard";

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.status) query.append("status", filters.status);
      if (filters.priority) query.append("priority", filters.priority);

      const res = await apiClient.get(`/tickets?${query.toString()}`);
      setTickets(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tickets");
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🎫</span>
              <h1 className="text-4xl font-bold text-gray-900">Support Tickets</h1>
            </div>
            <p className="text-gray-600">Manage and track all your support requests</p>
          </div>
          <button
            onClick={() => navigate("/analytics")}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>📊</span> Analytics
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-t-4 border-blue-500">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔍</span>
            <h3 className="text-lg font-bold text-gray-900">Filter Tickets</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="">All Statuses</option>
                <option value="open">🔴 Open</option>
                <option value="in_progress">🟡 In Progress</option>
                <option value="resolved">🟢 Resolved</option>
                <option value="closed">⚪ Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="">All Priorities</option>
                <option value="low">📍 Low</option>
                <option value="medium">📌 Medium</option>
                <option value="high">⚠️ High</option>
                <option value="urgent">🔥 Urgent</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Actions</label>
              <button
                onClick={() => setFilters({ status: "", priority: "" })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
              >
                ✕ Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex gap-3">
            <span className="text-red-600 text-xl">❌</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="cursor-pointer transition-all duration-200"
              >
                <TicketCard ticket={ticket} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-xl font-semibold mb-2">No tickets found</p>
            <p className="text-gray-400 mb-6">Try adjusting your filters or create a new ticket</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>➕</span> Create New Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
