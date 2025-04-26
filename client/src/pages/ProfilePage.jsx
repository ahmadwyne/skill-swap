import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingSessions, setPendingSessions] = useState([]); // Store pending sessions
  const [acceptedSessions, setAcceptedSessions] = useState([]); // Store accepted sessions
  const navigate = useNavigate();

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
        } catch (err) {
          setError('Failed to load profile data.');
        }
      }
    };
    fetchUserProfile();
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-screen-md mx-auto p-8 bg-white rounded-lg shadow-xl mt-8">
        <h1 className="text-4xl font-semibold text-center text-gray-700 mb-6">Welcome, {user?.name}</h1>

        {success && <div className="bg-green-500 text-white p-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}

        {/* Profile Info */}
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
