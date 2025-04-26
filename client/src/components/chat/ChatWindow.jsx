// src/components/chat/ChatWindow.jsx
import React from 'react';
import MessageHistory from './MessageHistory';
import MessageInput from './MessageInput';

const ChatWindow = ({ messages, sendMessage }) => {
  return (
    <div className="chat-window bg-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      <MessageHistory messages={messages} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;