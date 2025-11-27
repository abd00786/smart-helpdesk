import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import Analytics from './pages/Analytics';
import ITSupport from './pages/ITSupport';
import NotFound from './pages/NotFound';
import './App.css';

const PrivateRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute token={token}><Dashboard /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute token={token}><Tickets /></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute token={token}><TicketDetail /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute token={token}><Analytics /></PrivateRoute>} />
        <Route path="/it-support" element={<PrivateRoute token={token}><ITSupport /></PrivateRoute>} />
        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
