import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaChartBar, FaFlag, FaUserShield, FaBolt } from 'react-icons/fa';

const navItems = [
  { to: 'users', label: 'Users', icon: <FaUsers /> },
  { to: 'reports', label: 'Reports', icon: <FaFlag /> },
  { to: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
  { to: 'engagement-analytics', label: 'Engagement Stats', icon: <FaBolt /> },  // <-- NEW
  { to: 'profile', label: 'Profile', icon: <FaUserShield /> },

];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-blue-900 text-white shadow-2xl min-h-screen transition-all duration-500 ease-in-out">
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
    </aside>
  );
};

export default AdminSidebar;
