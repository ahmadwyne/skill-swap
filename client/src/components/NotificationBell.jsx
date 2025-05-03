// src/components/NotificationBell.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '../redux/slices/notificationSlice';
import io from 'socket.io-client';
import NotificationDropdown from './NotificationDropdown'; // Import dropdown component

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Manage dropdown visibility

  useEffect(() => {
    // Connect to the server with polling
    const socket = io('http://localhost:5000/notifications');

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      dispatch(setNotifications([notification]));  // Add new notification to Redux store
    });

    return () => {
      socket.disconnect();  // Clean up socket connection when component unmounts
    };
  }, [dispatch]);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      {/* Bell Icon */}
      <button className="relative text-gray-700" onClick={toggleDropdown}>
        <i className="fas fa-bell text-5xl"></i>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 text-xs text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isDropdownOpen && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;
