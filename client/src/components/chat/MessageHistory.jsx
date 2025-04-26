// src/components/chat/MessageHistory.jsx
import React from 'react';

const MessageHistory = ({ messages }) => {
  return (
    <div className="message-history overflow-y-scroll h-60 mb-4 p-2 border-b-2 border-gray-200">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender === 'User' ? 'text-right' : 'text-left'}`}>
          <p className={`text-sm ${msg.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-2 rounded-lg max-w-xs mx-auto`}>
            <strong>{msg.sender}: </strong>{msg.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageHistory;