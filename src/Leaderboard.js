// src/Leaderboard.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
} from "firebase/firestore";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchScores = async () => {
      const scoresCollection = collection(db, "leaderboard");
      const q = query(scoresCollection, orderBy("score", "desc"));
      const querySnapshot = await getDocs(q);
      setScores(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchScores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName || score < 0) return;

    await addDoc(collection(db, "leaderboard"), {
      name: playerName,
      score: score,
    });

    setPlayerName("");
    setScore(0);
    // Refresh the leaderboard
    const scoresCollection = collection(db, "leaderboard");
    const q = query(scoresCollection, orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);
    setScores(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your Name"
          required
        />
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder="Your Score"
          required
        />
        <button type="submit">Submit Score</button>
      </form>
      <ul>
        {scores.map((item) => (
          <li key={item.id}>
            {item.name}: {item.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
