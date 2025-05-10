import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEngagementStats } from '../../redux/slices/adminSlice';

const Card = ({ title, data }) => (
  <div className="bg-white rounded shadow p-4 w-full sm:w-[48%] lg:w-[31%]">
    <h3 className="text-blue-900 font-semibold text-lg mb-2">{title}</h3>
    <ul className="list-disc list-inside text-gray-700">
      {data.length === 0 ? (
        <li>No data available</li>
      ) : (
        data.map((item, i) => (
          <li key={i}>
            {typeof item === 'string'
              ? item
              : `${item.name || item.skill || item.user || 'N/A'} (${item.count || item.sessions || 0})`}
          </li>
        ))
      )}
    </ul>
  </div>
);

const EngagementAnalytics = () => {
  const dispatch = useDispatch();
  const { engagementStats, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchEngagementStats());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Engagement Analytics</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          <Card title="Top Skills Taught" data={engagementStats.topSkillsTaught || []} />
          <Card title="Top Skills Learned" data={engagementStats.topSkillsLearned || []} />
          <Card title="Most Active Users" data={engagementStats.mostActiveUsers || []} />
          <Card title="Session Status" data={Object.entries(engagementStats.sessionStatus || {}).map(
            ([status, count]) => ({ name: status, count })
          )} />
        </div>
      )}
    </div>
  );
};

export default EngagementAnalytics;
