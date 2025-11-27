import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          404
        </div>

        {/* Sad Emoji */}
        <div className="text-8xl mb-8">😔</div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Helpful Info */}
        <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 mb-8 max-w-md mx-auto border border-slate-700">
          <p className="text-gray-300 text-sm">
            <strong>Current Path:</strong> <code className="text-blue-400">{window.location.pathname}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-gray-500 text-sm mt-12">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
