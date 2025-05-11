// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerImage from "../assets/auth-bg.jpg"; // Use same image as login

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Field validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      setSuccessMessage("Registration successful! Please log in.");

      // Clear the fields after successful registration
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong!");
    }
  };

  return (
    <div className="flex fixed inset-0 overflow-hidden">
      {/* Left: Form and Title */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 via-blue-100 to-blue-200 relative z-10"
      >
        {/* Title */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Skill Swap
          </h1>
          {/* Tagline */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 italic mt-2">
            Empower your skills. Connect. Grow.
          </p>
        </motion.div>

        {/* Form Box */}
        <div className="mt-6 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-8 w-[85%] max-w-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Create an Account
          </h2>

          {successMessage && (
            <p className="text-green-400 font-bold text-center mb-4">
              {successMessage}
            </p>
          )}
          {error && (
            <p className="text-red-500 font-semibold text-center mb-3">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-4"
          >
            {/* Name Field */}
            <div className="relative">
              <FiUser className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error === "Please enter your full name.") setError(""); // Clear error when user starts typing
                }}
                autoComplete="off"
                className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 outline-none text-base text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error === "Please enter a valid email address.") setError(""); // Clear error when user starts typing
                }}
                autoComplete="off"
                className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 outline-none text-base text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error === "Password must be at least 6 characters long.") setError(""); // Clear error when user starts typing
                }}
                autoComplete="new-password"
                className="pl-10 pr-10 py-3 w-full rounded-full border border-gray-300 outline-none text-base text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-3.5 right-3 text-blue-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <FiLock className="absolute top-3.5 left-3 text-blue-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error === "Passwords do not match!") setError(""); // Clear error when user starts typing
                }}
                autoComplete="new-password"
                className="pl-10 pr-10 py-3 w-full rounded-full border border-gray-300 outline-none text-base text-gray-900 bg-gray-100 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-3.5 right-3 text-blue-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            <button
              type="submit"
              className="w-2/3 mx-auto block bg-blue-500 text-white font-semibold py-3 rounded-full border border-blue-700 hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>

            <div className="text-center mt-2">
              <p className="text-white">
                Already have an account?{" "}
                <a href="/login" className="underline hover:text-gray-200">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Right: Image */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-1/2 h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${registerImage})`,
        }}
      ></motion.div>
    </div>
  );
};

export default RegisterPage;
