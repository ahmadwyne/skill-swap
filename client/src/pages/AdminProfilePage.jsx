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

    const updatedData = {
      ...form
    };

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
      className="
        max-w-3xl
        mx-auto
        space-y-8
        h-[calc(100vh-4rem)]
        overflow-y-auto
        px-4 py-6
        scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
      "
      style={{ scrollbarGutter: 'stable' }}
    >
      <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>

      <form
        onSubmit={onProfileSubmit}
        className="bg-white p-6 rounded shadow space-y-6"
      >
        {error && <p className="text-red-500">{error}</p>}
        {passwordMessage && <p className="text-green-600">{passwordMessage}</p>}

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onFormChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {form.profilePicture && (
          <div>
            <img
              src={form.profilePicture}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        <hr className="my-4" />

        <h2 className="text-lg font-semibold">Change Password</h2>
        <div>
          <label className="block mb-1 font-medium">Current Password</label>
          <input
            name="currentPassword"
            type="password"
            value={passwords.currentPassword}
            onChange={onPwdChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            name="newPassword"
            type="password"
            value={passwords.newPassword}
            onChange={onPwdChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={passwords.confirmPassword}
            onChange={onPwdChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <hr className="my-4" />

        <div className="text-gray-500 text-sm">
          <span>Account Created: </span>
          {new Date(form.createdAt).toLocaleString()}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
