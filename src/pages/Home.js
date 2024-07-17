import React, { useState, useEffect } from 'react';
import * as Realm from "realm-web";
import DaysCounter from '../components/DaysCounter';
import PointsCounter from '../components/PointsCounter';
import CigaretteCounter from '../components/CigaretteCounter';
import RewardList from '../components/RewardList';
import TimeReset from '../components/TimeReset';
import DailyChallenge from '../components/DailyChallenge';

const APP_ID = "data-cigarette-anvncfi"; 

const Home = () => {
  const [days, setDays] = useState(0);
  const [points, setPoints] = useState(0);
  const [cigarettes, setCigarettes] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState(""); 
  const [isLoading, setIsLoading] = useState(true); 
  const [completed, setCompleted] = useState(false); 

  
  const listChallenge = [
    { id: 1, challenge: "Ne pas fumer pendant 24h"},
    { id: 2, challenge: "Allez faire un tour dehors pendant 10 minutes"},
    { id: 3, challenge: "M'ecrire une truc d'amour (un petit truc pas un texte)"},
    { id: 4, challenge: "Te reveiller à 10h - 10h30 au plus tard"},
    { id: 5, challenge: "Faire un truc que tu ne fais pas d'habitude mais que tu devrais faire"},
  ];

  useEffect(() => {
    const fetchData = async () => {
      const app = new Realm.App({ id: APP_ID });
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        const mongo = user.mongoClient("mongodb-atlas");
        const collection = mongo.db("app-data").collection("data");
        const data = await collection.find({});
        if (data.length > 0) {
          const latest = data[data.length - 1];
          setDailyChallenge(latest.dailychallenges); 
          setDays(latest.days);
          setPoints(latest.points);
          setCigarettes(latest.cigarettes);
          setCompleted(latest.completed);
          
        }
        setIsLoading(false); 
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false); 
      }
    };
    fetchData();
  }, [points, days, cigarettes, dailyChallenge, completed]);

  if (isLoading) {
    return <div>Chargement...</div>; 
  }

  const handleCigaretteChange = async (change) => {
    const newCigarettes = cigarettes + change;
    setCigarettes(newCigarettes);
    await saveData(days, points, newCigarettes);
  };

  const handleReset = async () => {
    const newDays = days + 1;
    const newPoints = cigarettes === 0 ? points + 8 : cigarettes === 1 ? points + 4 : cigarettes === 2 ? points + 2 : cigarettes === 3 ? points + 1 : points - (cigarettes - 3)
    let newChallenge = ""
    setDays(newDays);
    setPoints(newPoints);
    setCigarettes(0);
    if(completed) {
      newChallenge = listChallenge[Math.floor(Math.random() * listChallenge.length)].challenge; 
      setDailyChallenge(newChallenge); 
    } else {
      newChallenge = dailyChallenge;
    }
    setCompleted(false);

    saveData(newDays, newPoints, 0, newChallenge, false);
  };

  const saveData = async (days, points, cigarettes, dailyChallenges, completed) => {
    const app = new Realm.App({ id: APP_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("app-data").collection("data");
  
      const filter = { _id: "1" };
  
      const update = {
        $set: {
          days: days,
          points: points,
          cigarettes: cigarettes,
          dailychallenges: dailyChallenges,
          completed: completed,
        },
      };
  
      const options = { upsert: true }; 
  
      const result = await collection.updateOne(filter, update, options);
      console.log(`Document mis à jour avec succès: ${result.modifiedCount}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données:", error);
    }
  };

  const handleChange = async () => {
    const newPoints = points + 5;
    setCompleted(true);
    setPoints(newPoints);
    await saveData(days, newPoints, cigarettes, dailyChallenge, true);
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="left-content">
        <DailyChallenge challenge={dailyChallenge} onClick={handleChange} completed={completed} />
          <DaysCounter days={days} />
          <PointsCounter points={points} />
          <CigaretteCounter cigarettes={cigarettes} onChange={handleCigaretteChange} />
          <TimeReset onReset={handleReset} />
        </div>
        <RewardList points={points} setPoints={setPoints} />
      </div>
    </div>
  );
};

export default Home;
