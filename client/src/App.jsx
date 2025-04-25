// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Home page component (from pages folder)
import LoginPage from './pages/LoginPage';  // Login page component (from pages folder)
import RegisterPage from './pages/RegisterPage';  // Register page component (from pages folder)
import ProfilePage from './pages/ProfilePage';  // Profile page component (from pages folder)
import PrivateRoute from './components/common/PrivateRoute';  // PrivateRoute component (from common folder)
import './App.css';  // Assuming you have a separate app stylesheet

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protect the profile route with PrivateRoute */}
        <Route 
          path="/profile" 
          element={<PrivateRoute element={<ProfilePage />} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;