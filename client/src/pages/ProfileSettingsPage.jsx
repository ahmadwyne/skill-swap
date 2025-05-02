import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/profileSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import { FaEdit } from 'react-icons/fa'; // Ensure this is correct

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    status: '',
    socials: { linkedin: '', facebook: '', twitter: '' },
    skillsToTeach: '',
    skillsToLearn: ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch profile data
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
        skillsToTeach: res.data.skillsToTeach.join(',') || '',
        skillsToLearn: res.data.skillsToLearn.join(',') || ''
      });

      if (res.data.profilePicture) {
        setImagePreview(res.data.profilePicture); // Set the image preview if available
      } else {
        setImagePreview(null);  // Set imagePreview to null if no profile picture is found
      }
    };
    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    
    // Append all text fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('skillsToTeach', formData.skillsToTeach);
    formDataToSend.append('skillsToLearn', formData.skillsToLearn);
    
    // Append socials as an object (don't stringify)
    formDataToSend.append('socials[facebook]', formData.socials.facebook);
    formDataToSend.append('socials[twitter]', formData.socials.twitter);
    formDataToSend.append('socials[linkedin]', formData.socials.linkedin);    
    
    // If there's a profile picture, append it
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
  
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users/profile', formDataToSend, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data', // Set the content type to multipart
        },
      });
  
      dispatch(setUser(res.data)); // Update the Redux store
      setMessage('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
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
      const res = await axios.put('http://localhost:5000/api/users/change-password', passwords, {
        headers: { 'x-auth-token': token },
      });
      setMessage('Password updated successfully!');
    } catch (err) {
      setMessage('Password update failed. Please try again.');
    }
  };

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setImagePreview(URL.createObjectURL(file));  // Set the image preview
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {message && <div className="mb-4 text-green-600">{message}</div>}

        {/* Profile Picture Upload */}
        <div className="mb-4 flex justify-center relative">
          <label htmlFor="profilePicture" className="cursor-pointer">
            {/* Profile Picture Container */}
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center relative">
              {/* Profile Picture */}
              {imagePreview ? (
                <img
                  src={formData.profilePicture ? `http://localhost:5000/uploads/profile-pictures/${formData.profilePicture}` : '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full" // Keep it rounded
                />
              ) : (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
              )}
              <div className="absolute top-[-8px] right-[-8px] z-10">
              <FaEdit
                className="text-white bg-gray-700 rounded-full p-2 text-3xl cursor-pointer hover:bg-blue-500 transition"
              />
            </div>
            </div>
            
            {/* Pencil Icon */}
            
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Rest of the Profile Fields */}
        {/* Name, Status, Social Links, Skills */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Social Links */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="LinkedIn"
            value={formData.socials.linkedin || ''}
            onChange={(e) =>
              setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })
            }
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Facebook"
            value={formData.socials.facebook || ''}
            onChange={(e) =>
              setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })
            }
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Twitter"
            value={formData.socials.twitter || ''}
            onChange={(e) =>
              setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })
            }
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Skills */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Skills You Can Teach"
            value={formData.skillsToTeach}
            onChange={(e) => setFormData({ ...formData, skillsToTeach: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Skills You Want to Learn"
            value={formData.skillsToLearn}
            onChange={(e) => setFormData({ ...formData, skillsToLearn: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Save Changes
        </button>

        {/* Change Password Section */}
        <div className="mt-8 mb-4 border-t pt-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Change Password</h3>

          <input
            type="password"
            placeholder="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            className="w-full p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirmNewPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
            className="w-full p-3 mb-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handlePasswordChange}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;