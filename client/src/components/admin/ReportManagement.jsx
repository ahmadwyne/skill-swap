import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReports,
  resolveReport,
  fetchSessionChats,
  blockUser
} from '../../redux/slices/adminSlice';
import { FaComments } from 'react-icons/fa';

const ReportManagement = () => {
  const dispatch = useDispatch();
  const {
    reports,
    loading,
    error,
    sessionChats,
    loadingChats,
    errorChats
  } = useSelector(state => state.admin);

  // New state for showing a blocked-user banner
  const [blockedUserName, setBlockedUserName] = useState('');
  const [activeSession, setActiveSession] = useState('');

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleResolve = id => {
    dispatch(resolveReport(id)).then(() => dispatch(fetchReports()));
  };

  const handleBlock = (userId, userName) => {
    dispatch(blockUser(userId))
      .then(() => {
        // refresh reports
        dispatch(fetchReports());
        // show banner
        setBlockedUserName(userName);
      });
  };

  const viewChats = sessionId => {
    setActiveSession(sessionId);
    dispatch(fetchSessionChats(sessionId));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Blocked user banner */}
      {blockedUserName && (
        <div className="flex justify-between items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>
            User <strong>{blockedUserName}</strong> has been blocked successfully.
          </span>
          <button
            onClick={() => setBlockedUserName('')}
            className="text-red-700 font-bold hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4 text-blue-900 text-left">
        Report Management
      </h2>

      {loading && (
        <p className="text-white animate-pulse">Loading reports...</p>
      )}
      {error && <p className="text-red-400">{error}</p>}

      <div className="space-y-6">
        {reports.map(r => (
          <div
            key={r._id}
            className="p-6 bg-blue-900 text-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Report Header */}
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div className="space-y-1 text-left">
                <p>
                  <span className="font-bold">Reporter:</span>{' '}
                  {r.reporter.name} ({r.reporter.email})
                </p>
                {r.targetUser && (
                  <p>
                    <span className="font-bold">Target User:</span>{' '}
                    {r.targetUser.name} ({r.targetUser.email})
                  </p>
                )}
                {r.session && (
                  <p>
                    <span className="font-bold">Session ID:</span>{' '}
                    {r.session._id}
                  </p>
                )}
              </div>

              <button
                onClick={() => viewChats(r.session._id)}
                className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
              >
                <FaComments /> View Chats
              </button>
            </div>

            {/* Report Body */}
            <div className="space-y-3 text-left">
              <p>
                <span className="font-bold">Description:</span> {r.description}
              </p>

              {r.screenshot && (
                <div>
                  <span className="font-bold">Screenshot:</span>
                  <a
                    href={`http://localhost:5000${r.screenshot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:5000${r.screenshot}`}
                      alt="Report screenshot"
                      className="mt-2 w-32 h-32 object-cover rounded border-2 border-white shadow"
                    />
                  </a>
                </div>
              )}

              <p>
                <span className="font-bold">Reason:</span> {r.reason}
              </p>
              <p>
                <span className="font-bold">Status:</span>{' '}
                <span
                  className={
                    r.status === 'open' ? 'text-yellow-300' : 'text-green-300'
                  }
                >
                  {r.status}
                </span>
              </p>
            </div>

            {/* Actions */}
            {r.status === 'open' && r.targetUser && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleResolve(r._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleBlock(r.targetUser._id, r.targetUser.name)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
                >
                  Block User
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Viewer */}
      {activeSession && (
        <div className="mt-8 p-6 bg-blue-100 rounded-lg shadow-inner animate-fadeIn">
          <h3 className="text-xl font-bold text-blue-900 mb-4 text-left">
            Chat History for Session{' '}
            <span className="font-mono text-blue-700">{activeSession}</span>
          </h3>

          {loadingChats && (
            <p className="text-blue-700 animate-pulse">Loading chats…</p>
          )}
          {errorChats && <p className="text-red-500">{errorChats}</p>}

          <div className="max-h-96 overflow-y-auto space-y-4">
            {sessionChats.map(msg => (
              <div
                key={msg._id}
                className={`p-3 rounded-lg shadow ${
                  msg.senderId._id === msg.receiverId._id
                    ? 'bg-blue-200'
                    : 'bg-white'
                } transition duration-200`}
              >
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className="font-bold">{msg.senderId.name}</span>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                {msg.content && <p className="text-gray-800">{msg.content}</p>}
                {msg.mediaUrl && msg.mediaType === 'image' && (
                  <img
                    src={msg.mediaUrl}
                    alt="attachment"
                    className="mt-2 max-w-full rounded shadow"
                  />
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
