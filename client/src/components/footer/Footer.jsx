// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const internalLinks = [
    { name: "Home", to: "/" },
    { name: "Profile", to: "/profile" },
    { name: "Login", to: "/login" },
    { name: "Signup", to: "/signup" },
    { name: "Chat", to: "/chat" },
    { name: "Resources", to: "/resources" },
    { name: "Skill Matching", to: "/skill-matching" },
    { name: "Settings", to: "/settings" },
    { name: "Sessions", to: "/sessions" },
    // About Us now points to /about-us
    { name: "About Us", to: "/about-us" },
  ];

  return (
    <footer className="bg-white/80 backdrop-blur border-t border-blue-200 shadow-inner text-blue-900">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm md:text-base">

        {/* Column 1 - Brand */}
        <div>
          <h2 className="text-xl font-bold text-indigo-600 mb-3">Skill Swap</h2>
          <p className="text-gray-600">
            A collaborative platform for peer-to-peer learning and skill development.
          </p>
        </div>

        {/* Column 2 - Navigation Links */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            {internalLinks.map(({ name, to }) => (
              <Link
                key={name}
                to={to}
                className="hover:text-indigo-600 transition duration-300"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3 - Social */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-700 mb-2">Connect with us</h3>
          <div className="flex space-x-4 mt-2 items-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition transform hover:scale-110"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700 transition transform hover:scale-110"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-500 transition transform hover:scale-110"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-200">
        © {new Date().getFullYear()} Skill Swap. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
