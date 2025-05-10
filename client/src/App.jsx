// // src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage            from './pages/HomePage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import ProfilePage         from './pages/ProfilePage';
import SkillMatchingPage   from './pages/SkillMatchingPage';
import ChatPage            from './pages/ChatPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AdminDashboardPage  from './pages/AdminDashboardPage';  // Must use <Outlet />
import UserManagement      from './components/admin/UserManagement';
import ReportManagement    from './components/admin/ReportManagement';
import AnalyticsOverview   from './components/admin/AnalyticsOverview';
import AdminProfile from './pages/AdminProfilePage'; // Admin Profile Page
import EngagementAnalytics from './components/admin/EngagementAnalytics';
import AboutUsPage from "./pages/AboutUSPage";
import ScrollToTop from "./components/ScrollToTop";
import PrivateRoute        from './components/common/PrivateRoute';

import "./App.css";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🆕 About Us Route */}
        <Route path="/about-us" element={<AboutUsPage />} />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={<PrivateRoute element={<ProfilePage />} />}
        />
        <Route
          path="/skill-matching"
          element={<PrivateRoute element={<SkillMatchingPage />} />}
        />
        <Route path="/chat" element={<PrivateRoute element={<ChatPage />} />} />
        <Route
          path="/chat/:sessionId"
          element={<PrivateRoute element={<ChatPage />} />}
        />
        <Route
          path="/profile-settings"
          element={<PrivateRoute element={<ProfileSettingsPage />} />}
        />

        {/* Admin Dashboard with Nested Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              element={<AdminDashboardPage />}
              requiredRole="admin"
            />
          }
        >
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="analytics" element={<AnalyticsOverview />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="engagement-analytics" element={<EngagementAnalytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
