// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import NotificationBell from "../components/NotificationBell";
import ProfileCard from "../components/ProfileCard"; // Import ProfileCard
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiCalendar, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setNotifications } from "../redux/slices/notificationSlice";
import Background from "../components/background/Background";
import "../components/background/Background.css";
import Footer from "../components/footer/Footer";
import defaultAvatar from "../assets/avatar.jpeg";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  const [completedSessions, setCompletedSessions] = useState([]);
  const [canceledSessions, setCanceledSessions] = useState([]);
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
        const [p, a, c, co] = await Promise.all([
          axios.get("http://localhost:5000/api/sessions/pending", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/accepted", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/completed", {
            headers: { "x-auth-token": token },
          }),
          axios.get("http://localhost:5000/api/sessions/canceled", {
            headers: { "x-auth-token": token },
          }),
        ]);

        const now = new Date();
        setPendingSessions(
          p.data.filter((session) => new Date(session.sessionDate) >= now)
        );
        setAcceptedSessions(a.data);
        setCompletedSessions(co.data);
        setCanceledSessions(c.data);
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
          name: user.name, // Ensure `name` is sent in the request
          status: user.status,
          socials: user.socials,
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

  const getSessionPartnerName = (session) => {
    const partner =
      session.userId1?._id === user?._id ? session.userId2 : session.userId1;
    return partner?.name ?? "Unknown User";
  };

  // Show loading state until the profile is available
  if (!user) {
    return <div>Loading...</div>; // Or use a spinner/loading indicator
  }

  return (
    <div className="min-h-screen relative">
      <Background />
      <div className="relative z-10">
        <Navbar />
        {/* Profile and Notification Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-0">
            {/* Left Profile Card */}
            <div className="relative bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-xl shadow-lg p-4 md:p-6 min-h-[10rem] md:min-h-[12rem] flex flex-col md:flex-row items-center space-x-0 md:space-x-6 w-full h-auto md:h-60 transition hover:shadow-2xl md:mr-4 transition-shadow duration-300 self-start">
              {/* Controls: Notifications + Edit */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <NotificationBell />
                <button
                  onClick={() => navigate("/profile-settings")}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                  title="Edit Profile"
                >
                  <FiEdit size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Profile Picture */}
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src={
                    user?.profilePicture
                      ? `http://localhost:5000/uploads/profile-pictures/${user.profilePicture}`
                      : defaultAvatar
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="text-center md:text-left space-y-2 mt-4 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {user?.name || "User"}
                </h2>
                <p className="text-base md:text-lg text-white">
                  Welcome to your profile!
                </p>

                {user?.status && (
                  <p className="text-xs md:text-sm text-white">
                    <span className="font-semibold text-white">Status:</span>{" "}
                    {user.status}
                  </p>
                )}

                {/* Social Links */}
                {user?.socials && (
                  <div className="flex justify-center md:justify-start space-x-3 md:space-x-4 mt-2">
                    {user.socials.linkedin && (
                      <a
                        href={user.socials.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-500 transition"
                      >
                        <FaLinkedin size={20} className="md:w-6 md:h-6" />
                      </a>
                    )}
                    {user.socials.facebook && (
                      <a
                        href={user.socials.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:text-blue-700 transition"
                      >
                        <i className="fab fa-facebook text-lg md:text-xl"></i>
                      </a>
                    )}
                    {user.socials.twitter && (
                      <a
                        href={user.socials.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-500 hover:text-blue-400 transition"
                      >
                        <FaInstagram size={20} className="md:w-6 md:h-6" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Tracking - Now Responsive */}
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 md:gap-4 lg:gap-8 mt-4 md:mt-0 ml-auto">
                {/* Completed Sessions */}
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                  <CircularProgressbar
                    value={
                      (completedSessions.length /
                        (pendingSessions.length +
                          completedSessions.length +
                          canceledSessions.length +
                          acceptedSessions.length)) *
                        100 || 0
                    }
                    text={`${completedSessions.length}`}
                    styles={buildStyles({
                      textSize: "32px",
                      textColor: "#fff",
                      pathColor: "#4caf50",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center text-white text-xs md:text-sm mt-1">
                    Completed
                  </p>
                </div>

                {/* Pending Sessions */}
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                  <CircularProgressbar
                    value={
                      (pendingSessions.length /
                        (pendingSessions.length +
                          completedSessions.length +
                          canceledSessions.length +
                          acceptedSessions.length)) *
                        100 || 0
                    }
                    text={`${pendingSessions.length}`}
                    styles={buildStyles({
                      textSize: "32px",
                      textColor: "#fff",
                      pathColor: "#ff9800",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center text-white text-xs md:text-sm mt-1">
                    Pending
                  </p>
                </div>

                {/* Upcoming Sessions */}
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                  <CircularProgressbar
                    value={
                      (acceptedSessions.length /
                        (pendingSessions.length +
                          completedSessions.length +
                          canceledSessions.length +
                          acceptedSessions.length)) *
                        100 || 0
                    }
                    text={`${acceptedSessions.length}`}
                    styles={buildStyles({
                      textSize: "32px",
                      textColor: "#fff",
                      pathColor: "#2196f3",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center text-white text-xs md:text-sm mt-1">
                    Upcoming
                  </p>
                </div>

                {/* Canceled Sessions */}
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                  <CircularProgressbar
                    value={
                      (canceledSessions.length /
                        (pendingSessions.length +
                          completedSessions.length +
                          canceledSessions.length +
                          acceptedSessions.length)) *
                        100 || 0
                    }
                    text={`${canceledSessions.length}`}
                    styles={buildStyles({
                      textSize: "32px",
                      textColor: "#fff",
                      pathColor: "#f44336",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center text-white text-xs md:text-sm mt-1">
                    Canceled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info and Skills Info */}
          <div className="max-w-7xl mx-auto p-4 md:p-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Skills Card */}
              <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-lg shadow-lg p-4 md:p-6 h-80 md:h-96 overflow-y-auto hover:shadow-2xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-left">
                    Your Skills
                  </h2>
                  <div
                    onClick={openModal}
                    className="bg-blue-600 text-white p-2 md:p-3 rounded-full cursor-pointer hover:bg-blue-700 transition"
                  >
                    <FiEdit size={20} className="md:w-6 md:h-6" />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xl md:text-2xl font-medium text-gray-700 mb-2 text-left">
                    Skills You Can Teach:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillsToTeach.length > 0 ? (
                      skillsToTeach
                        .flatMap((skill) =>
                          skill.split(",").map((s) => s.trim())
                        )
                        .map((s, i) => (
                          <span
                            key={i}
                            className="bg-blue-200 text-blue-800 text-sm md:text-lg font-medium rounded-full px-3 py-1 md:px-5 md:py-2 hover:bg-blue-300 transition"
                          >
                            {s}
                          </span>
                        ))
                    ) : (
                      <span className="text-gray-500 text-sm md:text-lg">
                        None
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-medium text-gray-700 mb-2 text-left">
                    Skills You Want to Learn:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillsToLearn.length > 0 ? (
                      skillsToLearn
                        .flatMap((skill) =>
                          skill.split(",").map((s) => s.trim())
                        )
                        .map((s, i) => (
                          <span
                            key={i}
                            className="bg-green-200 text-green-800 text-sm md:text-lg font-medium rounded-full px-3 py-1 md:px-5 md:py-2 hover:bg-green-300 transition"
                          >
                            {s}
                          </span>
                        ))
                    ) : (
                      <span className="text-gray-500 text-sm md:text-lg">
                        None
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sessions Card */}
              <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 rounded-lg shadow-lg p-4 md:p-6 h-80 md:h-96 flex flex-col hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6 text-left">
                  Your Sessions
                </h2>

                <div className="flex flex-wrap gap-2 md:space-x-4 mb-4">
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base transition ${
                      activeTab === "pending"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base transition ${
                      activeTab === "upcoming"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base transition ${
                      activeTab === "completed"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setActiveTab("canceled")}
                    className={`px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base transition ${
                      activeTab === "canceled"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Canceled
                  </button>
                </div>

                {/* Scrollable sessions list */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 session-list">
                  {(activeTab === "pending"
                    ? pendingSessions
                    : activeTab === "upcoming"
                    ? acceptedSessions
                    : activeTab === "completed"
                    ? completedSessions
                    : canceledSessions
                  ).length > 0 ? (
                    (activeTab === "pending"
                      ? pendingSessions
                      : activeTab === "upcoming"
                      ? acceptedSessions
                      : activeTab === "completed"
                      ? completedSessions
                      : canceledSessions
                    ).map((s) => (
                      <div
                        key={s._id}
                        className="bg-white ring-1 ring-gray-100 rounded-lg shadow p-3 md:p-4 hover:shadow-md hover:-translate-y-0.5 transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs md:text-sm font-semibold">
                              {s.userId1?.name
                                ? s.userId1.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "U"}
                            </div>
                            <span className="text-sm md:text-base font-semibold text-gray-800">
                              {getSessionPartnerName(s, user._id)}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {s.skill}
                          </p>
                          <span className="text-xs md:text-sm text-gray-500">
                            {formatDate(s.sessionDate)}
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-gray-600 mb-3 text-xs md:text-sm gap-2">
                          <div className="flex items-center space-x-1">
                            <FiCalendar size={12} className="md:w-4 md:h-4" />
                            <span>{formatDate(s.sessionDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiClock size={12} className="md:w-4 md:h-4" />
                            <span>{formatTime(s.sessionDate)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            activeTab === "pending"
                              ? handleAccept(s._id)
                              : handleStartChat(s._id)
                          }
                          className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1.5 rounded-lg transition ${
                            activeTab === "pending"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          } active:scale-95`}
                        >
                        {activeTab === "pending"
                          ? "Accept"
                          : activeTab === "upcoming"
                          ? "Start Chat"
                          : "View Feedback"}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center text-sm md:text-base">
                      {activeTab === "pending"
                        ? "No pending sessions."
                        : activeTab === "upcoming"
                        ? "No upcoming sessions."
                        : activeTab === "completed"
                        ? "No completed sessions."
                        : "No canceled sessions."}
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
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 md:max-w-lg"
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-left">
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
                    className="w-full border rounded-lg p-2 md:p-3 text-sm md:text-base"
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
                    className="w-full border rounded-lg p-2 md:p-3 text-sm md:text-base"
                    placeholder="e.g. React, Data Science"
                  />
                </div>

                <div className="flex justify-end space-x-3 md:space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-3 py-1 md:px-4 md:py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
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
    </div>
  );
};

export default ProfilePage;
