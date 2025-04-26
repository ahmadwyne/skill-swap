import React from 'react';

const MatchList = ({ matches, handleScheduleSession, sendSessionRequest, setSessionDate, setSessionTime }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {matches.length > 0 ? (
        matches.map((match) => (
          <div key={match.user._id} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold">{match.user.name}</h2>
            <p className="mt-2 text-gray-600">{match.user.email}</p>

            {/* Display matched skills */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Matched Skills:</h3>
              {match.matchedSkills.length > 0 ? (
                <ul className="list-disc pl-5">
                  {match.matchedSkills.map((matchSkill, index) => (
                    <li key={index} className="text-gray-700">
                      <strong>{matchSkill.teachSkill}</strong> → {matchSkill.learnSkill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No matched skills</p>
              )}
            </div>

            {/* Date and Time Inputs */}
            <div className="mt-4">
              <label className="block text-lg">Select Date:</label>
              <input
                type="date"
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
              />
            </div>

            <div className="mt-4">
              <label className="block text-lg">Select Time:</label>
              <input
                type="time"
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
              />
            </div>

            {/* Buttons for messaging and scheduling session */}
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => sendSessionRequest(match.user._id)} 
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Send Session Request
              </button>
              <button
                onClick={() => handleScheduleSession(match.user._id)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Schedule Session
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No matches available at the moment.</p>
      )}
    </div>
  );
};

export default MatchList;
