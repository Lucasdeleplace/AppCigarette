import React, { useState, useEffect } from 'react';
import * as Realm from "realm-web";

const APP_ID = "data-cigarette-anvncfi"; 

const RewardList = ({ points, setPoints }) => {
  let id = 1;
  const [showHearts, setShowHearts] = useState(false);
  const [heartPositions, setHeartPositions] = useState([]);
  const rewards = [
    { id: id++, text: 'test', cost: 0 },
    { id: id++, text: 'Calins Illimité', cost: 5 },
    { id: id++, text: 'Bisous Illimité', cost: 10 },
    { id: id++, text: 'Texte', cost: 15 },
    { id: id++, text: 'Massage', cost: 20 },
    { id: id++, text: 'pique-nique', cost: 30 },
    { id: id++, text: 'Une fleur', cost: 35 },
    { id: id++, text: 'Un manga au choix', cost: 45 },
    { id: id++, text: 'Bubble Tea', cost: 50 },
    { id: id++, text: 'Bouquet de fleurs', cost: 85 },
    { id: id++, text: 'Resto au choix', cost: 150 },
    { id: id++, text: 'AquaPark', cost: 200 },
    { id: id++, text: 'Go to plus grand magasin de bonbon', cost: 250 },
    { id: id++, text: 'Parc d\'attraction au choix', cost: 300 },
    { id: id++, text: 'Disney', cost: 500 },
  ];

  useEffect(() => {
    console.log("showHearts changed:", showHearts);
  }, [showHearts]);

  const buyReward = async (rewardId, event) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (points >= reward.cost) {
      const rect = event.target.getBoundingClientRect();
      const containerRect = event.target.closest('.reward-list-scrollable').getBoundingClientRect();
      const positions = Array.from({ length: 10 }).map(() => {
        const offsetX = Math.random() * 50 - 25; 
        const offsetY = Math.random() * 50 - 25; 
        return {
          top: rect.top - containerRect.top + rect.height / 2 + offsetY,
          left: rect.left - containerRect.left + rect.width / 2 + offsetX,
          delay: Math.random() * 0.5
        };
      });

      setHeartPositions(positions);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 4000); 
      const newPoints = points - reward.cost;

      setPoints(newPoints);

      const app = new Realm.App({ id: APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        const mongo = user.mongoClient("mongodb-atlas");
        const collection = mongo.db("app-data").collection("data");

        const filter = { _id: "1" };

        const update = {
          $set: {
            points: newPoints,
          },
        };

        const options = { upsert: true }; 

        const result = await collection.updateOne(filter, update, options);
        console.log(`Document updated successfully: ${result.modifiedCount}`);
      } catch (error) {
        console.error("Error updating data:", error);
      }

      const message = `<@371386482717622273> N'amour vient d'acheter la récompense : ${reward.text}`;
        
      if (reward.text !== "test") {
        fetch('https://discord.com/api/webhooks/1257062671019151481/zshG68Df69ewEfjF_vi7MyKnns82LL0lkuCboeYbHzkQzYIBjlbYzgFMgGjh1OM-7RGB', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: message
          })
        }).then(response => {
          if (!response.ok) {
            console.error('Error sending message to Discord');
          }
        }).catch(error => {
          console.error('Error sending message to Discord', error);
        });
      }
    } else {
      alert('Vous n\'avez pas assez de points pour acheter cette récompense');
    }
  };

  return (
    <div className="reward-list-scrollable" style={{ position: 'relative' }}>
      {rewards.map(reward => (
        <div key={reward.id} className={`reward-item`}>
          <span className="reward-text">{reward.text}</span>
          <button className="reward-button" onClick={(event) => buyReward(reward.id, event)} disabled={points < reward.cost}>
            Acheter pour {reward.cost} points
          </button>
        </div>
      ))}
      {showHearts && heartPositions.map((position, index) => (
        <div key={index} className="heart" style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translate(-50%, -50%)',
          animation: `flyHearts 5s linear forwards ${position.delay}s`,
          fontSize: '24px',
          color: 'red'
        }}>
          ❤️
        </div>
      ))}
    </div>
  );
};

export default RewardList;
