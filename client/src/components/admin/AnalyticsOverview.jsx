// client/src/components/admin/AnalyticsOverview.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../redux/slices/adminSlice';
import { motion } from 'framer-motion';

import usersImg from '../../assets/users.jpg';
import sessionsImg from '../../assets/sessions.jpg';
import reportsImg from '../../assets/reports.jpg';

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const containerVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6"
    >
      <h2 className="text-3xl font-bold mb-10 text-blue-700">Analytics Overview</h2>

      {loading ? (
        <p>Loading analytics...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* USERS CARD */}
          <motion.div
            variants={cardVariant}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center space-y-4"
          >
            <img
              src={usersImg}
              alt="Users"
              className="w-24 h-24 object-cover rounded-full border-2 border-blue-500"
            />
            <p className="text-4xl font-semibold text-blue-800">{analytics.userCount}</p>
            <p className="text-lg text-gray-600">Total Users</p>
          </motion.div>

          {/* SESSIONS CARD */}
          <motion.div
            variants={cardVariant}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center space-y-4"
          >
            <img
              src={sessionsImg}
              alt="Sessions"
              className="w-24 h-24 object-cover rounded-full border-2 border-green-500"
            />
            <p className="text-4xl font-semibold text-green-800">{analytics.sessionCount}</p>
            <p className="text-lg text-gray-600">Total Sessions</p>
          </motion.div>

          {/* REPORTS CARD */}
          <motion.div
            variants={cardVariant}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center space-y-4"
          >
            <img
              src={reportsImg}
              alt="Reports"
              className="w-24 h-24 object-cover rounded-full border-2 border-red-500"
            />
            <p className="text-4xl font-semibold text-red-800">{analytics.reportCount}</p>
            <p className="text-lg text-gray-600">Total Reports</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsOverview;
