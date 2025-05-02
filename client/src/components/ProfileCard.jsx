import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function ProfileCard({ user }) {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 w-80 text-center text-white">
      {/* Profile Image */}
      <div className="relative">
        <img
          className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
          src={user?.profilePicture ? `http://localhost:5000/uploads/profile-pictures/${user.profilePicture}` : '/default-avatar.png'}
          alt="Avatar"
        />
      </div>

      {/* User Info */}
      <h3 className="mt-4 text-2xl font-semibold">{user.name}</h3>
      <p className="mt-2 text-lg">{user.status}</p>

      {/* Social Icons */}
      <div className="mt-4 flex justify-center space-x-4">
        {user.socials?.linkedin && (
          <a
            href={user.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-white hover:text-blue-400 transition"
          >
            <FaLinkedin />
          </a>
        )}
        {user.socials?.twitter && (
          <a
            href={user.socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-white hover:text-blue-400 transition"
          >
            <FaTwitter />
          </a>
        )}
        {user.socials?.instagram && (
          <a
            href={user.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-2xl text-white hover:text-pink-400 transition"
          >
            <FaInstagram />
          </a>
        )}
      </div>
    </div>
  );
}
