import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Tickets", path: "/tickets", icon: "🎫" },
    { label: "Analytics", path: "/analytics", icon: "📈" },
    { label: "IT Support", path: "/it-support", icon: "🔧" },
  ];

  return (
    <nav className="bg-linear-to-r from-slate-900 to-slate-800 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-3xl">🎫</span>
            <div>
              <div className="text-xl font-bold">Smart Helpdesk</div>
              <div className="text-xs text-gray-400">Support System</div>
            </div>
          </div>

          {/* Navigation */}
          {token ? (
            <div className="flex items-center gap-8">
              <div className="flex gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition transform hover:scale-105 flex items-center gap-2"
              >
                <span>👋</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700 font-medium transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
