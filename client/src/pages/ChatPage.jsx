// src/pages/ChatPage.jsx

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { sessionId } = useParams();  // Get sessionId from URL parameter
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io('http://localhost:5000');
    setSocket(socketIo);

    socketIo.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/sessions/message/${sessionId}`, {
          headers: { 'x-auth-token': token },
        });
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    return () => {
      socketIo.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const token = localStorage.getItem('token');
    const messageData = { sessionId, content: newMessage };

    socket.emit('send_message', messageData);

    axios.post('http://localhost:5000/api/sessions/message', messageData, {
      headers: { 'x-auth-token': token },
    }).then(() => {
      setNewMessage('');
    }).catch((err) => {
      console.error('Error sending message:', err);
    });
  };

  return (
    <div className="chat-page min-h-screen bg-gray-50">
      <h1 className="text-3xl text-center my-6">Chat with Your Match</h1>
      <div className="messages-container bg-white p-4 rounded-lg shadow-lg mb-6">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p><strong>{msg.senderId?.name || 'Unknown'}: </strong>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
        />
        <button onClick={handleSendMessage} className="bg-blue-600 text-white p-3 rounded-lg">
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ChatPage;