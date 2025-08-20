"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./home.module.css";
import TicTacToeGame from "./components/TicTacToeGame";

export default function HomePage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const gameModes = [
    {
      id: "pvp",
      title: "Player vs Player",
      description: "Play against a friend on the same device",
      icon: "👥",
      color: "#3b82f6"
    },
    {
      id: "pve",
      title: "Player vs Bot",
      description: "Challenge our AI opponent",
      icon: "🤖",
      color: "#ef4444"
    }
  ];

  if (selectedMode) {
    return (
      <TicTacToeGame 
        mode={selectedMode} 
        onBackToMenu={() => setSelectedMode(null)} 
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Tic Tac Toe</h1>
          <p className={styles.subtitle}>Choose your game mode</p>
        </motion.div>

        <div className={styles.modesGrid}>
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={styles.modeCard}
              onClick={() => setSelectedMode(mode.id)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className={styles.modeIcon}
                style={{ backgroundColor: mode.color }}
              >
                <span className={styles.iconText}>{mode.icon}</span>
              </div>
              <h3 className={styles.modeTitle}>{mode.title}</h3>
              <p className={styles.modeDescription}>{mode.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.footer}
        >
          <p>Select a mode to start playing!</p>
        </motion.div>
      </div>
    </div>
  );
}
