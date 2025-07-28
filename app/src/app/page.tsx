'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import styles from "./tictactoe.module.css";

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

type Player = "X" | "O";
type Cell = Player | null;

export default function TicTacToe() {
  const { width, height } = useWindowSize();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "draw">("playing");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const checkWinner = (newBoard: Cell[]): { winner: Player | null; pattern: number[] | null } => {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a] as Player, pattern };
      }
    }
    return { winner: null, pattern: null };
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameStatus !== "playing") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, pattern } = checkWinner(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningPattern(pattern);
      setGameStatus("won");
      setScores(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
    } else if (newBoard.every(cell => cell !== null)) {
      setGameStatus("draw");
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setWinningPattern(null);
    setWinner(null);
    setGameStatus("playing");
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className={styles.container}>
      {gameStatus === "won" && (
        <Confetti 
          width={width} 
          height={height} 
          numberOfPieces={250} 
          recycle={false} 
        />
      )}
      
      <div className={styles.gameCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Tic Tac Toe</h1>
          
          <div className={styles.scores}>
            <div className={styles.scoreItem}>
              <div className={`${styles.scoreNumber} ${styles.scoreNumberX}`}>
                {scores.X}
              </div>
              <div className={styles.scoreLabel}>X</div>
            </div>
            <div className={styles.scoreItem}>
              <div className={`${styles.scoreNumber} ${styles.scoreNumberDraw}`}>
                {scores.draws}
              </div>
              <div className={styles.scoreLabel}>Draws</div>
            </div>
            <div className={styles.scoreItem}>
              <div className={`${styles.scoreNumber} ${styles.scoreNumberO}`}>
                {scores.O}
              </div>
              <div className={styles.scoreLabel}>O</div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {gameStatus === "playing" && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={styles.status}
              >
                <span className={currentPlayer === "X" ? styles.playerX : styles.playerO}>
                  Player {currentPlayer}
                </span>&apos;s turn
              </motion.div>
            )}
            
            {gameStatus === "won" && (
              <motion.div
                key="won"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`${styles.status} ${styles.statusWon}`}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className={styles.emoji}
                >
                  🎉
                </motion.span>
                <span className={winner === "X" ? styles.playerX : styles.playerO}>
                  Player {winner}
                </span> wins!
              </motion.div>
            )}

            {gameStatus === "draw" && (
              <motion.div
                key="draw"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`${styles.status} ${styles.statusDraw}`}
              >
                <span className={styles.emoji}>🤝</span>
                It&apos;s a draw!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.board}>
          <div className={styles.boardGrid}>
            {board.map((cell, index) => (
              <motion.button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`
                  ${styles.cell}
                  ${winningPattern?.includes(index) && gameStatus === "won" ? styles.cellWinning : ''}
                  ${!cell && gameStatus === "playing" ? styles.cellPlaying : ''}
                `}
                disabled={!!cell || gameStatus !== "playing"}
                whileHover={!cell && gameStatus === "playing" ? { scale: 1.02 } : {}}
                whileTap={!cell && gameStatus === "playing" ? { scale: 0.98 } : {}}
                animate={winningPattern?.includes(index) && gameStatus === "won" ? { 
                  scale: [1, 1.02, 1], 
                  boxShadow: [
                    "0 4px 6px -1px rgba(0,0,0,0.1)",
                    "0 0px 24px 2px #fca5a5",
                    "0 4px 6px -1px rgba(0,0,0,0.1)"
                  ] 
                } : {}}
                transition={winningPattern?.includes(index) && gameStatus === "won" ? { 
                  repeat: Infinity, 
                  duration: 0.8, 
                  ease: "easeInOut" 
                } : {}}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 15 
                      }}
                      className={`${styles.cellContent} ${cell === "X" ? styles.playerX : styles.playerO}`}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        <div className={styles.buttons}>
          <motion.button
            onClick={resetGame}
            className={`${styles.button} ${styles.buttonPrimary}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            New Game
          </motion.button>
          
          <motion.button
            onClick={resetScores}
            className={`${styles.button} ${styles.buttonSecondary}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Scores
          </motion.button>
        </div>
      </div>
    </div>
  );
}
