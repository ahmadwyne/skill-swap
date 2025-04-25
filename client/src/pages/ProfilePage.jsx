// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { 'x-auth-token': token },
          });
          setUser(response.data);
          setSkillsToTeach(response.data.skillsToTeach.join(','));
          setSkillsToLearn(response.data.skillsToLearn.join(','));
        } catch (err) {
          setError('Failed to load profile data.');
        }
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        { skillsToTeach: skillsToTeach.split(','), skillsToLearn: skillsToLearn.split(',') },
        { headers: { 'x-auth-token': token } }
      );
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update profile.');
      setSuccess('');
    }
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Include the Navbar */}
      
      <div className="max-w-screen-md mx-auto p-8 bg-white rounded-lg shadow-xl mt-8">
        <h1 className="text-4xl font-semibold text-center text-gray-700 mb-6">Welcome, {user.name}</h1>

        {/* Success and Error Feedback */}
        {success && <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

        {/* Profile Info */}
        <div className="space-y-6">
          <div>
            <label htmlFor="skillsToTeach" className="block text-lg font-medium text-gray-700">Skills You Can Teach</label>
            <input
              type="text"
              id="skillsToTeach"
              value={skillsToTeach}
              onChange={(e) => setSkillsToTeach(e.target.value)}
              placeholder="Enter skills to teach (comma separated)"
              className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <div>
            <label htmlFor="skillsToLearn" className="block text-lg font-medium text-gray-700">Skills You Want to Learn</label>
            <input
              type="text"
              id="skillsToLearn"
              value={skillsToLearn}
              onChange={(e) => setSkillsToLearn(e.target.value)}
              placeholder="Enter skills to learn (comma separated)"
              className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateProfile}
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
