import React, { useState, useEffect } from 'react';
import * as Realm from "realm-web";
import DaysCounter from '../components/DaysCounter';
import PointsCounter from '../components/PointsCounter';
import CigaretteCounter from '../components/CigaretteCounter';
import RewardList from '../components/RewardList';
import TimeReset from '../components/TimeReset';

const APP_ID = "data-cigarette-anvncfi"; // Remplacez par votre ID d'application Realm

const Home = () => {
  const [days, setDays] = useState(0);
  const [points, setPoints] = useState(0);
  const [cigarettes, setCigarettes] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Ajout de l'état isLoading

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
          setDays(latest.days);
          setPoints(latest.points);
          setCigarettes(latest.cigarettes);
        }
        setIsLoading(false); // Données chargées, on met isLoading à false
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false); // En cas d'erreur, on met aussi isLoading à false
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>; // Affiche un message de chargement
  }

  const handleCigaretteChange = async (change) => {
    const newCigarettes = cigarettes + change;
    setCigarettes(newCigarettes);
    await saveData(days, points, newCigarettes);
  };

  const handleReset = async () => {
    const newDays = days + 1;
    const newPoints = cigarettes === 0 ? points + 8 : cigarettes === 1 ? points + 4 : cigarettes === 2 ? points + 2 : cigarettes === 3 ? points + 1 : points - (cigarettes - 3)
    setDays(newDays);
    setPoints(newPoints);
    setCigarettes(0);
    
    saveData(newDays, newPoints, 0);
  };

  const saveData = async (days, points, cigarettes) => {
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
        },
      };
  
      const options = { upsert: true }; // Crée le document s'il n'existe pas
  
      const result = await collection.updateOne(filter, update, options);
      console.log(`Document mis à jour avec succès: ${result.modifiedCount}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données:", error);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="left-content">
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
