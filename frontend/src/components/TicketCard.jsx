export default function TicketCard({ ticket }) {
  const getStatusIcon = (status) => {
    switch(status) {
      case "open": return "🔴";
      case "in_progress": return "🟡";
      case "resolved": return "🟢";
      case "closed": return "⚪";
      default: return "⚪";
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "open": return "bg-red-100 text-red-800 border-red-300";
      case "in_progress": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "resolved": return "bg-green-100 text-green-800 border-green-300";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "low": return "bg-green-50 text-green-700 border-green-300";
      case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-300";
      case "high": return "bg-orange-50 text-orange-700 border-orange-300";
      case "urgent": return "bg-red-50 text-red-700 border-red-300";
      default: return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case "low": return "📍";
      case "medium": return "📌";
      case "high": return "⚠️";
      case "urgent": return "🔥";
      default: return "📍";
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "hardware": return "💻";
      case "software": return "⚙️";
      case "network": return "🌐";
      default: return "📋";
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="border-2 border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl hover:border-blue-400 transition transform hover:scale-102 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">#{ticket._id?.substring(0, 8)}</span>
            <span className="text-2xl">{getStatusIcon(ticket.status)}</span>
          </div>
          <h2 className="font-bold text-lg text-gray-900 mb-1">{ticket.title}</h2>
          <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
        </div>
        <span className={`ml-4 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap border ${getStatusColor(ticket.status)}`}>
          {formatStatus(ticket.status)}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
            <span>{getPriorityIcon(ticket.priority)}</span>
            {formatPriority(ticket.priority || "low")}
          </div>
          
          <div className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-300">
            <span>{getCategoryIcon(ticket.category)}</span>
            {formatCategory(ticket.category || "other")}
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300">
            <span>📅</span>
            {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
