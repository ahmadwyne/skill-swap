// src/components/navbar/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');  // Redirect user to login page after logging out
  };

  return (
    <nav className="bg-blue-600 text-white py-4 px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">SkillSwap</Link>
        <div className="space-x-6">
          <Link to="/" className="hover:underline">Home</Link>
          {token ? (
            <>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <Link to="/skill-matching" className="hover:underline">Skill Matching</Link> {/* Updated link */}
              <Link to="/skills" className="hover:underline">Manage Skills</Link>
              <Link to="/sessions" className="hover:underline">Sessions</Link>
              {isAdmin && <Link to="/admin" className="hover:underline">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;