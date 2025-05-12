import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar'; // Import Navbar
import MessageInput from '../components/chat/MessageInput'; // Import MessageInput
import { useNavigate, useParams } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "../components/background/Background.css";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Left Panel: List of Connections
  const getOtherUserName = (connection) => {
    if (!connection) return 'Unknown'; // Check if connection is null or undefined
    const user1Name = connection.userId1?.name || 'Unknown';  // Safe access to name
    const user2Name = connection.userId2?.name || 'Unknown';  // Safe access to name
    return connection.userId1?._id === loggedInUser._id ? user2Name : user1Name;
  };

  // Right Panel: Chat with Selected Connection
  const getChatUserName = () => {
    if (!selectedConnection || !selectedConnection.userId1 || !selectedConnection.userId2) {
      return 'Unknown'; // Return a fallback value if selectedConnection or its properties are null
    }
    
    const user1Name = selectedConnection.userId1?.name || 'Unknown'; // Safe access to name
    const user2Name = selectedConnection.userId2?.name || 'Unknown'; // Safe access to name
    return selectedConnection.userId1._id === loggedInUser._id
      ? user2Name
      : user1Name;
  };

  // Utility function to format the date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will display the date in a format like "MM/DD/YYYY"
  };

  return (

    <div className="min-h-screen relative">
      <Background />
      <div className="chat-page flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <button
            className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          {/* Left Panel: List of Connections */}
          <div className={`left-panel fixed z-40 top-0 bottom-0 left-0 w-3/4 sm:w-2/4 md:w-1/4  min-h-screen p-6 bg-white/10 backdrop-blur-md shadow-xl border border-white/20 transform transition-transform duration-300 ease-in-out 
  ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>

            <h2 className="text-2xl font-semibold text-gray-800">Connections</h2>
            <div className="space-y-4 mt-6 overflow-auto max-h-[80vh]">
              {connections.length > 0 ? (
                connections.map((connection) => {
                  const isSelected = selectedConnection && selectedConnection._id === connection._id;
                  return (
                    <div
                      key={connection._id}
                      className={`p-4 rounded-lg shadow-lg cursor-pointer 
          ${isSelected
                          ? 'bg-blue-600 border-2 border-white'
                          : 'bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 hover:bg-indigo-100'}`}
                      onClick={() => handleSelectConnection(connection)}
                    >
                      <p className="font-semibold text-white">{getOtherUserName(connection)}</p>
                      <p className="text-white">Skill: {connection.skill || 'Eclipse OCL'}</p>
                      <p className="text-white">{formatDate(connection.sessionDate)} at {connection.sessionTime}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-white">No connections available.</p>
              )}

            </div>
          </div>
          {/* Right Panel: Chat with Selected Connection */}
          <div className="chat-container w-3/4 min-h-screen p-2 bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20">


            {selectedConnection && (
              <>
                <h2 className="text-3xl font-semibold mb-4 text-gray-800">
                  Chat with {getChatUserName()}
                </h2>
                <p className="text-white">Skill: {selectedConnection.skill || 'Eclipse OCL'}</p>
                <div className="messages-container bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200  p-4 rounded-lg shadow-lg mb-6 max-h-96 overflow-auto">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className="message mb-4 p-4 bg-white via-blue-400 to-blue-300 rounded-lg text-left bg-blue-600 text-grey-700 ">
                        {msg.senderId && msg.senderId._id === loggedInUser._id}

                        <p>
                          <strong>{msg.senderName}: </strong>
                          {/* Render the message content as HTML */}
                          <span dangerouslySetInnerHTML={{ __html: msg.content }} />
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
                  <div className="feedback-display bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 p-4 rounded-lg shadow-lg mb-6">
                    <h3 className="font-semibold text-gray-800">Feedback from User 1:</h3>
                    <p>{selectedConnection?.feedbackByUser1}</p>

                    <h3 className="font-semibold text-gray-800 mt-4">Feedback from User 2:</h3>
                    <p>{selectedConnection?.feedbackByUser2}</p>
                  </div>
                )}

                {/* Prevent sending messages if the session is completed or canceled */}
                {!isChatBlocked && <MessageInput sendMessage={handleSendMessage} />}

                {/* Buttons Row */}
                <div className="flex flex-wrap justify-center items-center gap-4 mt-4">

                  {/* Schedule Next Meeting Button */}
                  {shouldShowScheduleButton && (
                    <button
                      onClick={openScheduleModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition duration-300 ease-in-out"
                    >
                      <FiCalendar /> Schedule Next Meeting
                    </button>
                  )}

                  {/* Mark as Completed */}
                  {!isChatBlocked && !isSessionCompletedOrCanceled && (
                    <>
                      <button
                        onClick={() => handleMarkSession('completed')}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                      >
                        Mark as Completed
                      </button>

                      {/* Mark as Canceled */}
                      <button
                        onClick={() => handleMarkSession('canceled')}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                      >
                        Mark as Canceled
                      </button>
                    </>
                  )}

                  {/* Report User Button */}
                  <button
                    onClick={openReportModal}
                    className="flex items-center gap-2 py-2 px-4 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
                  >
                    <IoMdWarning className="text-xl" />
                    <span>Report User</span>
                  </button>

                  {/* Feedback Button */}
                  {!isChatBlocked && !bothUsersProvidedFeedback && (
                    <button
                      onClick={openFeedbackModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out"
                    >
                      Provide Feedback
                    </button>
                  )}

                  {isMenuOpen && (
                    <div
                      className="fixed inset-0 z-30 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 md:hidden"
                      onClick={() => setIsMenuOpen(false)}
                    ></div>
                  )}

                  {/* Close Button */}
                  {/* Feedback Modal (only show if feedback hasn't been given yet) */}
                  {isFeedbackModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 bg-opacity-10 backdrop-blur-sm">
                      <div className="w-[90%] max-w-md bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-2xl">
                        <button
                          onClick={closeFeedbackModal}
                          className="absolute top-3 right-4 text-blue-600 text-2xl hover:text-gray-200 transition"
                        >
                          &times;
                        </button>

                        <h3 className="text-2xl font-bold mb-5 text-center">We’d Love Your Feedback</h3>

                        <select
                          onChange={(e) => setRating(e.target.value)}
                          value={rating}
                          className="w-full p-3 rounded-lg bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                          placeholder="Write your feedback..."
                          rows="4"
                          className="mt-4 w-full p-3 rounded-lg bg-white text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />

                        <button
                          onClick={closeFeedbackModal}
                          className="bg-white text-[#4361ee] border border-[#4361ee] py-3 px-4 rounded-lg mt-6 w-full transition duration-300 text-lg font-semibold"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Modal */}
                {isScheduleModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 bg-opacity-10 backdrop-blur-sm">
                    <div className="w-[90%] max-w-md bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-2xl">
                      <h2 className="text-2xl font-bold mb-5 text-center">Schedule Your Next Meeting</h2>

                      <div className="flex flex-col gap-4">
                        <label className="flex flex-col font-medium">
                          <span className="mb-1">Select Date:</span>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                        </label>

                        <label className="flex flex-col font-medium">
                          <span className="mb-1"> Select Time:</span>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                        </label>
                      </div>

                      <button
                        onClick={handleScheduleSession}
                        className="bg-white text-[#4361ee] border border-[#4361ee] py-3 px-4 rounded-lg mt-6 w-full transition duration-300 text-lg font-semibold"
                      >
                        Confirm Schedule
                      </button>

                      <button
                        onClick={closeScheduleModal}
                        className="absolute top-3 right-4 text-blue-600 text-2xl hover:text-gray-200 transition"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                )}


                {/* Report Modal */}
                {isReportModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 bg-opacity-10 backdrop-blur-sm">
                    <div className="w-[90%] max-w-md bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white p-8 rounded-2xl shadow-2xl">
                      <button
                        onClick={closeReportModal}
                        className="absolute top-3 right-4 text-blue-600 text-2xl hover:text-gray-200 transition"
                      >
                        &times;
                      </button>
                      <h3 className="text-2xl font-semibold text-white mb-4">Report User</h3>
                      <form onSubmit={handleReportSubmit}>
                        <div className="mb-4">
                          <label className="font-sm text-white">Reason:</label>
                          <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            className="mt-2 w-full p-3 border rounded-lg bg-gray-50 text-black"
                          >
                            <option value="">Select Reason</option>
                            <option value="Spam">Spam</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Inappropriate Behavior">Inappropriate Behavior</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="font-sm text-white">Description:</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue"
                            required
                            className="mt-2 w-full p-3 border text-black rounded-lg bg-gray-50 h-32"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="font-sm text-white">Attach Screenshot (Optional):</label>
                          <input
                            type="file"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                            accept="image/*"
                            className="mt-2 w-full p-3 border rounded-lg bg-gray-50 text-black"
                            placeholder="Upload Screenshot"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-white text-[#4361ee] border border-[#4361ee] py-3 px-4 rounded-lg mt-6 w-full transition duration-300 text-lg font-semibold"
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
        <Footer />
      </div>
    </ div>
  );
};


export default ChatPage;