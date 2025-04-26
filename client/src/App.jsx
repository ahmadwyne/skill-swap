// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SkillMatchingPage from './pages/SkillMatchingPage';
import ChatPage from './pages/ChatPage';  // Chat page route
import PrivateRoute from './components/common/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protecting the profile, skill matching, and chat pages */}
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/skill-matching" element={<PrivateRoute element={<SkillMatchingPage />} />} />
        
        {/* Updated chat page route with sessionId */}
        <Route path="/chat" element={<PrivateRoute element={<ChatPage />} />} /> {/* Generic chat route */}
        <Route path="/chat/:sessionId" element={<PrivateRoute element={<ChatPage />} />} /> {/* Session-based chat route */}
      </Routes>
    </Router>
  );
}

export default App;