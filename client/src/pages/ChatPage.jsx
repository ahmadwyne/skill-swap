import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar'; // Import Navbar
import { useNavigate, useParams } from 'react-router-dom';

const ChatPage = () => {
  const { sessionId } = useParams(); // Get sessionId from URL parameter
  const [connections, setConnections] = useState([]); // List of connections
  const [selectedConnection, setSelectedConnection] = useState(null); // Selected connection for chat
  const [messages, setMessages] = useState([]); // List of messages in the current chat
  const [newMessage, setNewMessage] = useState(''); // New message to send
  const [socket, setSocket] = useState(null); // Socket connection
  const navigate = useNavigate();

  // Fetch accepted session connections
  useEffect(() => {
    const fetchConnections = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/sessions/accepted', {
          headers: { 'x-auth-token': token },
        });
        setConnections(response.data);

        // If there is a sessionId in the URL, select that connection automatically
        if (sessionId) {
          const connection = response.data.find(
            (conn) => conn._id === sessionId
          );
          setSelectedConnection(connection);
        }
      } catch (err) {
        console.error('Error fetching connections:', err);
      }
    };

    fetchConnections();
  }, [sessionId]);

  // Set up Socket.io connection
  useEffect(() => {
    const socketIo = io('http://localhost:5000');
    setSocket(socketIo);

    socketIo.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Fetch messages for the selected connection
  useEffect(() => {
    if (selectedConnection) {
      const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:5000/api/sessions/message/${selectedConnection._id}`, {
            headers: { 'x-auth-token': token },
          });
          setMessages(response.data);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };

      fetchMessages();
    }
  }, [selectedConnection]);

  // Handle selecting a connection for chat
  const handleSelectConnection = (connection) => {
    setSelectedConnection(connection);
    navigate(`/chat/${connection._id}`); // Navigate to the chat page with selected sessionId
  };

  // Send a message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const token = localStorage.getItem('token');
    const messageData = { sessionId: selectedConnection._id, content: newMessage };

    // Emit message via Socket.io
    socket.emit('send_message', messageData);

    // Save the message to the backend
    axios.post('http://localhost:5000/api/sessions/message', messageData, {
      headers: { 'x-auth-token': token },
    }).then(() => {
      setNewMessage('');
    }).catch((err) => {
      console.error('Error sending message:', err);
    });
  };

  return (
    <div className="chat-page min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar on top */}
      <Navbar /> {/* Always display Navbar on top */}

      {/* Main layout for the chat */}
      <div className="flex flex-1">
        {/* Left Panel: List of Connections */}
        <div className="left-panel w-1/4 bg-gray-100 p-4">
          <h2 className="text-xl font-semibold">Connections</h2>
          <div className="space-y-4 mt-4">
            {connections.length > 0 ? (
              connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer"
                  onClick={() => handleSelectConnection(connection)}
                >
                  <p>{connection.userId1.name}</p>
                  <p>{connection.sessionDate} at {connection.sessionTime}</p>
                </div>
              ))
            ) : (
              <p>No connections available.</p>
            )}
          </div>
        </div>

        {/* Right Panel: Chat with Selected Connection */}
        <div className="chat-container w-3/4 p-4">
          {selectedConnection ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Chat with {selectedConnection.userId1.name}</h2>
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
            </>
          ) : (
            <p>Select a connection to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
