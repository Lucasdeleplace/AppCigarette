import React, { useState, useEffect } from 'react';
import * as Realm from "realm-web";


// Add setPoints to the component's props
const DailyChallenge = ({ challenge, points, setPoints }) => {
    const [completed, setCompleted] = useState(false);
    const [point, setPoint] = useState(points);
  
    const handleComplete = () => {
      setCompleted(true);
      setPoint(point + 5);
    };
  
    useEffect(() => {
      if (completed) {
        const app = new Realm.App({ id: "data-cigarette-anvncfi" });
        const credentials = Realm.Credentials.anonymous();
        const saveData = async () => {
          try {
            const user = await app.logIn(credentials);
            const mongo = user.mongoClient("mongodb-atlas");
            const collection = mongo.db("app-data").collection("data");
            const data = await collection.find({});
            const latest = data[data.length - 1];
            await collection.updateOne({ _id: latest._id }, { $set: { points: point } });
    
            // Use setPoints here to update the points in the parent component
            setPoints(point);
          } catch (error) {
            console.error("Failed to save data:", error);
          }
        };
        saveData();
      }
    }, [completed, points, point, setPoints]); // Include setPoints in the dependency array
  
    return (
      <div className="daily-challenge">
        <h2>Défi du jour</h2>
        <p>{challenge}</p>
        <button onClick={handleComplete} disabled={completed}>
          {completed ? 'Complété' : 'Marquer comme complété'}
        </button>
      </div>
    );
  };
  
  export default DailyChallenge;