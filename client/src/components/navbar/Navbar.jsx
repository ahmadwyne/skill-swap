import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const isAdmin = user?.role === 'admin';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md transition-colors duration-300 font-semibold ${
      isActive
        ? 'text-blue-700 border-b-2 border-blue-700'
        : 'text-white hover:text-blue-700'
    }`;

  return (
    <nav className="bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-md text-white font-bold">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <NavLink to="/" className="text-3xl font-extrabold text-white drop-shadow-md">
          SkillSwap
        </NavLink>

        {/* Hamburger menu button (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Links container */}
        <div className={`flex-1 justify-end items-center ${menuOpen ? 'block' : 'hidden'} md:flex`}>          
          <div className="flex flex-col md:flex-row md:space-x-4 lg:space-x-8 text-xl">
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
                  className="mt-2 md:mt-0 bg-blue-700 px-4 py-2 rounded hover:bg-red-600 font-semibold text-white transition-colors duration-300"
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
      </div>
    </nav>
  );
};

export default Navbar;
