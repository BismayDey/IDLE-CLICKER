import React, { useState, useEffect } from "react";
import "./App.css";

// Sound imports
import clickSound from "./sounds/click.mp3";
import upgradeSound from "./sounds/upgrade.mp3";

function App() {
  const [resources, setResources] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [comboClick, setComboClick] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [clickUpgradeCost, setClickUpgradeCost] = useState(10);
  const [incomeUpgradeCost, setIncomeUpgradeCost] = useState(50);
  const [multiplierCost, setMultiplierCost] = useState(200);
  const [resourceCap, setResourceCap] = useState(100);
  const [comboTimeout, setComboTimeout] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [blinking, setBlinking] = useState(false); // Blinking effect for resources

  // Sound effects
  const clickAudio = new Audio(clickSound);
  const upgradeAudio = new Audio(upgradeSound);

  // Handle click resource generation
  const handleClick = () => {
    clickAudio.play();
    let additionalResources = clickPower * multiplier;
    setBlinking(true); // Start blinking effect

    if (resources + additionalResources <= resourceCap) {
      setResources((prev) => prev + additionalResources);
      setComboClick((prev) => prev + 1);
      triggerComboBonus();
    }

    if (comboTimeout) clearTimeout(comboTimeout);
    setComboTimeout(setTimeout(() => setComboClick(0), 1000));
  };

  // Trigger combo bonus
  const triggerComboBonus = () => {
    if (comboClick >= 5) {
      setResources((prev) => prev + comboClick * 2);
      setComboClick(0);
    }
  };

  // Buy click power upgrade
  const buyClickUpgrade = () => {
    if (resources >= clickUpgradeCost) {
      upgradeAudio.play();
      setResources((prev) => prev - clickUpgradeCost);
      setClickPower((prev) => prev + 2);
      setClickUpgradeCost((prev) => prev * 2);
    }
  };

  // Buy passive income upgrade
  const buyPassiveIncomeUpgrade = () => {
    if (resources >= incomeUpgradeCost) {
      upgradeAudio.play();
      setResources((prev) => prev - incomeUpgradeCost);
      setPassiveIncome((prev) => prev + 1);
      setIncomeUpgradeCost((prev) => prev * 2);
    }
  };

  // Buy resource multiplier
  const buyMultiplier = () => {
    if (resources >= multiplierCost) {
      upgradeAudio.play();
      setResources((prev) => prev - multiplierCost);
      setMultiplier((prev) => prev * 2);
      setMultiplierCost((prev) => prev * 3);
    }
  };

  // Passive income generation
  useEffect(() => {
    if (passiveIncome > 0) {
      const interval = setInterval(() => {
        if (resources + passiveIncome <= resourceCap) {
          setResources((prev) => prev + passiveIncome * multiplier);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [passiveIncome, resources, multiplier, resourceCap]);

  // Achievements logic
  useEffect(() => {
    if (resources >= 100 && !achievements.includes("100 Resources Collected")) {
      setAchievements([...achievements, "100 Resources Collected"]);
      setResources((prev) => prev + 10);
    }
    if (resources >= 500 && !achievements.includes("500 Resources Collected")) {
      setAchievements([...achievements, "500 Resources Collected"]);
      setResources((prev) => prev + 50);
    }
    if (
      resources >= resourceCap &&
      !achievements.includes("Resource Cap Reached")
    ) {
      setAchievements([...achievements, "Resource Cap Reached"]);
      setResources((prev) => prev + 100);
    }
  }, [resources, achievements, resourceCap]);

  // Resource cap progression logic
  useEffect(() => {
    if (resources >= resourceCap) {
      setResourceCap((prev) => prev + 100);
    }
  }, [resources, resourceCap]);

  // Blinking effect for resources
  useEffect(() => {
    if (blinking) {
      const timer = setTimeout(() => setBlinking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [blinking]);

  // Random event trigger
  useEffect(() => {
    const randomEvent = () => {
      if (Math.random() < 0.1) {
        // 10% chance of a random event
        setResources((prev) => prev + 50);
      }
    };

    const interval = setInterval(randomEvent, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Leaderboard handling (for simplicity, store in local state)
  useEffect(() => {
    const newLeaderboard = [...leaderboard, resources]
      .sort((a, b) => b - a)
      .slice(0, 5);
    setLeaderboard(newLeaderboard);
  }, [resources]);

  return (
    <div className="game-container">
      <h1 className="title">Idle Clicker Game</h1>
      <p className={`resources ${blinking ? "blink" : ""}`}>
        Resources: {resources} / {resourceCap}
      </p>
      <button className="click-button" onClick={handleClick}>
        Click Me! (+{clickPower * multiplier})
      </button>
      <div className="upgrades">
        <h2 className="section-title">Upgrades</h2>
        <button className="upgrade-button" onClick={buyClickUpgrade}>
          Upgrade Click Power (Cost: {clickUpgradeCost} resources)
        </button>
        <button className="upgrade-button" onClick={buyPassiveIncomeUpgrade}>
          Upgrade Passive Income (Cost: {incomeUpgradeCost} resources)
        </button>
        <button className="upgrade-button" onClick={buyMultiplier}>
          Buy Resource Multiplier x{multiplier} (Cost: {multiplierCost}{" "}
          resources)
        </button>
      </div>
      <div className="passive-income">
        <p>Passive Income: {passiveIncome * multiplier} / sec</p>
      </div>
      <div className="achievements">
        <h2 className="section-title">Achievements</h2>
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <p key={index} className="achievement-item">
              {achievement}
            </p>
          ))
        ) : (
          <p className="achievement-item">No achievements yet.</p>
        )}
      </div>
      <div className="leaderboard">
        <h2 className="section-title">Leaderboard</h2>
        {leaderboard.length > 0 ? (
          leaderboard.map((score, index) => (
            <p key={index} className="leaderboard-item">
              {index + 1}. {score} Resources
            </p>
          ))
        ) : (
          <p className="leaderboard-item">No scores yet.</p>
        )}
      </div>
      <div className="progress-bar">
        <p>Progress: {(resources / resourceCap) * 100}%</p>
        <div
          className="progress"
          style={{ width: `${(resources / resourceCap) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default App;
