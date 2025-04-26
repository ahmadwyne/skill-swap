// src/components/chat/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage({ message, sender: 'User' }); // You can adjust the sender dynamically
      setMessage('');
    }
  };

  return (
    <div className="message-input flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={handleSendMessage} className="ml-2 bg-blue-600 text-white p-3 rounded-lg">
        Send
      </button>
    </div>
  );
};

export default MessageInput;