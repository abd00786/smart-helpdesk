import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="bg-linear-to-r from-slate-900 to-slate-800 text-white shadow-2xl sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-80 transition shrink-0 min-w-0"
          >
            <span className="text-2xl sm:text-3xl flex-shrink-0">🎫</span>
            <div className="hidden sm:block">
              <div className="text-sm sm:text-base md:text-lg font-bold leading-none">Smart Helpdesk</div>
              <div className="text-xs text-gray-400 hidden md:inline">Support System</div>
            </div>
            <div className="sm:hidden text-xs font-bold">HD</div>
          </div>

          {/* Desktop Navigation */}
          {token ? (
            <>
              <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-1 px-2 md:px-3 lg:px-4 py-2 rounded-lg font-medium transition text-xs md:text-sm lg:text-base whitespace-nowrap ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1 md:gap-2 px-2 md:px-3 lg:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition text-xs md:text-sm lg:text-base whitespace-nowrap"
              >
                <span className="flex-shrink-0">🚪</span>
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-700 transition text-lg"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </>
          ) : (
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition text-sm sm:text-base"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition text-sm sm:text-base"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {token && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition text-sm ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition text-sm"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
