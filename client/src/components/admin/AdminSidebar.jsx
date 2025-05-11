import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaChartBar, FaFlag, FaUserShield, FaBolt, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { to: 'users', label: 'Users', icon: <FaUsers /> },
  { to: 'reports', label: 'Reports', icon: <FaFlag /> },
  { to: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
  { to: 'engagement-analytics', label: 'Engagement Stats', icon: <FaBolt /> },
  { to: 'profile', label: 'Profile', icon: <FaUserShield /> },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-blue-900 text-white shadow-2xl min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-6 text-xl font-extrabold tracking-wide border-b border-blue-700">
          Admin Dashboard
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform
                 ${
                   isActive
                     ? 'bg-white text-blue-900 scale-105 shadow-md'
                     : 'hover:bg-white hover:text-blue-900 hover:scale-105'
                 }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span className="text-md font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      {isAdmin && (
        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
      )}
    </aside>
  );
};

export default AdminSidebar;
