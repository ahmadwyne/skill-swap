import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';
import ProfileCard from '../components/ProfileCard';  // Import ProfileCard
import { useDispatch } from 'react-redux';
import { setNotifications } from '../redux/slices/notificationSlice';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingSessions, setPendingSessions] = useState([]); // Store pending sessions
  const [acceptedSessions, setAcceptedSessions] = useState([]); // Store accepted sessions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: { 'x-auth-token': token },
          });
          setUser(response.data);
          setSkillsToTeach(response.data.skillsToTeach.join(','));
          setSkillsToLearn(response.data.skillsToLearn.join(','));
          fetchNotifications(response.data._id);  // Fetch notifications for the current user
        } catch (err) {
          setError('Failed to load profile data.');
        }
      }
    };
  
    const fetchNotifications = async (userId) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`, {
          headers: { 'x-auth-token': token },
        });
        dispatch(setNotifications(response.data));  // Store notifications in Redux
      } catch (err) {
        setError('Failed to load notifications.');
      }
    };
  
    fetchUserProfile();
  }, [dispatch]); // Ensure Redux state is updated when the component loads  

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch pending sessions
        const response = await axios.get('http://localhost:5000/api/sessions/pending', {
          headers: { 'x-auth-token': token },
        });
        setPendingSessions(response.data);

        // Fetch accepted sessions
        const acceptedResponse = await axios.get('http://localhost:5000/api/sessions/accepted', {
          headers: { 'x-auth-token': token },
        });
        setAcceptedSessions(acceptedResponse.data);
      } catch (err) {
        setError('Error fetching sessions');
      }
    };
    fetchSessions();
  }, []);

  // Handle session acceptance
  const handleAcceptSession = async (sessionId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/sessions/accept',
        { sessionId },
        { headers: { 'x-auth-token': token } }
      );
      setPendingSessions(pendingSessions.filter((session) => session._id !== sessionId));
      setAcceptedSessions([...acceptedSessions, response.data.session]);
      setSuccess('Session request accepted');
    } catch (err) {
      setError('Failed to accept session request.');
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        { skillsToTeach: skillsToTeach.split(','), skillsToLearn: skillsToLearn.split(',') },
        { headers: { 'x-auth-token': token } }
      );
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setError('');
      navigate('/skill-matching');
    } catch (err) {
      setError('Failed to update profile.');
      setSuccess('');
    }
  };

  // Navigate to ChatPage with the selected sessionId
  const handleStartChat = (sessionId) => {
    navigate(`/chat/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative"> {/* Add relative positioning here */}
      {/* Navbar */}
      <Navbar />

      {/* Profile and Notification Section */}
      <div className="flex justify-between items-start max-w-screen-md mx-auto p-8 bg-transparent mt-8">
        {/* Profile Card */}
        <div className="w-3/4">
          {user && <ProfileCard user={user} />}  {/* Display ProfileCard */}
        </div>

        {/* Notification and Profile Settings Card */}
        <div className="w-1/8 flex flex-col items-center absolute top-24 right-6 z-50"> {/* Adjusted width to 1/8 */}
          {/* Card containing the profile icon and notification bell */}
          <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center w-full h-16"> {/* Adjusted height as needed */}
            <div className="flex items-center space-x-4 w-full justify-between">
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* Profile Icon */}
              <img
                onClick={() => navigate('/profile-settings')}
                src={user?.profilePicture ? `http://localhost:5000/uploads/profile-pictures/${user.profilePicture}` : '/default-avatar.png'}
                alt="Profile"
                className="w-12 h-12 rounded-full border cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info and Skills Info */}
      <div className="max-w-screen-md mx-auto p-8 bg-white rounded-lg shadow-xl mt-8">
        <h1 className="text-4xl font-semibold text-center text-gray-700 mb-6">Welcome, {user?.name}</h1>

        {success && <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

        {/* Skills Info */}
        <div className="space-y-6">
          <div>
            <label htmlFor="skillsToTeach" className="block text-lg font-medium text-gray-700">Skills You Can Teach</label>
            <input
              type="text"
              id="skillsToTeach"
              value={skillsToTeach}
              onChange={(e) => setSkillsToTeach(e.target.value)}
              placeholder="Enter skills to teach (comma separated)"
              className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <div>
            <label htmlFor="skillsToLearn" className="block text-lg font-medium text-gray-700">Skills You Want to Learn</label>
            <input
              type="text"
              id="skillsToLearn"
              value={skillsToLearn}
              onChange={(e) => setSkillsToLearn(e.target.value)}
              placeholder="Enter skills to learn (comma separated)"
              className="w-full p-4 mt-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update Profile
          </button>
        </div>

        {/* Pending Session Requests */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Pending Session Requests</h2>
          <div className="space-y-4 mt-4">
            {pendingSessions.length > 0 ? (
              pendingSessions.map((session) => (
                <div key={session._id} className="bg-gray-100 p-4 rounded-lg shadow mb-4">
                  <p><strong>Session Request from:</strong> {session.userId1.name}</p>
                  <p><strong>Date:</strong> {session.sessionDate}</p>
                  <p><strong>Time:</strong> {session.sessionTime}</p>
                  <button
                    onClick={() => handleAcceptSession(session._id)}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mt-4"
                  >
                    Accept
                  </button>
                </div>
              ))
            ) : (
              <p>No pending session requests</p>
            )}
          </div>
        </div>

        {/* Accepted Sessions */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
          <div className="space-y-4 mt-4">
            {acceptedSessions.length > 0 ? (
              acceptedSessions.map((session) => (
                <div key={session._id} className="bg-gray-100 p-4 rounded-lg shadow mb-4">
                  <p><strong>Session with:</strong> {session.userId1.name}</p>
                  <p><strong>Date:</strong> {session.sessionDate}</p>
                  <p><strong>Time:</strong> {session.sessionTime}</p>
                  <button
                    onClick={() => handleStartChat(session._id)} // Redirect to chat page with sessionId
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 mt-4"
                  >
                    Start Chat
                  </button>
                </div>
              ))
            ) : (
              <p>No upcoming sessions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;