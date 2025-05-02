export default function ProfileCard({ user }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 w-80 text-center">
      <img
        className="mx-auto h-24 w-24 rounded-full object-cover"
        src={user.profilePicture || '/default-avatar.png'}
        alt="Avatar"
      />
      <h3 className="mt-4 text-xl font-semibold">{user.name}</h3>
      <p className="text-gray-500">{user.status}</p>
      <div className="mt-2">
        {user.socials?.linkedin && (
          <a href={user.socials.linkedin} className="text-blue-500" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
  