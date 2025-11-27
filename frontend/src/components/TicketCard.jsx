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
    <div className="border-2 border-gray-200 p-3 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl hover:border-blue-400 transition transform hover:scale-102 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm sm:text-lg">#{ticket._id?.substring(0, 8)}</span>
            <span className="text-xl sm:text-2xl">{getStatusIcon(ticket.status)}</span>
          </div>
          <h2 className="font-bold text-base sm:text-lg text-gray-900 mb-1 word-break">{ticket.title}</h2>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{ticket.description}</p>
        </div>
        <span className={`mt-2 sm:mt-0 sm:ml-4 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap border ${getStatusColor(ticket.status)}`}>
          {formatStatus(ticket.status)}
        </span>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
            <span>{getPriorityIcon(ticket.priority)}</span>
            <span className="hidden sm:inline">{formatPriority(ticket.priority || "low")}</span>
            <span className="sm:hidden">{ticket.priority}</span>
          </div>
          
          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 border border-blue-300">
            <span>{getCategoryIcon(ticket.category)}</span>
            <span className="hidden sm:inline">{formatCategory(ticket.category || "other")}</span>
            <span className="sm:hidden">{ticket.category}</span>
          </div>

          <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300">
            <span>📅</span>
            <span className="hidden sm:inline">{new Date(ticket.createdAt).toLocaleDateString()}</span>
            <span className="sm:hidden">{new Date(ticket.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
