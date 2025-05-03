// src/components/chat/MessageHistory.jsx
import React from 'react';

const MessageHistory = ({ messages }) => {
  return (
    <div className="message-history overflow-y-scroll h-60 mb-4 p-2 border-b-2 border-gray-200">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.senderId.id === 'user_id_here' ? 'text-right' : 'text-left'}`}>
          <p className={`text-sm ${msg.senderId.id === 'user_id_here' ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-2 rounded-lg max-w-xs mx-auto`}>
            <strong>{msg.senderId?.name || 'Unknown'}: </strong>
            {msg.content}
          </p>
          {msg.mediaUrl && msg.mediaType === 'image' && <img src={msg.mediaUrl} alt="Media" className="max-w-xs mx-auto mt-2" />}
          {msg.mediaUrl && msg.mediaType === 'video' && <video src={msg.mediaUrl} controls className="max-w-xs mx-auto mt-2" />}
          {msg.mediaUrl && msg.mediaType === 'audio' && <audio src={msg.mediaUrl} controls className="mx-auto mt-2" />}
        </div>
      ))}
    </div>
  );
};

export default MessageHistory;
