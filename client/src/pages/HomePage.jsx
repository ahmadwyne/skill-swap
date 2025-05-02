// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-blue-500 text-white min-h-screen flex justify-center items-center flex-col">
      <h1 className="text-5xl font-bold mb-8">Welcome to SkillSwap!</h1>

      {/* Navigation Links */}
      <div className="space-x-4">
        <Link to="/login" className="bg-green-500 p-3 rounded-lg text-white hover:bg-green-600 transition duration-300">Login</Link>
        <Link to="/register" className="bg-orange-500 p-3 rounded-lg text-white hover:bg-orange-600 transition duration-300">Register</Link>
      </div>
    </div>
  );
};

export default Home;