// src/components/MatchCard.jsx
import React from 'react';

const MatchCard = ({ match }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out">
      <h2 className="text-xl font-bold">{match.user.name}</h2>
      <p className="mt-2 text-gray-600">{match.user.email}</p>
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
    </div>
  );
};

export default MatchCard;