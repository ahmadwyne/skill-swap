import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-bg.jpg";

import { FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

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
      dispatch(
        loginFailure(err.response?.data?.msg || "Something went wrong!")
      );
      setError(err.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <div className="flex fixed inset-0 overflow-hidden">
      {/* Left: Login Form */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-gray-100">
        {/* Branding */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Skill Swap
          </h1>
          <p className="text-base text-gray-600 italic mt-1">
            Empower your skills. Connect. Grow.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-10 w-[90%] max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Welcome Back
          </h2>
          {error && <p className="text-red-200 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 outline-none text-sm text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-3 w-full rounded-full border border-gray-300 outline-none text-sm text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
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
              className="w-2/3 bg-blue-500 text-white font-semibold py-3 rounded-full border border-blue-700 hover:bg-blue-600 hover:text-gray-100 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right: Background Image */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${loginImage})`,
        }}
      ></div>
    </div>
  );
};

export default LoginPage;
