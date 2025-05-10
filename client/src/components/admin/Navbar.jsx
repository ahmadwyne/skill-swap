// client/src/components/admin/Navbar.jsx

import React from 'react';
import { FaBars } from 'react-icons/fa';

const AdminNavbar = ({ adminName, profileImage, onToggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-blue-900 text-white shadow-md z-40 flex items-center justify-between px-6">
      {/* Left - Hamburger */}
      <button onClick={onToggleSidebar} className="text-white text-xl focus:outline-none">
        <FaBars />
      </button>

      {/* Right - Admin Greeting */}
      <div className="flex items-center space-x-4">
        {/* <img
          src={profileImage}
          alt="Admin"

          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        /> */}
        <img
          src={profileImage}
          alt="Admin"
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />

        <span className="text-lg font-semibold">Hello, Mr. {adminName}</span>

      </div>
    </header>
  );
};

export default AdminNavbar;


