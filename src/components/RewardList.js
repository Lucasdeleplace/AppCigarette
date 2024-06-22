import React from 'react';
import * as Realm from "realm-web";

const APP_ID = "data-cigarette-anvncfi"; // Remplacez par votre ID d'application Realm

const RewardList = ({ points, setPoints}) => {
  const rewards = [
    { id: 1, text: 'Reward', cost: 5 },
    { id: 2, text: 'Reward Illimité', cost: 10 },
    { id: 3, text: 'Reward', cost: 15 },
    { id: 4, text: 'Reward', cost: 20 },
    { id: 5, text: 'Reward Tea', cost: 50 },
    { id: 6, text: 'Reward au choix', cost: 150 },
    { id: 7, text: 'Reward', cost: 300 },
  ];

  const buyReward = async (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (points >= reward.cost) {
      console.log("Buy");
      setPoints(points - reward.cost);

      const newPoints = points - reward.cost;

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
    
        const options = { upsert: true }; // Crée le document s'il n'existe pas
    
        const result = await collection.updateOne(filter, update, options);
        console.log(`Document mis à jour avec succès: ${result.modifiedCount}`);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des données:", error);
      }

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
