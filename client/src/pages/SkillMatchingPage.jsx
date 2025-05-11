// src/pages/SkillMatchingPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Background from "../components/background/Background";
import "../components/background/Background.css";
import { FaPaperPlane, FaSearch } from 'react-icons/fa';
import MatchList from '../components/MatchList';
import SessionSchedulingModal from '../components/session/SessionSchedulingModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS
import Footer from "../components/footer/Footer";

const SkillMatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionDetails, setSessionDetails] = useState({});
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({
    date: '',
    time: '',
  });

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
    const { date, time } = sessionDetails[userId] || {};
  
    const newErrorMessages = { ...errorMessages };
  
    // Reset previous errors for this user
    newErrorMessages[userId] = {};
  
    // Date validation: check if date is selected
    if (!date) {
      newErrorMessages[userId].date = 'Please select a date';
    } else {
      // Date validation: should not be in the past
      const today = new Date();
      const selectedDate = new Date(date + "T00:00:00"); // force midnight to avoid timezone issues
  
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrorMessages[userId].date = 'Selected date is in the past';
      }
    }
    setSessionDetails((prev) => ({
      ...prev,
      [userId]: {
        date: '',
        time: '',
      },
    }));
    // Time validation: check if time is selected
    if (!time) {
      newErrorMessages[userId].time = 'Please select a time';
    } else {
      // Time validation: should not be in the past
      const today = new Date();
      const selectedDate = new Date(date + "T00:00:00"); // force midnight to avoid timezone issues
  
      if (selectedDate.getTime() === today.setHours(0, 0, 0, 0) && time && new Date(`${date}T${time}`).getTime() < Date.now()) {
        newErrorMessages[userId].time = 'Selected time is in the past';
      }
    }
  
    setErrorMessages(newErrorMessages);
  
    // If any error exists for this user (either date or time), stop the request
    if (newErrorMessages[userId]?.date || newErrorMessages[userId]?.time) {
      return;
    }
  
    try {
      await axios.post(
        'http://localhost:5000/api/sessions/request',
        { userId2: userId, sessionDate: date, sessionTime: time },
        { headers: { 'x-auth-token': token } }
      );
  
      await axios.post(
        'http://localhost:5000/api/notifications/send',
        {
          userId,
          message: `You have a new session request for ${date} at ${time}`,
          type: 'session_request',
        },
        { headers: { 'x-auth-token': token } }
      );
  
      toast.success('Session request sent successfully!', {
        autoClose: 2000,
        style: {
          background: 'linear-gradient(to right bottom, #3b82f6, #2563eb)',
          color: '#ffffff',
          fontWeight: 'bold',
          padding: '10px',
          borderRadius: '8px',
        },
        progressStyle: {
          background: '#1E3A8A',
          height: '4px',
          borderRadius: '2px',
        },
        icon: false,
      });
    } catch (err) {
      console.error('Error sending session request:', err);
      toast.error('Error sending session request. Please try again.');
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
                  className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-2xl shadow-lg p-6 min-h-[22rem] flex flex-col justify-between transition-shadow duration-300 hover:shadow-2xl">
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
                        <p className="text-sm text-indigo-200 italic tracking-tight">
                          {match.user.skill}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-white opacity-80">
                          {match.user.status || ''}
                        </p>
                        <p className="text-sm text-yellow-300 font-semibold text-right">
                          3.5 🌟
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm font-medium tracking-wide text-indigo-100">
                    <label className="block">
                      Date:
                      <input
                        type="date"
                        value={sessionDetails[match.user._id]?.date || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                        
                          setSessionDetails((prev) => ({
                            ...prev,
                            [match.user._id]: {
                              ...prev[match.user._id],
                              date: value,
                            },
                          }));
                        
                          // ✅ Clear error if date selected
                          setErrorMessages((prev) => ({
                            ...prev,
                            [match.user._id]: {
                              ...prev[match.user._id],
                              date: value ? '' : prev[match.user._id]?.date,
                            },
                          }));
                        }}
                        
                        className="w-full mt-1 px-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition"
                      />
                      {/* Show error message for the specific user */}
                      {errorMessages[match.user._id]?.date && (
                        <p className="text-red-500 text-xs">{errorMessages[match.user._id].date}</p>
                      )}
                    </label>
                    <label className="block">
                      Time:
                      <input
                        type="time"
                        value={sessionDetails[match.user._id]?.time || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                        
                          setSessionDetails((prev) => ({
                            ...prev,
                            [match.user._id]: {
                              ...prev[match.user._id],
                              time: value,
                            },
                          }));
                        
                          // ✅ Clear error if time selected
                          setErrorMessages((prev) => ({
                            ...prev,
                            [match.user._id]: {
                              ...prev[match.user._id],
                              time: value ? '' : prev[match.user._id]?.time,
                            },
                          }));
                        }}
                        
                        className="w-full mt-1 px-4 py-2 bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#4361ee] transition"
                      />
                      {/* Show error message for the specific user */}
                      {errorMessages[match.user._id]?.time && (
                        <p className="text-red-500 text-xs mt-1">{errorMessages[match.user._id].time}</p>

                      )}
                    </label>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => sendSessionRequest(match.user._id)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-white text-[#4361ee] border border-[#4361ee] hover:bg-[#f0f0f0] rounded-xl font-semibold transition duration-200"
                    >
                      <FaPaperPlane className="text-[#4361ee]" /> Send Session Request
                    </button>

                    {/* { <button
                      onClick={() => sendSessionRequest(match.user._id)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#4361ee] text-white hover:bg-[#3a0ca3] rounded-xl font-semibold transition duration-200"
                    >
                      <FaPaperPlane className="text-white" /> Send Session Request
                    </button> } */}
                  </div>
                </div>
              ))}
          </div>
          <ToastContainer /> {/* Add ToastContainer here */}
        </div>

      </div>
      <Footer />
      </div>
  );
};

export default SkillMatchingPage;
