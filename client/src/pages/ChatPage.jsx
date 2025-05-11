import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar'; // Import Navbar
import MessageInput from '../components/chat/MessageInput'; // Import MessageInput
import { useNavigate, useParams } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { IoMdWarning } from 'react-icons/io'; // Importing a warning icon for the button

const ChatPage = () => {
  const { sessionId } = useParams(); // Get sessionId from URL parameter
  const [connections, setConnections] = useState([]); // List of connections
  const [selectedConnection, setSelectedConnection] = useState(null); // Selected connection for chat
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // Feedback Modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false); // Schedule Modal state
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [messages, setMessages] = useState([]); // List of messages in the current chat
  const [socket, setSocket] = useState(null); // Socket connection
  const [notificationSocket, setNotificationSocket] = useState(null); // Notification socket connection
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(false); // State for success message
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
    if (selectedConnection?.status === 'completed' || selectedConnection?.status === 'canceled') {
      alert('You cannot send messages for completed or canceled sessions.');
      return;
    }

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
    setIsScheduleModalOpen(true); // Open schedule modal
  };

  // Close schedule modal
  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false); // Close schedule modal
  };

  // Open feedback modal
  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true); // Open feedback modal
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false); // Close feedback modal
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
      
  // Handle marking session as completed or canceled
  const handleMarkSession = async (status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }

      if (!feedback) {
        alert('Please provide feedback before marking the session.');
        return;
      }

      console.log(`Marking session as ${status}`);

      await axios.post(
        'http://localhost:5000/api/sessions/mark-session',
        {
          sessionId,
          status,
          rating,
          feedback,
        },
        {
          headers: {
            'x-auth-token': token,  // Ensure the token is being sent correctly
          },
        }
      );
      console.log('Session marked successfully');

      setIsFeedbackModalOpen(false); // Close feedback modal after submission
      // Refresh session data to update the status
      const updatedSession = await axios.get('http://localhost:5000/api/sessions/accepted', {
        headers: {
          'x-auth-token': token, // Pass token for the session data request as well
        },
      });
      setSelectedConnection(updatedSession.data.find((session) => session._id === sessionId));
    } catch (error) {
      console.error('Error marking session:', error);
    }
  };

  // Open/close Report Modal
  const openReportModal = () => {
    setIsReportModalOpen(true);
    setReportSuccess(false); // Reset success state when opening the modal
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  // Handle Report Submit
const handleReportSubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submit behavior

  // Retrieve the logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  // if (!loggedInUser || !loggedInUser._id) {
  //   alert('Invalid user. Please log in again.');
  //   return; // Stop the submission if no valid user is found
  // }

  // Get sessionId from the selected connection
  const sessionId = selectedConnection._id;

  // Determine the targetUser from the session
  const targetUser =
    selectedConnection.userId1._id === loggedInUser._id
      ? selectedConnection.userId2._id
      : selectedConnection.userId1._id;

  if (!targetUser || !sessionId) {
    alert('Invalid session or target user.');
    return; // Stop the submission if target user or session is missing
  }

  const formData = new FormData();
  formData.append('reason', reason);
  formData.append('description', description);
  formData.append('reporter', loggedInUser._id); // Include the logged-in user as the reporter
  formData.append('targetUser', targetUser); // Include the target user
  formData.append('session', sessionId); // Include the session ID

  if (screenshot) {
    formData.append('screenshot', screenshot); // Attach screenshot if available
  }

  const token = localStorage.getItem('token');

  try {
    const response = await axios.post('http://localhost:5000/api/reports', formData, {
      headers: { 'x-auth-token': token },
    });

    // Success: Reset form and show success message
    alert('Report submitted successfully');
    setReason('');
    setDescription('');
    setScreenshot(null);
    closeReportModal();
  } catch (error) {
    console.error('Error submitting report:', error);
    alert('Error submitting report: ' + (error.response?.data?.message || error.message));
  }
};

  // Get the logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  // Check if the logged-in user is user1 or user2 in the current session
  const isUser1 = selectedConnection?.userId1?._id === loggedInUser?._id;
  const isUser2 = selectedConnection?.userId2?._id === loggedInUser?._id;

  // Check if feedback has been given by the logged-in user
  const isFeedbackGivenByLoggedInUser = isUser1
    ? selectedConnection?.feedbackByUser1 // Assuming these fields contain the feedback for user1
    : isUser2
    ? selectedConnection?.feedbackByUser2 // Assuming these fields contain the feedback for user2
    : false; // If neither, feedback hasn't been provided by the logged-in user

   // Check if both users have provided feedback
  const bothUsersProvidedFeedback = selectedConnection?.feedbackByUser1 && selectedConnection?.feedbackByUser2;

  // Check if session is completed or canceled
  const isSessionCompletedOrCanceled = selectedConnection?.status === 'completed' || selectedConnection?.status === 'canceled';

  // Disable interaction if the session is completed or canceled and both users have provided feedback
  const isChatBlocked = isSessionCompletedOrCanceled && bothUsersProvidedFeedback;

  // Show the feedback modal if the logged-in user hasn't provided feedback yet
  const shouldShowFeedbackModal = !isFeedbackGivenByLoggedInUser && !isChatBlocked;

  // Show "Schedule Next Meeting" only if the session is not completed or canceled and both users haven't provided feedback
  const shouldShowScheduleButton = !isSessionCompletedOrCanceled && !bothUsersProvidedFeedback;

  return (
    <div className="chat-page min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Left Panel: List of Connections */}
        <div className="left-panel w-1/4 bg-gray-100 p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-700">Connections</h2>
          <div className="space-y-4 mt-6">
            {connections.length > 0 ? (
              connections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-indigo-100"
                  onClick={() => handleSelectConnection(connection)}
                >
                  <p className="font-semibold text-gray-800">{connection.userId1?.name || 'Unknown'}</p>
                  {/* Display the skill here */}
                  <p className="text-gray-600">Skill: {connection.skill || 'Eclipse OCL' }</p>
                  <p className="text-gray-500">{connection.sessionDate} at {connection.sessionTime}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No connections available.</p>
            )}
          </div>
        </div>

        {/* Right Panel: Chat with Selected Connection */}
        <div className="chat-container w-3/4 p-6 bg-white rounded-xl shadow-xl">
          {selectedConnection && (
            <>
              <h2 className="text-3xl font-semibold mb-4 text-gray-800">
                Chat with {selectedConnection.userId1?.name || 'Unknown'}
              </h2>
              {/* Display the skill here */}
              <p className="text-gray-600">Skill: {selectedConnection.skill || 'Eclipse OCL'}</p>

              <div className="messages-container bg-gray-50 p-4 rounded-lg shadow-lg mb-6 max-h-96 overflow-auto">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`message mb-4 p-4 bg-white rounded-lg shadow-sm ${msg.senderId && msg.senderId._id === loggedInUser._id ? 'text-right bg-blue-600 text-white' : 'text-left bg-gray-200 text-black'}`}
                    >
                      <p>
                        <strong>{msg.senderName}: </strong>{msg.content}
                      </p>
                      {msg.mediaType === 'image' && <img src={msg.mediaUrl} alt="file" className="max-w-xs mt-2" />}
                      {msg.mediaType === 'audio' && <audio controls><source src={msg.mediaUrl} /></audio>}
                      {msg.mediaType === 'video' && <video controls><source src={msg.mediaUrl} /></video>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No messages yet</p>
                )}
              </div>


              {/* Feedback Display if session is completed or canceled */}
              {isSessionCompletedOrCanceled && (
                <div className="feedback-display bg-white p-4 rounded-lg shadow-lg mb-6">
                  <h3 className="font-semibold text-gray-800">Feedback from User 1:</h3>
                  <p>{selectedConnection?.feedbackByUser1}</p>

                  <h3 className="font-semibold text-gray-800 mt-4">Feedback from User 2:</h3>
                  <p>{selectedConnection?.feedbackByUser2}</p>
                </div>
              )}

              {/* Prevent sending messages if the session is completed or canceled */}
              {!isChatBlocked && <MessageInput sendMessage={handleSendMessage} />}

              {/* Schedule Next Meeting Button */}
              {shouldShowScheduleButton && (
                <button
                  onClick={openScheduleModal}
                  className="bg-blue-600 text-white p-3 rounded-lg mt-6 transition duration-300 ease-in-out transform hover:bg-blue-700"
                >
                  Schedule Next Meeting
                </button>
              )}

              {/* Mark as Completed or Canceled */}
              {!isChatBlocked && !isSessionCompletedOrCanceled && (
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => handleMarkSession('completed')}
                    className="bg-green-600 text-white p-4 rounded-lg w-48 hover:bg-green-700 transition duration-300 ease-in-out"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleMarkSession('canceled')}
                    className="bg-red-600 text-white p-4 rounded-lg w-48 hover:bg-red-700 transition duration-300 ease-in-out"
                  >
                    Mark as Canceled
                  </button>
                </div>
              )}

              {/* Feedback Button */}
              {!isChatBlocked && !bothUsersProvidedFeedback && (
                <button
                  onClick={openFeedbackModal}
                  className="bg-yellow-500 text-white p-3 rounded-lg mt-6 transition duration-300 ease-in-out transform hover:bg-yellow-600"
                >
                  Provide Feedback
                </button>
              )}

              {/* Feedback Modal (only show if feedback hasn't been given yet) */}
              {isFeedbackModalOpen && (
                <div className="feedback-modal bg-white p-6 rounded-lg shadow-lg fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="modal-content w-96 bg-white p-6 rounded-lg relative">
                    {/* Close Button for the Modal */}
                    <button
                      onClick={closeFeedbackModal}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      ✖
                    </button>
                    <h3 className="text-xl font-semibold text-gray-800">Provide Feedback</h3>
                    <select
                      onChange={(e) => setRating(e.target.value)}
                      value={rating}
                      className="mt-4 w-full p-2 border rounded-lg bg-gray-50"
                    >
                      {[...Array(5)].map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1} Star{index + 1 > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Write your feedback"
                      className="mt-4 w-full p-2 border rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => handleMarkSession('completed')}
                      className="bg-green-600 text-white p-4 rounded-lg mt-6 w-full hover:bg-green-700 transition duration-300 ease-in-out"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              )}

              {/* Schedule Modal */}
              {isScheduleModalOpen  && (
                <div className="modal bg-white p-6 rounded-lg shadow-lg fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="modal-content w-96 p-6">
                    <h2 className="text-xl">Schedule Next Meeting</h2>
                    <div className="flex flex-col space-y-2 mt-4">
                      <label className="font-medium">
                        <FiCalendar /> Select Date:
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="border p-2 rounded-lg"
                        />
                      </label>
                      <label className="font-medium">
                        <FiClock /> Select Time:
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="border p-2 rounded-lg"
                        />
                      </label>
                    </div>
                    <button
                      onClick={handleScheduleSession}
                      className="bg-green-600 text-white p-4 rounded-lg mt-6 w-full hover:bg-green-700 transition duration-300 ease-in-out"
                    >
                      Confirm Schedule
                    </button>
                    <button
                      onClick={closeScheduleModal}
                      className="bg-red-600 text-white p-4 rounded-lg mt-2 w-full hover:bg-red-700 transition duration-300 ease-in-out"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {/* Report User Button */}
              <button
                onClick={openReportModal}
                className="report-user-button flex items-center space-x-2 py-2 px-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
              >
                <IoMdWarning className="text-xl" />
                <span>Report User</span>
              </button>

              {/* Report Modal */}
              {isReportModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
                    <button
                      onClick={closeReportModal}
                      className="close-modal absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                      ✖
                    </button>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Report User</h3>
                    <form onSubmit={handleReportSubmit}>
                      <div className="mb-4">
                        <label className="font-medium text-gray-700">Reason:</label>
                        <select
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          required
                          className="mt-2 w-full p-3 border rounded-lg bg-gray-50"
                        >
                          <option value="">Select Reason</option>
                          <option value="Spam">Spam</option>
                          <option value="Harassment">Harassment</option>
                          <option value="Inappropriate Behavior">Inappropriate Behavior</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="font-medium text-gray-700">Description:</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the issue"
                          required
                          className="mt-2 w-full p-3 border rounded-lg bg-gray-50 h-32"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="font-medium text-gray-700">Attach Screenshot (Optional):</label>
                        <input
                          type="file"
                          onChange={(e) => setScreenshot(e.target.files[0])}
                          accept="image/*"
                          className="mt-2 w-full p-3 border rounded-lg bg-gray-50"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="submit-button bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Submit Report
                        </button>
                      </div>
                    </form>
                    {reportSuccess && (
                      <div className="mt-4 text-green-600 text-center">
                        <p>Report submitted successfully!</p>
                      </div>
                    )}
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
