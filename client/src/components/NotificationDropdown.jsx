// src/components/NotificationDropdown.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead } from '../redux/slices/notificationSlice';
import axios from 'axios';  // Import axios here

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);  // State to toggle the dropdown visibility
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id)); // Mark notification as read in Redux

    // Persist the update to the backend
    const token = localStorage.getItem('token');
    axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
      headers: { 'x-auth-token': token },
    }).catch((err) => {
      console.error('Error updating read status in backend:', err.message);
    });
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.isRead) {
        dispatch(markAsRead(notification._id));  // Update in Redux state

        // Persist the change to the backend
        const token = localStorage.getItem('token');
        axios.patch(`http://localhost:5000/api/notifications/${notification._id}/read`, {}, {
          headers: { 'x-auth-token': token },
        }).catch((err) => {
          console.error('Error marking all notifications as read:', err.message);
        });
      }
    });
  };

  const toggleFilter = (filterType) => {
    if (filter === filterType) {
      setFilter('all');
    } else {
      setFilter(filterType);
    }
  };

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true; // Show all notifications when filter is 'all'
  });

  // Close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.notification-dropdown') === null) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-md notification-dropdown">
      {/* Filter Buttons */}
      <div className="flex justify-between p-2 border-b border-gray-200">
        <button
          onClick={() => toggleFilter('unread')}            className={`text-sm ${filter === 'unread' ? 'font-bold text-blue-700' : 'text-blue-500'} hover:text-blue-700`}
        >
          Unread
        </button>
        <button
          onClick={() => toggleFilter('read')}
          className={`text-sm ${filter === 'read' ? 'font-bold text-blue-700' : 'text-blue-500'} hover:text-blue-700`}
        >
          Read
        </button>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <ul className="max-h-60 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-2 ${!notification.isRead ? 'bg-gray-100' : ''}`}
              onClick={() => handleMarkAsRead(notification._id)}  // Mark as read on click
            >
              {notification.message}
            </li>
          ))
        ) : (
          <li className="p-2">No notifications</li>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;