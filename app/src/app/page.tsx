'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

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
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameStatus("playing");
    setWinner(null);
    setWinningPattern(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {gameStatus === "won" && (
        <Confetti width={width} height={height} numberOfPieces={250} recycle={false} />
      )}
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        padding: "32px",
        maxWidth: "400px",
        width: "100%"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "bold", 
            color: "#1f2937", 
            marginBottom: "16px",
            margin: "0 0 16px 0"
          }}>
            Tic Tac Toe
          </h1>
          
          {/* Scores */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "24px", 
            marginBottom: "16px" 
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
                {scores.X}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>X</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6b7280" }}>
                {scores.draws}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>Draws</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>
                {scores.O}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>O</div>
            </div>
          </div>

          {/* Game Status */}
          <AnimatePresence mode="wait">
            {gameStatus === "playing" && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ fontSize: "18px", color: "#374751" }}
              >
                Player{" "}
                <span style={{ color: currentPlayer === "X" ? "#ef4444" : "#3b82f6" }}>
                  {currentPlayer}
                </span>{" "}
                turn
              </motion.div>
            )}
            
            {gameStatus === "won" && (
              <motion.div
                key="won"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ fontSize: "20px", fontWeight: "bold" }}
              >
                🎉{" "}
                <span style={{ color: winner === "X" ? "#ef4444" : "#3b82f6" }}>
                  Player {winner}
                </span>{" "}
                wins!
              </motion.div>
            )}
            
            {gameStatus === "draw" && (
              <motion.div
                key="draw"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ fontSize: "20px", fontWeight: "bold", color: "#6b7280" }}
              >
                🤝 It's a draw!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Board */}
        <div style={{ position: "relative", marginBottom: "32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
            backgroundColor: "#e5e7eb",
            padding: "8px",
            borderRadius: "12px",
            margin: "0 auto",
            width: "fit-content"
          }}>
            {board.map((cell, index) => (
              <motion.button
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: winningPattern?.includes(index) ? "#fef2f2" : "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: !cell && gameStatus === "playing" ? "pointer" : "default",
                  transition: "all 0.2s"
                }}
                whileHover={!cell && gameStatus === "playing" ? { scale: 1.02 } : {}}
                whileTap={!cell && gameStatus === "playing" ? { scale: 0.98 } : {}}
                animate={winningPattern?.includes(index) ? { scale: [1, 1.02, 1], boxShadow: [
                  "0 4px 6px -1px rgba(0,0,0,0.1)",
                  "0 0px 24px 2px #fca5a5",
                  "0 4px 6px -1px rgba(0,0,0,0.1)"
                ] } : {}}
                transition={winningPattern?.includes(index) ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : {}}
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
                      style={{ color: cell === "X" ? "#ef4444" : "#3b82f6" }}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <motion.button
            onClick={resetGame}
            style={{
              flex: 1,
              backgroundColor: "#6366f1",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            whileHover={{ scale: 1.02, backgroundColor: "#5856eb" }}
            whileTap={{ scale: 0.98 }}
          >
            New Game
          </motion.button>
          
          <motion.button
            onClick={resetScores}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            whileHover={{ scale: 1.02, backgroundColor: "#565961" }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Scores
          </motion.button>
        </div>
      </div>
    </div>
  );
}
