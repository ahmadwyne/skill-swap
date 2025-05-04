// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import NotificationBell from "../components/NotificationBell";
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiCalendar, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setNotifications } from "../redux/slices/notificationSlice";
import Background from "../components/background/Background";
import "../components/background/Background.css";
import Footer from "../components/footer/Footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [modalTeach, setModalTeach] = useState("");
  const [modalLearn, setModalLearn] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [acceptedSessions, setAcceptedSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Formatters
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Fetch profile & notifications
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          { headers: { "x-auth-token": token } }
        );
        setUser(data);
        setSkillsToTeach(data.skillsToTeach);
        setSkillsToLearn(data.skillsToLearn);

        const notifRes = await axios.get(
          `http://localhost:5000/api/notifications/${data._id}`,
          { headers: { "x-auth-token": token } }
        );
        dispatch(setNotifications(notifRes.data));
      } catch {
        setError("Failed to load profile or notifications.");
      }
    };
    fetchUserProfile();
  }, [dispatch]);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [p, a] = await Promise.all([
          axios.get("http://localhost:5000/api/sessions/pending", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/accepted", {
            headers: { "x-auth-token": token },
          }),
        ]);
        setPendingSessions(p.data);
        setAcceptedSessions(a.data);
      } catch {
        setError("Error fetching sessions");
      }
    };
    fetchSessions();
  }, []);

  // Modal handlers
  const openModal = () => {
    setModalTeach(skillsToTeach.join(", "));
    setModalLearn(skillsToLearn.join(", "));
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
    setSuccess("");
  };
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          skillsToTeach: modalTeach.split(",").map((s) => s.trim()),
          skillsToLearn: modalLearn.split(",").map((s) => s.trim()),
        },
        { headers: { "x-auth-token": token } }
      );
      setUser(data);
      setSkillsToTeach(data.skillsToTeach);
      setSkillsToLearn(data.skillsToLearn);
      setSuccess("Profile updated successfully!");
      closeModal();
    } catch {
      setError("Failed to update profile.");
    }
  };

  // Session actions
  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/sessions/accept",
        { sessionId: id },
        { headers: { "x-auth-token": token } }
      );
      setPendingSessions((ps) => ps.filter((s) => s._id !== id));
      setAcceptedSessions((as) => [...as, res.data.session]);
      setSuccess("Session accepted");
    } catch {
      setError("Failed to accept session.");
    }
  };
  const handleStartChat = (id) => navigate(`/chat/${id}`);

  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Navbar />

        {/* Profile and Notification Section */}
        <div className="flex flex-col md:flex-row justify-between items-start max-w-7xl mx-auto p-8 space-y-6 md:space-y-0">
          {/* Left Profile Card */}
          <div className="relative bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-xl shadow-lg p-6 min-h-[12rem] flex flex-col md:flex-row items-center space-x-0 md:space-x-6 w-full h-60 md:h-60 transition hover:shadow-2xl md:mr-4 transition-shadow duration-300 self-start">
            {/* Controls: Notifications + Edit */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <NotificationBell />
              <button
                onClick={() => navigate("/profile-settings")}
                className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                title="Edit Profile"
              >
                <FiEdit size={26} />
              </button>
            </div>

            {/* Profile Picture */}
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={
                  user?.profilePicture
                    ? `http://localhost:5000/uploads/profile-pictures/${user.profilePicture}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="text-center md:text-left space-y-2 mt-4 md:mt-0">
              <h2 className="text-3xl font-bold text-white">
                {user?.name || "User"}
              </h2>
              <p className="text-lg text-white">Welcome to your profile!</p>

              {user?.status && (
                <p className="text-sm text-white">
                  <span className="font-semibold text-white">Status:</span>{" "}
                  {user.status}
                </p>
              )}

              {/* Social Links */}
              {user?.socials && (
                <div className="flex justify-center md:justify-start space-x-4 mt-2">
                  {user.socials.linkedin && (
                    <a
                      href={user.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-500 transition"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {user.socials.facebook && (
                    <a
                      href={user.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:text-blue-700 transition"
                    >
                      <i className="fab fa-facebook fa-lg"></i>
                    </a>
                  )}
                  {user.socials.twitter && (
                    <a
                      href={user.socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-500 hover:text-blue-400 transition"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Card with Notifications */}
          {/* Notification Bell */}
        </div>

        {/* Profile Info and Skills Info */}
        <div className="max-w-7xl mx-auto p-8">
          {success && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills Card */}
            <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-lg shadow-lg p-6 h-96 overflow-y-auto hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-800 text-left">
                  Your Skills
                </h2>
                <div
                  onClick={openModal}
                  className="bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition"
                >
                  <FiEdit size={24} />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-medium text-gray-700 mb-2 text-left">
                  Skills You Can Teach:
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillsToTeach.length > 0 ? (
                    skillsToTeach
                      .flatMap((skill) => skill.split(",").map((s) => s.trim())) // Split and trim skills
                      .map((s, i) => (
                        <span
                          key={i}
                          className="bg-blue-200 text-blue-800 text-lg font-medium rounded-full px-5 py-2 hover:bg-blue-300 transition"
                        >
                          {s}
                        </span>
                      ))
                  ) : (
                    <span className="text-gray-500 text-lg">None</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-2xl font-medium text-gray-700 mb-2 text-left">
                  Skills You Want to Learn:
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillsToLearn.length > 0 ? (
                    skillsToLearn
                      .flatMap((skill) => skill.split(",").map((s) => s.trim())) // Split and trim skills
                      .map((s, i) => (
                        <span
                          key={i}
                          className="bg-green-200 text-green-800 text-lg font-medium rounded-full px-5 py-2 hover:bg-green-300 transition"
                        >
                          {s}
                        </span>
                      ))
                  ) : (
                    <span className="text-gray-500 text-lg">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sessions Card */}
            <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-lg shadow-lg p-6 h-96 flex flex-col hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-left">
                Your Sessions
              </h2>

              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "pending"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
              </div>

              {/* Scrollable sessions list */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 session-list">
                {(activeTab === "pending" ? pendingSessions : acceptedSessions)
                  .length > 0 ? (
                  (activeTab === "pending"
                    ? pendingSessions
                    : acceptedSessions
                  ).map((s) => (
                    <div
                      key={s._id}
                      className="bg-white ring-1 ring-gray-100 rounded-lg shadow p-4 hover:shadow-md hover:-translate-y-0.5 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center
                                                     text-gray-600 text-sm font-semibold"
                          >
                            {s.userId1.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <span className="text-base font-semibold text-gray-800">
                            {s.userId1.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(s.sessionDate)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-gray-600 mb-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <FiCalendar size={14} />
                          <span>{formatDate(s.sessionDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiClock size={14} />
                          <span>{formatTime(s.sessionDate)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          activeTab === "pending"
                            ? handleAccept(s._id)
                            : handleStartChat(s._id)
                        }
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                          activeTab === "pending"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } active:scale-95`}
                      >
                        {activeTab === "pending" ? "Accept" : "Start Chat"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center text-sm">
                    {activeTab === "pending"
                      ? "No pending sessions."
                      : "No upcoming sessions."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg"
              initial={{ y: "100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">
                Update Your Skills
              </h2>

              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-left">
                  Skills You Can Teach
                </label>
                <input
                  type="text"
                  value={modalTeach}
                  onChange={(e) => setModalTeach(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g. JavaScript, Python"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 text-left">
                  Skills You Want to Learn
                </label>
                <input
                  type="text"
                  value={modalLearn}
                  onChange={(e) => setModalLearn(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="e.g. React, Data Science"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default ProfilePage;
