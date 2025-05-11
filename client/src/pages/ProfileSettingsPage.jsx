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
import Background from '../components/background/Background';
import '../components/background/Background.css';
import Footer from '../components/footer/Footer';

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
        const res = await axios.get(
          'http://localhost:5000/api/users/profile',
          { headers: { 'x-auth-token': token } }
        );
        const data = res.data;
        setFormData({
          name: data.name || '',
          profilePicture: data.profilePicture || '',
          status: data.status || '',
          socials: data.socials || { linkedin: '', facebook: '', twitter: '' },
          skillsToTeach: data.skillsToTeach ? data.skillsToTeach.join(', ') : '',
          skillsToLearn: data.skillsToLearn ? data.skillsToLearn.join(', ') : ''
        });
        if (data.profilePicture) {
          setImagePreview(
            `http://localhost:5000/uploads/profile-pictures/${data.profilePicture}`
          );
        }
      } catch {
        setMessage('Failed to load profile data.');
      }
    };
    fetchProfile();
  }, []);

  // Determine which avatar to show
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

  // Add each skill as a separate field in FormData
  const skillsToTeachArray = formData.skillsToTeach.split(',').map((s) => s.trim()).filter((s) => s !== ''); // Create an array of skills
  const skillsToLearnArray = formData.skillsToLearn.split(',').map((s) => s.trim()).filter((s) => s !== ''); // Create an array of skills

  // Append each skill separately to FormData
  skillsToTeachArray.forEach((skill, index) => {
    payload.append('skillsToTeach[]', skill); // The '[]' syntax will ensure they are treated as an array
  });

  skillsToLearnArray.forEach((skill, index) => {
    payload.append('skillsToLearn[]', skill); // Same for skillsToLearn
  });

  // Add socials and profile picture as usual
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
        'Content-Type': 'multipart/form-data',
      },
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
      await axios.put(
        'http://localhost:5000/api/users/change-password',
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

  // Handle image upload & preview
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background layer */}
      <Background />

      {/* Foreground content */}
      <div className="relative z-10 bg-transparent">
        <Navbar />

        <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 max-w-xl mx-auto p-6 shadow-lg rounded-xl mt-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Edit Profile</h2>
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

          {/* Form fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-1 font-semibold text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block mb-1 font-semibold text-gray-700">
                Status
              </label>
              <input
                id="status"
                type="text"
                placeholder="Status"
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedin" className="block mb-1 font-semibold text-gray-700">
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                type="text"
                placeholder="LinkedIn URL"
                value={formData.socials.linkedin}
                onChange={e =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, linkedin: e.target.value }
                  })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Facebook URL */}
            <div>
              <label htmlFor="facebook" className="block mb-1 font-semibold text-gray-700">
                Facebook URL
              </label>
              <input
                id="facebook"
                type="text"
                placeholder="Facebook URL"
                value={formData.socials.facebook}
                onChange={e =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, facebook: e.target.value }
                  })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Twitter URL */}
            <div>
              <label htmlFor="twitter" className="block mb-1 font-semibold text-gray-700">
                Twitter URL
              </label>
              <input
                id="twitter"
                type="text"
                placeholder="Twitter URL"
                value={formData.socials.twitter}
                onChange={e =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, twitter: e.target.value }
                  })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Skills You Can Teach */}
            <div>
              <label htmlFor="skillsToTeach" className="block mb-1 font-semibold text-gray-700">
                Skills You Can Teach (comma-separated)
              </label>
              <input
                id="skillsToTeach"
                type="text"
                placeholder="e.g. JavaScript, Design"
                value={formData.skillsToTeach}
                onChange={e =>
                  setFormData({ ...formData, skillsToTeach: e.target.value })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Skills You Want to Learn */}
            <div>
              <label htmlFor="skillsToLearn" className="block mb-1 font-semibold text-gray-700">
                Skills You Want to Learn (comma-separated)
              </label>
              <input
                id="skillsToLearn"
                type="text"
                placeholder="e.g. Go, Machine Learning"
                value={formData.skillsToLearn}
                onChange={e =>
                  setFormData({ ...formData, skillsToLearn: e.target.value })
                }
                className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

          {/* Change Password */}
          <div className="mt-8 pt-6 border-t space-y-6">
            {[
              {
                key: 'currentPassword',
                placeholder: 'Current Password',
                visibleKey: 'currentPasswordVisible',
                label: 'Current Password',
                id: 'currentPassword'
              },
              {
                key: 'newPassword',
                placeholder: 'New Password',
                visibleKey: 'newPasswordVisible',
                label: 'New Password',
                id: 'newPassword'
              },
              {
                key: 'confirmNewPassword',
                placeholder: 'Confirm New Password',
                visibleKey: 'confirmNewPasswordVisible',
                label: 'Confirm New Password',
                id: 'confirmNewPassword'
              }
            ].map(({ key, placeholder, visibleKey, label, id }) => (
              <div key={key} className="relative">
                <label htmlFor={id} className="block mb-1 font-semibold text-gray-700">
                  {label}
                </label>
                <input
                  id={id}
                  type={passwords[visibleKey] ? 'text' : 'password'}
                  placeholder={placeholder}
                  value={passwords[key]}
                  onChange={e =>
                    setPasswords(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))
                  }
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
                <div
                  className="absolute top-10 right-3 cursor-pointer"
                  onClick={() =>
                    setPasswords(prev => ({
                      ...prev,
                      [visibleKey]: !prev[visibleKey]
                    }))
                  }
                >
                  {passwords[visibleKey] ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
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

        <Footer />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
