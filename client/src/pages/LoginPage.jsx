import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Save token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({  // Save user info
        name: response.data.name,
        email: response.data.email,
        _id: response.data.id,  // Ensure the backend returns the user ID
      }));

      dispatch(loginSuccess(response.data.token)); // Store token in Redux
      navigate('/profile');  // Redirect to profile page after login
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.msg || 'Something went wrong!'));
      setError(err.response?.data?.msg || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('https://via.placeholder.com/1500')] flex justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Login</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>} {/* Display error message if any */}

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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;