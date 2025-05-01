// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(loginStart());
//     try {
//       // Send login request to backend
//       const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
//       // Save token and user data in localStorage
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify({  // Save user info
//         name: response.data.name,
//         email: response.data.email,
//         _id: response.data.id,  // Ensure the backend returns the user ID
//       }));

//       dispatch(loginSuccess(response.data.token)); // Store token in Redux
//       navigate('/profile');  // Redirect to profile page after login
//     } catch (err) {
//       dispatch(loginFailure(err.response?.data?.msg || 'Something went wrong!'));
//       setError(err.response?.data?.msg || 'Something went wrong!');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-center bg-[url('https://via.placeholder.com/1500')] flex justify-center items-center">
//       <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Login</h2>

//         {error && <p className="text-red-600 text-center mb-4">{error}</p>} {/* Display error message if any */}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <input
//               type="email"
//               className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
          
//           <div>
//             <input
//               type="password"
//               className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Added this line

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/auth-bg.jpg";
import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";


const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Field validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    // API call
    dispatch(loginStart());
    try {

      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      const token = response.data.token;
      const decoded = jwtDecode(token)

      const role = decoded?.user?.role || 'user';


      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        name: response.data.name,
        email: response.data.email,
        _id: response.data.id,
        role: decoded.user.role // Save role too
      }));

      dispatch(loginSuccess(token));

      // Redirect based on role
      if (decoded.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }

      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.data.name,
          email: response.data.email,
          _id: response.data.id,
        })
      );

      dispatch(loginSuccess(response.data.token));
      navigate("/profile");

    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Something went wrong!";
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
    }
  };

  return (
    <div className="flex fixed inset-0 overflow-hidden">
      {/* Left: Login Form */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200 relative z-10"
      >
        {/* Animated Website Title */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-6 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Skill Swap
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 italic mt-1">
            Empower your skills. Connect. Grow.
          </p>
        </motion.div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

        {/* Login Box */}
        <div className="mt-12 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-[90%] max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
            Welcome Back
          </h2>
          {/* Error Message */}
          {error && <p className="text-red-500 font-semibold text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error === "Please enter your email address." || error === "Please enter a valid email address.") {
                    setError(""); // Clear error when user starts typing
                  }
                }}
                className="pl-10 pr-4 py-2 sm:py-3 w-full rounded-full border border-gray-300 outline-none text-sm sm:text-base md:text-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error === "Password is required.") {
                    setError(""); // Clear error when user starts typing
                  }
                }}
                className="pl-10 pr-10 py-2 sm:py-3 w-full rounded-full border border-gray-300 outline-none text-sm sm:text-base md:text-lg text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-3.5 right-3 text-blue-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-2/3 mx-auto block bg-blue-500 text-white font-semibold py-2 sm:py-3 rounded-full border border-blue-700 hover:bg-blue-600 hover:text-gray-100 transition duration-300 text-sm sm:text-base md:text-lg"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-sm sm:text-base md:text-lg text-white">
              Don't have an account?{" "}
              <a href="/register" className="underline hover:text-gray-200">
                Register here
              </a>
            </p>

          </div>
        </div>
      </motion.div>

      {/* Right: Background Image Animation */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginImage})`,
        }}
      ></motion.div>
    </div>
  );
};

export default LoginPage;
