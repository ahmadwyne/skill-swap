// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SkillMatchingPage from './pages/SkillMatchingPage';  // Import SkillMatchingPage
import PrivateRoute from './components/common/PrivateRoute'; // PrivateRoute for protecting pages
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protecting the profile and skill matching pages */}
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="/skill-matching" element={<PrivateRoute element={<SkillMatchingPage />} />} /> {/* Use consistent naming */}
      </Routes>
    </Router>
  );
}

export default App;