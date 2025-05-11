// src/redux/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [], // Store notifications
  unreadCount: 0, // Count unread notifications
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      const newNotifications = action.payload;
      state.notifications = newNotifications;  // Update with new notifications from the backend
      state.unreadCount = state.notifications.filter((notif) => !notif.isRead).length;  // Update unread count
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find((notif) => notif._id === notificationId);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = state.notifications.filter((notif) => !notif.isRead).length;  // Update unread count
      }
    },
  },
});

export const { setNotifications, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;