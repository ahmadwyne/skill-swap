import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEngagementStats } from '../../redux/slices/adminSlice';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';


// Helper to turn zero-based index into ordinal label
const getOrdinal = (i) => {
  const n = i + 1;
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
};

const UserCard = ({ user, rank }) => {
  const {
    name,
    email,
    skillsToTeach,
    skillsToLearn,
    role,
    profilePicture,
    socials,
    status,
    sessionCount,
  } = user;

  const defaultAvatar = '/default-avatar.png';

  return (
    <div className="relative bg-white border border-blue-900 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-200 mb-6">
      {/* Golden Ribbon */}
      <div className="absolute top-0 left-0">
        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-br-lg">
          #{getOrdinal(rank)}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-blue-900 text-white">
        <img
          className="h-14 w-14 rounded-full object-cover border-2 border-white"
          src={
            profilePicture
              ? `http://localhost:5000/uploads/profile-pictures/${profilePicture}`
              : defaultAvatar
          }
          alt={`${name}'s avatar`}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = defaultAvatar; }}
        />
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-sm opacity-90">{email}</p>
        </div>
        <span className="ml-auto bg-white text-blue-900 text-sm font-medium px-3 py-1 rounded">
          {sessionCount} session{sessionCount !== 1 && 's'}
        </span>
      </div>

      {/* Body (text-left ensures all headings/content align to the left) */}
      <div className="px-6 py-4 space-y-4 text-left">
        <div className="flex flex-wrap gap-8 text-blue-900 justify-start">
          <div>
            <h4 className="font-medium">Role</h4>
            <p className="mt-1">{role}</p>
          </div>
          <div>
            <h4 className="font-medium">Status</h4>
            <p className="mt-1">{status || '—'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-900">Skills To Teach</h4>
          <div className="flex flex-wrap gap-2 mt-1 justify-start">
            {skillsToTeach.length ? (
              skillsToTeach.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">None</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-900">Skills To Learn</h4>
          <div className="flex flex-wrap gap-2 mt-1 justify-start">
            {skillsToLearn.length ? (
              skillsToLearn.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">None</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-900">Socials</h4>
          <div className="flex space-x-4 mt-1">
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook profile"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                <FaFacebookF size={20} />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter profile"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                <FaLinkedinIn size={20} />
              </a>
            )}
            {!socials.facebook && !socials.twitter && !socials.linkedin && (
              <span className="text-gray-500 text-sm">No links</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EngagementAnalytics = () => {
  const dispatch = useDispatch();
  const { engagementStats, loading, error } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchEngagementStats());
  }, [dispatch]);

  if (loading) return <p className="text-gray-600 p-6">Loading...</p>;
  if (error) return <p className="text-red-600 p-6">Error: {error}</p>;

  const users = engagementStats.mostActiveUsers || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Most Active Users</h1>
      <div>
        {users.length ? (
          users.map((user, idx) => (
            <UserCard key={user.userId} user={user} rank={idx} />
          ))
        ) : (
          <p className="text-gray-500">No active user data available.</p>
        )}
      </div>
    </div>
  );
};

export default EngagementAnalytics;
