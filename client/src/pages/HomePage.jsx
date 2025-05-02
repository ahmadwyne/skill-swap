// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from "../assets/auth-bg.jpg";
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 md:p-14 max-w-xl text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-4">
          Skill Swap
        </h1>
        <p className="text-gray-700 text-lg">Empower your skills. Connect. Grow.</p>
        <p className="text-gray-600 text-sm mb-8">
          Skill Swap, A platform where learners meet learners—share, teach, and grow together.
        </p>

        <motion.div whileHover={{ scale: 1.02 }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get Started</h2>

          <div className="flex flex-col space-y-4">
            <Link
              to="/login"
              className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition duration-300 space-x-2"
            >
              <LogIn size={20} /> <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition duration-300 space-x-2"
            >
              <UserPlus size={20} /> <span>Register</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
