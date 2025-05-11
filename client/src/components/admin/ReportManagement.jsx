import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReports,
  resolveReport,
  fetchSessionChats
} from '../../redux/slices/adminSlice';
import { FaComments } from 'react-icons/fa';

const ReportManagement = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, sessionChats, loadingChats, errorChats } = useSelector(state => state.admin);
  const [activeSession, setActiveSession] = useState('');

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleResolve = id => {
    dispatch(resolveReport(id)).then(() => dispatch(fetchReports()));
  };

  const viewChats = sessionId => {
    setActiveSession(sessionId);
    dispatch(fetchSessionChats(sessionId));
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Report Management</h2>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6">
        {reports.map(r => (
          <div
            key={r._id}
            className="p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p><span className="font-semibold">Reporter:</span> {r.reporter.name} ({r.reporter.email})</p>
                {r.targetUser && <p><span className="font-semibold">Target User:</span> {r.targetUser.name} ({r.targetUser.email})</p>}
                {r.session && <p><span className="font-semibold">Session ID:</span> {r.session._id}</p>}
              </div>

              <button
                onClick={() => viewChats(r.session._id)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <FaComments /> View Chats
              </button>
            </div>

            <p><span className="font-semibold">Reason:</span> {r.reason}</p>
            <p className="mt-1">
              <span className="font-semibold">Status:</span>
              <span className={r.status === 'open' ? 'text-yellow-600' : 'text-green-600'}>
                {' '}{r.status}
              </span>
            </p>

            <div className="mt-4 flex space-x-4">
              {r.status === 'open' && (
                <button
                  onClick={() => handleResolve(r._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Chat Viewer ────────────────────────────────────────────── */}
      {activeSession && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            Chat History for Session <span className="font-mono">{activeSession}</span>
          </h3>

          {loadingChats && <p>Loading chats…</p>}
          {errorChats && <p className="text-red-500">{errorChats}</p>}

          <div className="max-h-96 overflow-y-auto space-y-4">
            {sessionChats.map(msg => (
              <div
                key={msg._id}
                className={`p-3 rounded-lg ${
                  msg.senderId._id === msg.receiverId._id
                    ? 'bg-blue-100'
                    : 'bg-white'
                } shadow`}
              >
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold">{msg.senderId.name}</span>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                {msg.content && <p className="text-gray-800">{msg.content}</p>}
                {msg.mediaUrl && (
                  <div className="mt-2">
                    {msg.mediaType === 'image' && (
                      <img src={msg.mediaUrl} alt="attachment" className="max-w-full rounded" />
                    )}
                    {/* add video/audio if needed */}
                  </div>
                )}
              </div>
            ))}
            {!sessionChats.length && !loadingChats && (
              <p className="text-gray-500">No messages found for this session.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
