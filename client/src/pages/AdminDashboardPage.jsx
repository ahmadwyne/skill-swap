

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AdminNavbar from '../components/admin/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/slices/adminProfileSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.profile);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const _toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Handle loading or error state
  // if (loading) return <div className="p-6">Loading admin profile...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  // Safe fallback for profile image
  const profileImage = user?.image
    ? user.image.startsWith('http')
      ? user.image
      : `http://localhost:5000${user.image}`
    : 'https://placehold.co/100x100?text=Admin';

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar
        adminName={user?.name || 'Admin'}
        profileImage={profileImage}
        onToggleSidebar={_toggleSidebar}
      />

      <div className="flex pt-16 transition-all duration-300">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white shadow-md min-h-screen transition-all duration-300">
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
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded mb-1 ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'text-blue-600 hover:bg-blue-50'
                  }`
                }
              >
                Profile
              </NavLink>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-0' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

