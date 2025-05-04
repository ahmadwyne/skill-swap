import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar'; // Import Navbar
import MessageInput from '../components/chat/MessageInput'; // Import MessageInput
import { useNavigate, useParams } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';

const ChatPage = () => {
  const { sessionId } = useParams(); // Get sessionId from URL parameter
  const [connections, setConnections] = useState([]); // List of connections
  const [selectedConnection, setSelectedConnection] = useState(null); // Selected connection for chat
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [messages, setMessages] = useState([]); // List of messages in the current chat
  const [socket, setSocket] = useState(null); // Socket connection
  const [notificationSocket, setNotificationSocket] = useState(null); // Notification socket connection
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

  // Set up Socket.io connection (only once)
  useEffect(() => {
    if (!sessionId) {
      console.error("Session ID is undefined.");
      return;
    }

    const socketIo = io('http://localhost:5000/sessions', {
      transports: ['websocket'],
      query: { sessionId },
    });

    socketIo.on('connect', () => {
      console.log('WebSocket connected:', socketIo.id);
    });

    socketIo.on('receive_message', (data) => {
      console.log('Received message:', data);

      if (data.sender && data.receiver) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            senderName: data.sender.name,
            receiverName: data.receiver.name,
          },
        ]);
      }
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [sessionId]);

  // Set up the **Notification Socket.io connection** (separate from the chat socket)
  useEffect(() => {
    const socketIoNotification = io('http://localhost:5000/notifications', {
      transports: ['websocket'],
    });

    socketIoNotification.on('connect', () => {
      console.log('Notification WebSocket connected:', socketIoNotification.id);
    });

    setNotificationSocket(socketIoNotification);

    // Subscribe the user to notifications (you need to pass the userId from localStorage)
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    socketIoNotification.emit('subscribeToNotifications', userId);

    return () => {
      socketIoNotification.disconnect();
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

          const updatedMessages = response.data.map((msg) => ({
            ...msg,
            senderName: msg.senderId?.name || 'Unknown',
            receiverName: msg.receiverId?.name || 'Unknown',
          }));

          setMessages(updatedMessages);
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
  const handleSendMessage = (message, file) => {
    console.log('Message to send:', message);  // Debugging: log the message
    console.log('File to send:', file);  // Debugging: log the file

    if (message.trim() === '' && !file) {
      console.log('No message or file to send');  // Debugging: log when no message or file
      return;
    }

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));

    const formData = new FormData();
    formData.append('sessionId', selectedConnection._id);  // Ensure sessionId is correctly included
    formData.append('content', message);  // Append message content

    if (file) {
      formData.append('file', file);  // Append file if available
      console.log('File appended to FormData:', file); // Debugging: log file data
    }

    // Emit message to server (via Socket.IO) with or without file
    socket.emit('send_message', {
      sessionId: selectedConnection._id,
      content: message,
      senderId: userData?._id,
      receiverId: selectedConnection.userId1._id === userData?._id ? selectedConnection.userId2._id : selectedConnection.userId1._id,
      file: file,
    });

    // Store the message in the backend
    axios.post('http://localhost:5000/api/sessions/message', formData, {
      headers: { 'x-auth-token': token },
    })
      .then((response) => {
        console.log('Message sent successfully:', response.data);
      })
      .catch((err) => {
        console.error('Error sending message:', err.response || err);
      });
  };

  // Open schedule modal
  const openScheduleModal = () => {
    setIsModalOpen(true);
  };

  // Close schedule modal
  const closeScheduleModal = () => {
    setIsModalOpen(false);
  };

  // Schedule session (send API request to backend)
  const handleScheduleSession = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/sessions/schedule',
        {
          sessionId,
          newMeetingDate: scheduledDate,
          newMeetingTime: scheduledTime,
        },
        { headers: { 'x-auth-token': token } }
      );

      closeScheduleModal();
    } catch (error) {
      console.error('Error scheduling session:', error);
    }
  };

  return (
    <div className="chat-page min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
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
                  <p>{connection.userId1?.name || 'Unknown'}</p>
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
          {selectedConnection && (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Chat with {selectedConnection.userId1?.name || 'Unknown'}
              </h2>
              <div className="messages-container bg-white p-4 rounded-lg shadow-lg mb-6">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className="message">
                      <p><strong>{msg.senderName}: </strong>{msg.content}</p>
                      {msg.mediaType === 'image' && <img src={msg.mediaUrl} alt="file" className="max-w-xs" />}
                      {msg.mediaType === 'audio' && <audio controls><source src={msg.mediaUrl} /></audio>}
                      {msg.mediaType === 'video' && <video controls><source src={msg.mediaUrl} /></video>}
                    </div>
                  ))
                ) : (
                  <p>No messages yet</p>
                )}
              </div>
              <MessageInput sendMessage={handleSendMessage} />
              {/* Button to open the schedule modal */}
              <button
                onClick={openScheduleModal}
                className="bg-blue-600 text-white p-2 rounded-lg"
              >
                Schedule Next Meeting
              </button>

              {/* Schedule Modal */}
              {isModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h2 className="text-xl">Schedule Next Meeting</h2>
                    <div className="flex flex-col space-y-2">
                      <label>
                        <FiCalendar /> Select Date:
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="border p-2 rounded"
                        />
                      </label>
                      <label>
                        <FiClock /> Select Time:
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="border p-2 rounded"
                        />
                      </label>
                    </div>
                    <button
                      onClick={handleScheduleSession}
                      className="bg-green-600 text-white p-2 rounded-lg mt-4"
                    >
                      Confirm Schedule
                    </button>
                    <button
                      onClick={closeScheduleModal}
                      className="bg-red-600 text-white p-2 rounded-lg mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
