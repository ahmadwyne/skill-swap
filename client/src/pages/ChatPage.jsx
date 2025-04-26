// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatWindow from '../components/chat/ChatWindow';
import SessionSchedulingModal from '../components/session/SessionSchedulingModal';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const socketIo = io('http://localhost:5000'); // Backend URL for Socket.io
    setSocket(socketIo);

    // Listen for incoming messages
    socketIo.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = (data) => {
    socket.emit('send_message', data);
    setMessages((prevMessages) => [...prevMessages, data]); // Add the sent message locally
  };

  const scheduleSession = (sessionDetails) => {
    // Implement session scheduling logic (send to backend or save locally)
    console.log('Session Scheduled:', sessionDetails);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="chat-page min-h-screen bg-gray-50">
      <h1 className="text-3xl text-center my-6">Chat with Your Match</h1>
      <ChatWindow messages={messages} sendMessage={sendMessage} />
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-blue-600 text-white p-3 rounded-lg mt-4 mx-auto block"
      >
        Schedule a Session
      </button>

      <SessionSchedulingModal 
        isOpen={isModalOpen} 
        closeModal={closeModal} 
        scheduleSession={scheduleSession} 
      />
    </div>
  );
};

export default ChatPage;