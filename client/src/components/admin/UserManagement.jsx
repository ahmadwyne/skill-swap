// client/src/components/admin/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  addUser,
  deleteUser
} from '../../redux/slices/adminSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.admin);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = e => {
    e.preventDefault();
    dispatch(addUser(formData))
      .then(() => {
        setFormData({ name: '', email: '', password: '', role: 'user' });
        dispatch(fetchUsers());
      });
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
        .then(() => dispatch(fetchUsers()));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">User Management</h2>

      {/* Add New User Form Section */}
      <div className="mb-10 p-6 border-2 border-blue-700 rounded-lg bg-white shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-blue-700">Add New User</h3>
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border border-blue-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-blue-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="border border-blue-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border border-blue-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-700 hover:bg-blue-800 transition-colors text-white font-semibold px-5 py-2 rounded shadow-md"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users Table Section */}
      <div className="border-2 border-blue-700 rounded-lg bg-blue-900 shadow-lg overflow-hidden">
        {loading ? (
          <p className="text-white p-4">Loading users...</p>
        ) : error ? (
          <p className="text-red-300 p-4">{error}</p>
        ) : (
          <table className="w-full text-white">
            <thead className="bg-blue-900 font-bold border-b border-white">
              <tr>
                <th className="p-3 text-center border-r border-white">Name</th>
                <th className="p-3 text-center border-r border-white">Email</th>
                <th className="p-3 text-center border-r border-white">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.map((u) => (
                <tr key={u._id ?? u.id} className=" bg-blue-400 border-t border-white">
                  <td className="p-3 text-center border-r border-white">{u.name}</td>
                  <td className="p-3 text-center border-r border-white">{u.email}</td>
                  <td className="p-3 text-center border-r border-white capitalize">{u.role}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
