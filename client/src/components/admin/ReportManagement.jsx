// client/src/components/admin/ReportManagement.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReports,
  resolveReport
} from '../../redux/slices/adminSlice';

const ReportManagement = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleResolve = id => {
    dispatch(resolveReport(id))
      .then(() => dispatch(fetchReports()));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Report Management</h2>

      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {Array.isArray(reports) && reports.map(r => (
            <div
              key={r._id}
              className="p-4 bg-white shadow rounded border-l-4 border-blue-600"
            >
              <p>
                <span className="font-semibold">Reporter:</span>{' '}
                {r.reporter.name} ({r.reporter.email})
              </p>
              {r.targetUser && (
                <p>
                  <span className="font-semibold">Target User:</span>{' '}
                  {r.targetUser.name} ({r.targetUser.email})
                </p>
              )}
              {r.session && (
                <p>
                  <span className="font-semibold">Session ID:</span>{' '}
                  {r.session._id}
                </p>
              )}
              <p>
                <span className="font-semibold">Reason:</span> {r.reason}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={
                    r.status === 'open'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }
                >
                  {r.status}
                </span>
              </p>
              {r.status === 'open' && (
                <button
                  onClick={() => handleResolve(r._id)}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
