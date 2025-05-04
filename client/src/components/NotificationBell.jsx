// src/components/NotificationBell.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '../redux/slices/notificationSlice';
import { FaBell } from 'react-icons/fa';
import io from 'socket.io-client';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000/notifications');
    socket.on('new_notification', (notification) => {
      dispatch(setNotifications([notification]));
    });
    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen((open) => !open)}
        className="w-14 h-14  bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-shadow shadow-md"
        title="Notifications"
      >
        <FaBell size={28} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isDropdownOpen && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;
