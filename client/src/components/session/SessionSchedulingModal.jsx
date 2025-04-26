// src/components/session/SessionSchedulingModal.jsx
import React, { useState } from 'react';

const SessionSchedulingModal = ({ isOpen, closeModal, scheduleSession, selectedUserId }) => {
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');

  const handleSubmit = () => {
    if (sessionDate && sessionTime) {
      scheduleSession({ sessionDate, sessionTime }); // Pass the details to the parent function
      closeModal(); // Close the modal after scheduling
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold text-center mb-4">Schedule a Session</h2>
        <div>
          <label className="block text-lg">Select Date:</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
          />
        </div>
        <div>
          <label className="block text-lg">Select Time:</label>
          <input
            type="time"
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
          />
        </div>
        <div className="flex justify-between">
          <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white py-2 px-4 rounded-lg">Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default SessionSchedulingModal;