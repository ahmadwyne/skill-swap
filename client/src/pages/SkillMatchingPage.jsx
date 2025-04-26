// src/pages/SkillMatchingPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import MatchList from '../components/MatchList';
import SessionSchedulingModal from '../components/session/SessionSchedulingModal';

const SkillMatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
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
      alert('Session request sent');
    } catch (err) {
      console.error('Error sending session request:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-semibold text-center text-gray-700 mb-8">Skill Matching</h1>

        <MatchList 
          matches={matches} 
          handleScheduleSession={handleScheduleSession} 
          sendSessionRequest={sendSessionRequest} 
          setSessionDate={setSessionDate}
          setSessionTime={setSessionTime} 
        />

        <SessionSchedulingModal 
          isOpen={isModalOpen} 
          closeModal={closeModal} 
          selectedUserId={selectedUserId} 
        />
      </div>
    </div>
  );
};

export default SkillMatchingPage;