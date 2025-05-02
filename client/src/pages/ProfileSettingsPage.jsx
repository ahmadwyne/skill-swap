import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    status: '',
    socials: { linkedin: '', facebook: '', twitter: '' },
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { 'x-auth-token': token },
      });
      setFormData({
        name: res.data.name || '',
        profilePicture: res.data.profilePicture || '',
        status: res.data.status || '',
        socials: res.data.socials || {},
      });
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { 'x-auth-token': token },
      });
      setMessage('Profile updated!');
    } catch {
      setMessage('Update failed.');
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/change-password', passwords, {
        headers: { 'x-auth-token': token },
      });
      setMessage('Password updated!');
    } catch {
      setMessage('Password change failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {message && <div className="mb-4 text-green-600">{message}</div>}

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-3 p-3 border rounded"
        />

        <input
          type="text"
          placeholder="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full mb-3 p-3 border rounded"
        />

        <input
          type="text"
          placeholder="Profile Picture URL"
          value={formData.profilePicture}
          onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
          className="w-full mb-3 p-3 border rounded"
        />

        <input
          type="text"
          placeholder="LinkedIn"
          value={formData.socials.linkedin || ''}
          onChange={(e) =>
            setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })
          }
          className="w-full mb-3 p-3 border rounded"
        />

        <input
          type="text"
          placeholder="Facebook"
          value={formData.socials.facebook || ''}
          onChange={(e) =>
            setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })
          }
          className="w-full mb-3 p-3 border rounded"
        />

        <input
          type="text"
          placeholder="Twitter"
          value={formData.socials.twitter || ''}
          onChange={(e) =>
            setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })
          }
          className="w-full mb-3 p-3 border rounded"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mb-6"
        >
          Save Changes
        </button>

        <h3 className="text-xl font-semibold mb-2">Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          className="w-full mb-3 p-3 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          className="w-full mb-3 p-3 border rounded"
        />

        <button
          onClick={handlePasswordChange}
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
