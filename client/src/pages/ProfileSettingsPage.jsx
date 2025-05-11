// src/pages/ProfileSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/profileSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import defaultAvatar from '../assets/avatar.jpeg';

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    status: '',
    socials: { linkedin: '', facebook: '', twitter: '' },
    skillsToTeach: '',
    skillsToLearn: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    currentPasswordVisible: false,
    newPasswordVisible: false,
    confirmNewPasswordVisible: false
  });
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { 'x-auth-token': token },
        });
        const data = res.data;
        setFormData({
          name: data.name || '',
          profilePicture: data.profilePicture || '',
          status: data.status || '',
          socials: data.socials || { linkedin: '', facebook: '', twitter: '' },
          skillsToTeach: (data.skillsToTeach || []).join(','),
          skillsToLearn: (data.skillsToLearn || []).join(',')
        });
        // If there’s an existing picture on server, show its URL
        if (data.profilePicture) {
          setImagePreview(`http://localhost:5000/uploads/profile-pictures/${data.profilePicture}`);
        } else {
          setImagePreview(null);
        }
      } catch {
        setMessage('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  // Build the final src for <img>
  const avatarSrc = imagePreview
    ? imagePreview
    : formData.profilePicture
      ? `http://localhost:5000/uploads/profile-pictures/${formData.profilePicture}`
      : defaultAvatar;

  // Handle profile update
  const handleUpdate = async () => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('status', formData.status);
    payload.append('skillsToTeach', formData.skillsToTeach);
    payload.append('skillsToLearn', formData.skillsToLearn);
    payload.append('socials[linkedin]', formData.socials.linkedin);
    payload.append('socials[facebook]', formData.socials.facebook);
    payload.append('socials[twitter]', formData.socials.twitter);
    if (formData.profilePicture instanceof File) {
      payload.append('profilePicture', formData.profilePicture);
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', payload, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(setUser(res.data));
      setMessage('Profile updated successfully!');
      navigate('/profile');
    } catch {
      setMessage('Update failed. Please try again.');
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage("Passwords don't match!");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/change-password',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        },
        { headers: { 'x-auth-token': token } }
      );
      setMessage('Password updated successfully!');
    } catch {
      setMessage('Password update failed. Please try again.');
    }
  };

  // Handle selecting a new image
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {message && <div className="mb-4 text-green-600">{message}</div>}

        {/* Avatar + Upload */}
        <div className="mb-6 flex justify-center">
          <label htmlFor="profilePicture" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center relative overflow-hidden">
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute top-0 right-0 m-1">
                <FaEdit className="text-white bg-gray-700 rounded-full p-1.5 cursor-pointer hover:bg-blue-500 transition" />
              </div>
            </div>
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Text Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={formData.socials.linkedin}
            onChange={e =>
              setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })
            }
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Facebook URL"
            value={formData.socials.facebook}
            onChange={e =>
              setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })
            }
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Twitter URL"
            value={formData.socials.twitter}
            onChange={e =>
              setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })
            }
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Skills You Can Teach (comma-separated)"
            value={formData.skillsToTeach}
            onChange={e => setFormData({ ...formData, skillsToTeach: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Skills You Want to Learn (comma-separated)"
            value={formData.skillsToLearn}
            onChange={e => setFormData({ ...formData, skillsToLearn: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>

        {/* Change Password */}
        <div className="mt-8 pt-6 border-t space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Change Password</h3>

          {[
            { key: 'currentPassword', placeholder: 'Current Password', visibleKey: 'currentPasswordVisible' },
            { key: 'newPassword', placeholder: 'New Password', visibleKey: 'newPasswordVisible' },
            { key: 'confirmNewPassword', placeholder: 'Confirm New Password', visibleKey: 'confirmNewPasswordVisible' }
          ].map(({ key, placeholder, visibleKey }) => (
            <div key={key} className="relative">
              <input
                type={passwords[visibleKey] ? 'text' : 'password'}
                placeholder={placeholder}
                value={passwords[key]}
                onChange={e => setPasswords(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
              <div
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setPasswords(prev => ({ ...prev, [visibleKey]: !prev[visibleKey] }))
                }
              >
                {passwords[visibleKey] ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
          ))}

          <button
            onClick={handlePasswordChange}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
