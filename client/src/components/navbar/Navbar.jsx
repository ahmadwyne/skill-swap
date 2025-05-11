import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 transition-colors duration-300 font-semibold ${
      isActive
        ? 'text-blue-700 border-b-2 border-blue-700'
        : 'text-white hover:text-blue-700'
    }`;

  return (
    <nav className="top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/20 border-b border-white/30 shadow-md text-white font-bold py-4 px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="text-3xl font-extrabold text-white drop-shadow-md">
          SkillSwap
        </NavLink>

        {/* Links */}
        <div className="text-xl flex justify-evenly items-center w-full max-w-4xl">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          {token ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <NavLink to="/skill-matching" className={navLinkClass}>Skill Matching</NavLink>
              <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
              <NavLink to="/about-us" className={navLinkClass}>About Us</NavLink>

              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>Admin Dashboard</NavLink>
              )}

              <button
                onClick={handleLogout}
                className="ml-4 bg-blue-700 px-4 py-2 rounded hover:bg-red-600 font-semibold text-white transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <NavLink to="/register" className={navLinkClass}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
