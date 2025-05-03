// client/src/pages/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  updateProfile,
  changePassword,
  clearPasswordMessage
} from '../redux/slices/adminProfileSlice';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, passwordMessage } = useSelector(s => s.profile);

  const [form, setForm] = useState({
    name: '',
    email: '',
    profilePicture: '',
    createdAt: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || '',
        createdAt: user.createdAt
      });
    }
  }, [user]);

  const onFormChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onPwdChange = e =>
    setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setForm(f => ({
        ...f,
        profilePicture: URL.createObjectURL(e.target.files[0])
      }));
    }
  };

  const onProfileSubmit = async e => {
    e.preventDefault();

    if (
      passwords.currentPassword &&
      passwords.newPassword !== passwords.confirmPassword
    ) {
      alert('New passwords do not match.');
      return;
    }

    const profileForm = new FormData();
    profileForm.append('name', form.name);
    if (profileImage) profileForm.append('profilePicture', profileImage);

    dispatch(updateProfile(profileForm));

    if (passwords.currentPassword && passwords.newPassword) {
      dispatch(
        changePassword({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      );
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto py-6 px-4 space-y-8 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      style={{ scrollbarGutter: 'stable' }}
    >
      <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>

      <form
        onSubmit={onProfileSubmit}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6 border border-gray-300"
      >
        {error && <p className="text-red-500">{error}</p>}
        {passwordMessage && <p className="text-green-600">{passwordMessage}</p>}

        <table className="w-full">
          <tbody>
            {/* Name Input */}
            <tr>
              <td className="text-sm font-medium text-gray-700">Name</td>
              <td>
                <input
                  name="name"
                  value={form.name}
                  onChange={onFormChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg py-1 px-3 mt-2"
                />
              </td>
            </tr>

            {/* Email Input */}
            <tr>
              <td className="text-sm font-medium text-gray-700">Email</td>
              <td>
                <input
                  name="email"
                  value={form.email}
                  disabled
                  className="w-full bg-gray-100 text-gray-600 border-gray-300 rounded-md shadow-sm sm:text-lg py-1 px-3 mt-2"
                />
              </td>
            </tr>

            {/* Profile Picture Upload */}
            <tr>
              <td className="text-sm font-medium text-gray-700">Upload Profile Picture</td>
              <td>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 py-1 px-3 mt-2"
                  >
                    Choose File
                  </label>
                </div>
              </td>
            </tr>

            {/* Profile Picture Preview
            {form.profilePicture && (
              <tr>
                <td colSpan="2" className="pt-4 text-center">
                  <img
                    src={form.profilePicture}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                </td>
              </tr>
            )} */}
            {form.profilePicture && (
              <tr>
                <td colSpan="2" className="pt-4 text-center">
                  <img
                    src={
                      // if user just picked a file, form.profilePicture is a blob:// URL
                      profileImage
                        ? form.profilePicture
                        // otherwise it's the filename stored in DB
                        : `http://localhost:5000/uploads/${form.profilePicture}`
                    }
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                </td>
              </tr>
            )}


            {/* Change Password Section */}
            <tr>
              <td colSpan="2" className="pt-8 text-lg font-semibold">
                Change Password
              </td>
            </tr>

            {/* Current Password Input */}
            <tr>
              <td className="text-sm font-medium text-gray-700">Current Password</td>
              <td>
                <input
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={onPwdChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg py-1 px-3 mt-2"
                />
              </td>
            </tr>

            {/* New Password Input */}
            <tr>
              <td className="text-sm font-medium text-gray-700">New Password</td>
              <td>
                <input
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={onPwdChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg py-1 px-3 mt-2"
                />
              </td>
            </tr>

            {/* Confirm New Password Input */}
            <tr>
              <td className="text-sm font-medium text-gray-700">Confirm New Password</td>
              <td>
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={onPwdChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg py-1 px-3 mt-2"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Account Creation Date */}
        <div className="mt-6 text-gray-500 text-sm">
          <span>Account Created: </span>
          {new Date(form.createdAt).toLocaleString()}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
