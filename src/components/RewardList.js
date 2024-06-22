// RewardList.js

import React from 'react';

const RewardList = ({ points, setPoints }) => {
  const rewards = [
    { id: 1, text: 'Câlins Illimité', cost: 5 },
    { id: 2, text: 'Bisous Illimité', cost: 10 },
    { id: 3, text: 'Texte', cost: 15 },
    { id: 4, text: 'Massage', cost: 20 },
    { id: 5, text: 'Bubble Tea', cost: 50 },
    { id: 6, text: 'Restaurant au choix', cost: 150 },
    { id: 7, text: 'Disney', cost: 300 },
  ];

  const buyReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (points >= reward.cost) {
      console.log("Buy");
      setPoints(points - reward.cost);

      // Envoi du message à Discord
      const message = `N'amour vient d'acheter la récompense : ${reward.text}`;
      fetch('https://discord.com/api/webhooks/1253843365305516104/yHjCt8nZCGKGeIf1aJUc-bYjykFwkAw8eIwvwqrQpmXXXgBEo0uLKkHshume_7zNApvD', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message
        })
      }).then(response => {
        if (!response.ok) {
          console.error('Erreur lors de l\'envoi du message à Discord');
        }
      }).catch(error => {
        console.error('Erreur lors de l\'envoi du message à Discord', error);
      });
    }
  };

  return (
    <div className="reward-list-scrollable">
      {rewards.map(reward => (
        <div key={reward.id} className="reward-item">
          <span className="reward-text">{reward.text}</span>
          <button className="reward-button" onClick={() => buyReward(reward.id)} disabled={points < reward.cost}>
            Acheter pour {reward.cost} points
          </button>
        </div>
      ))}
    </div>
  );
};

export default RewardList;
