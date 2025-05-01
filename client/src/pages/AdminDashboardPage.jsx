// client/src/pages/AdminDashboardPage.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold text-blue-600 border-b">
          Admin Dashboard
        </div>
        <nav className="p-4">
          <NavLink
            to="users"
            className={({ isActive }) =>
              `block py-2 px-3 rounded mb-1 ${
                isActive ? 'bg-blue-100 text-blue-800' : 'text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="reports"
            className={({ isActive }) =>
              `block py-2 px-3 rounded mb-1 ${
                isActive ? 'bg-blue-100 text-blue-800' : 'text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Reports
          </NavLink>
          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `block py-2 px-3 rounded mb-1 ${
                isActive ? 'bg-blue-100 text-blue-800' : 'text-blue-600 hover:bg-blue-50'
              }`
            }
          >
            Analytics
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        
      </main>
      {/* Nested routes will render here */}
      <Outlet />
    </div>
  );
};

export default AdminDashboardPage;
