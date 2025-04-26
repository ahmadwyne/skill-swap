// src/components/MatchList.jsx
import React from 'react';
import MatchCard from './MatchCard';

const MatchList = ({ matches }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {matches.length > 0 ? (
        matches.map((match) => (
          <MatchCard key={match.user._id} match={match} />
        ))
      ) : (
        <p className="text-center text-gray-500">No matches available at the moment.</p>
      )}
    </div>
  );
};

export default MatchList;
