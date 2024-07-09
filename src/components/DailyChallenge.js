import React from 'react';


// Add setPoints to the component's props
const DailyChallenge = ({ challenge, onClick, completed }) => {
  
    return (
      <div className="daily-challenge">
        <h2>Défi du jour</h2>
        <p>{challenge}</p>
        <button onClick={onClick} disabled={completed}>
          {completed ? 'Complété' : 'Marquer comme complété'}
        </button>
      </div>
    );
  };
  
  export default DailyChallenge;