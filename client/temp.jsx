// src/pages/SkillMatchingPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Background from "../components/background/Background";
import "../components/background/Background.css";
import { FaCalendarAlt, FaPaperPlane, FaSearch } from 'react-icons/fa';

const SkillMatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/matches', {
          headers: { 'x-auth-token': token },
        });

        const currentUserId = JSON.parse(user)._id;
        const filteredMatches = response.data.filter((match) => match.user._id !== currentUserId);
        setMatches(filteredMatches);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, [navigate]);

  const handleScheduleSession = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const sendSessionRequest = async (userId) => {
    const token = localStorage.getItem('token');
    if (!sessionDate || !sessionTime) {
      alert('Please select a date and time for the session.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/sessions/request',
        { userId2: userId, sessionDate, sessionTime },
        { headers: { 'x-auth-token': token } }
      );

      await axios.post(
        'http://localhost:5000/api/notifications/send',
        {
          userId,
          message: `You have a new session request for ${sessionDate} at ${sessionTime}`,
          type: 'session_request',
        },
        { headers: { 'x-auth-token': token } }
      );

      alert('Session request sent');
    } catch (err) {
      console.error('Error sending session request:', err);
      alert('Error sending session request');
    }
  };

  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 py-10">
          <h1 className="text-4xl font-bold text-center text-white mb-4">Skill Matching</h1>
          <p className="text-center text-white mb-6 max-w-2xl mx-auto font-semibold italic">
            Browse your matches and schedule a session to share your skills.
          </p>

          {/* 🌟 Search Bar */}
          <div className="relative max-w-md mx-auto mb-10">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/10 text-white placeholder-white text-italics backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#4361ee] shadow-lg"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-700" />
          </div>

          {/* 💡 Filtered User Cards */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {matches
              .filter((match) =>
                match.user.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((match) => (
                <div
                  key={match._id}
                  className="bg-gradient-to-br from-blue-400 via-blue-250 to-blue-300 rounded-2xl shadow-lg p-6 min-h-[20rem] overflow-visible hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      className="w-14 h-14 rounded-full border border-white/20"
                      src={
                        match.user?.profilePicture
                          ? `http://localhost:5000/uploads/profile-pictures/${match.user.profilePicture}`
                          : '/default-avatar.png'
                      }
                      alt="Avatar"
                    />

                    <div className="w-full">
                      <div className="flex flex-wrap items-center justify-between">
                        <h3 className="text-lg font-bold tracking-wide text-white">
                          {match.user.name}
                        </h3>
                        {/* Status below name */}
                        <p className="text-sm text-indigo-200 italic tracking-tight">
                          {match.user.skill}
                        </p>

                      </div>
                      <div className="flex justify-between items-center mt-1">
                      {match.user.status && (
                          <p className="text-sm text-white opacity-80">{match.user.status}</p>
                        )}
                        <p className="text-sm text-yellow-300 font-semibold">3.5 🌟</p>
                        {/* This above line is a hard coded line just to show how rating would look for proper checking through backend uncomment the line below it */}
                      {/* {match.user.rating ? ${match.user.rating} ★ : 'No rating yet'} */}
                      </div>

                      

                    </div>
                  </div>



                  <div className="space-y-2 text-sm font-medium tracking-wide text-indigo-100">
                    <label className="block">
                      Date:
                      <input
                        type="date"
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition"
                      />
                    </label>
                    <label className="block">
                      Time:
                      <input
                        type="time"
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => handleScheduleSession(match.user._id)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-white text-[#4361ee] border border-[#4361ee] hover:bg-[#f0f0f0] rounded-xl font-semibold transition duration-200"
                    >
                      <FaCalendarAlt className="text-[#4361ee]" /> Schedule Session
                    </button>
                    <button
                      onClick={() => sendSessionRequest(match.user._id)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#4361ee] text-white hover:bg-[#3a0ca3] rounded-xl font-semibold transition duration-200"
                    >
                      <FaPaperPlane className="text-white" /> Send Session Request
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatchingPage;