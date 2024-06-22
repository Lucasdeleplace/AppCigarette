import React from 'react';

const PointsCounter = ({ points }) => {
  return (
    <div className="counter">
      <h2>{points} Points</h2>
    </div>
  );
};

export default PointsCounter;
