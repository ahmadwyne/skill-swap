// src/pages/SkillMatchingPage.jsx (renaming DashboardPage.jsx)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar'; 
import MatchList from '../components/MatchList';  // Import MatchList

const SkillMatchingPage = () => {
  const [matches, setMatches] = useState([]);
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

        // Get the logged-in user ID from localStorage
        const currentUserId = JSON.parse(user)._id;

        // Filter out the logged-in user
        const filteredMatches = response.data.filter((match) => match.user._id !== currentUserId);

        setMatches(filteredMatches);
      } catch (err) {
        console.error('Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Navbar stays at the top */}
      
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-semibold text-center text-gray-700 mb-8">Skill Matching</h1>

        {/* Match List displayed with a responsive grid */}
        <MatchList matches={matches} />
      </div>
    </div>
  );
};

export default SkillMatchingPage;
