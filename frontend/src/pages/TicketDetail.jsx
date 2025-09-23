import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const ticketRes = await apiClient.get(`/tickets/${id}`);
      setTicket(ticketRes.data);

      const commentsRes = await apiClient.get(`/tickets/${id}/comments`);
      setComments(commentsRes.data);

      const activitiesRes = await apiClient.get(`/tickets/${id}/activities`);
      setActivities(activitiesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await apiClient.post(`/tickets/${id}/comments`, { content: newComment });
      setNewComment("");
      fetchTicketDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const res = await apiClient.patch(`/tickets/${id}/status`, { status: newStatus });
      setTicket(res.data);
      fetchTicketDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="p-8 text-center text-red-600">Ticket not found</div>;
  }

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/tickets")}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Tickets
        </button>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
              <p className="text-gray-600 mt-2">ID: {ticket._id}</p>
            </div>
            <span className={`px-4 py-2 rounded font-semibold ${
              ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {formatStatus(ticket.status)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Priority</p>
              <p className="font-semibold capitalize">{ticket.priority}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Category</p>
              <p className="font-semibold capitalize">{ticket.category}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Reporter</p>
              <p className="font-semibold">{ticket.reporter?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Assignee</p>
              <p className="font-semibold">{ticket.assignee?.name || "Unassigned"}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-2">Description</p>
            <p className="text-gray-900">{ticket.description}</p>
          </div>

          <div className="flex gap-2">
            {ticket.status === 'open' && (
              <button
                onClick={() => updateStatus('in_progress')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Start Working
              </button>
            )}
            {ticket.status === 'in_progress' && (
              <button
                onClick={() => updateStatus('resolved')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark Resolved
              </button>
            )}
            {(ticket.status === 'resolved' || ticket.status === 'open') && (
              <button
                onClick={() => updateStatus('closed')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close Ticket
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>

          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Comment
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-sm">{comment.author?.name}</p>
                <p className="text-gray-600 text-xs">{new Date(comment.createdAt).toLocaleString()}</p>
                <p className="mt-2 text-gray-900">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Activity Log</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity._id} className="border-l-4 border-gray-300 pl-4">
                <p className="font-semibold text-sm capitalize">{activity.action.replace('_', ' ')}</p>
                <p className="text-gray-600 text-xs">{new Date(activity.createdAt).toLocaleString()}</p>
                <p className="text-gray-700 text-sm">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
