// client/src/components/admin/AnalyticsOverview.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../redux/slices/adminSlice';

const AnalyticsOverview = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Analytics Overview</h2>

      {loading ? (
        <p>Loading analytics...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white shadow rounded text-center">
            <p className="text-3xl font-semibold">{analytics.userCount}</p>
            {console.log(analytics.userCount)}
            <p className="mt-1 text-gray-600">Total Users</p>
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <p className="text-3xl font-semibold">{analytics.sessionCount}</p>
            <p className="mt-1 text-gray-600">Total Sessions</p>
            {console.log(analytics.sessionCount)}
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <p className="text-3xl font-semibold">{analytics.reportCount}</p>
            <p className="mt-1 text-gray-600">Total Reports</p>
            {console.log(analytics.reportCount)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsOverview;
