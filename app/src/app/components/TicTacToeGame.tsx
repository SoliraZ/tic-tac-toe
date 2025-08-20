"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import styles from "../tictactoe.module.css";

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

type Player = "X" | "O";
type Cell = Player | null;
type GameMode = "pvp" | "pve";

interface TicTacToeGameProps {
  mode: GameMode;
  onBackToMenu: () => void;
}

export default function TicTacToeGame({ mode, onBackToMenu }: TicTacToeGameProps) {
  const { width, height } = useWindowSize();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "draw">("playing");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningPattern, setWinningPattern] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Bot enhancement features
  const [botDifficulty, setBotDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [moveHistory, setMoveHistory] = useState<number[]>([]);
  const [playerPatterns, setPlayerPatterns] = useState({
    favoriteCorners: [] as number[],
    openingMoves: [] as number[],
    style: "balanced" as "aggressive" | "defensive" | "balanced"
  });

  // Bot algorithm - Minimax with Alpha-Beta pruning
  const evaluateBoard = (board: Cell[]): number => {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? 10 : -10;
      }
    }
    return 0;
  };

  const getAvailableMoves = (board: Cell[]): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  };

  const minimax = (board: Cell[], depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
    const score = evaluateBoard(board);
    
    // Terminal conditions
    if (score === 10) return score - depth; // Bot wins
    if (score === -10) return score + depth; // Player wins
    if (getAvailableMoves(board).length === 0) return 0; // Draw
    
    if (isMaximizing) {
      let best = -1000;
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board];
        newBoard[move] = "O"; // Bot plays as O
        const value = minimax(newBoard, depth + 1, alpha, beta, false);
        best = Math.max(best, value);
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return best;
    } else {
      let best = 1000;
      for (const move of getAvailableMoves(board)) {
        const newBoard = [...board];
        newBoard[move] = "X"; // Player plays as X
        const value = minimax(newBoard, depth + 1, alpha, beta, true);
        best = Math.min(best, value);
        beta = Math.min(beta, best);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return best;
    }
  };

  // Enhanced bot move selection with difficulty and personality
  const getTopMoves = (board: Cell[]): Array<{ move: number; value: number }> => {
    const moves: Array<{ move: number; value: number }> = [];
    const alpha = -1000;
    const beta = 1000;
    
    for (const move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = "O";
      // Start with maximizing for O (bot's turn)
      const moveValue = minimax(newBoard, 0, alpha, beta, false);
      moves.push({ move, value: moveValue });
    }
    
    // Sort by value (best first)
    return moves.sort((a, b) => b.value - a.value);
  };

  const selectMoveWithDifficulty = (topMoves: Array<{ move: number; value: number }>): number => {
    if (topMoves.length === 0) return -1;
    
    const random = Math.random();
    console.log(`🎲 Difficulty selection - Random: ${random.toFixed(3)}, Difficulty: ${botDifficulty}`);
    
    switch (botDifficulty) {
      case "easy":
        // 70% random, 30% best move
        const isRandom = random < 0.7;
        const easyMove = isRandom ? topMoves[Math.floor(Math.random() * topMoves.length)].move : topMoves[0].move;
        console.log(`🟢 Easy mode - Random move: ${isRandom ? 'Yes' : 'No'} (${random < 0.7 ? '70%' : '30%'}), Selected: ${easyMove}`);
        return easyMove;
      
      case "medium":
        // 20% random, 30% second-best, 50% best move
        let mediumMove;
        if (random < 0.2) {
          mediumMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;
          console.log(`🟡 Medium mode - Random move: ${mediumMove} (20% chance)`);
        } else if (random < 0.5 && topMoves.length > 1) {
          mediumMove = topMoves[1].move;
          console.log(`🟡 Medium mode - Second best move: ${mediumMove} (30% chance)`);
        } else {
          mediumMove = topMoves[0].move;
          console.log(`🟡 Medium mode - Best move: ${mediumMove} (50% chance)`);
        }
        return mediumMove;
      
      case "hard":
        // 100% best move (perfect play)
        console.log(`🔴 Hard mode - Perfect play, Best move: ${topMoves[0].move}`);
        return topMoves[0].move;
      
      default:
        return topMoves[0].move;
    }
  };



  const checkWinningPotential = (board: Cell[], move: number, player: Player): number => {
    const newBoard = [...board];
    newBoard[move] = player;
    
    // Check if this move creates a win
    const { winner } = checkWinner(newBoard);
    if (winner === player) return 10;
    
    // Check if this move creates multiple winning threats
    let threats = 0;
    for (const pattern of WIN_PATTERNS) {
      if (pattern.includes(move)) {
        const [a, b, c] = pattern;
        if (newBoard[a] === player && newBoard[b] === player && newBoard[c] === null) threats++;
        if (newBoard[a] === player && newBoard[c] === player && newBoard[b] === null) threats++;
        if (newBoard[b] === player && newBoard[c] === player && newBoard[a] === null) threats++;
      }
    }
    
    return threats;
  };

  const checkBlockingPotential = (board: Cell[], move: number): number => {
    const newBoard = [...board];
    newBoard[move] = "X"; // Check if this blocks player's win
    
    // Check if this move blocks a win
    const { winner } = checkWinner(newBoard);
    if (winner === "X") return 10;
    
    // Check if this move blocks multiple threats
    let blocks = 0;
    for (const pattern of WIN_PATTERNS) {
      if (pattern.includes(move)) {
        const [a, b, c] = pattern;
        if (newBoard[a] === "X" && newBoard[b] === "X" && newBoard[c] === null) blocks++;
        if (newBoard[a] === "X" && newBoard[c] === "X" && newBoard[b] === null) blocks++;
        if (newBoard[b] === "X" && newBoard[c] === "X" && newBoard[a] === null) blocks++;
      }
    }
    
    return blocks;
  };

  const getBestMove = (board: Cell[]): number => {
    // First, check if bot can win in one move (highest priority)
    const winningMove = findWinningMove(board, "O");
    if (winningMove !== -1) {
      console.log("Bot found winning move:", winningMove);
      return winningMove;
    }
    
    // Then, check if player can win in one move (block them)
    const blockingMove = findWinningMove(board, "X");
    if (blockingMove !== -1) {
      console.log("Bot blocking player's winning move:", blockingMove);
      return blockingMove;
    }
    
    const topMoves = getTopMoves(board);
    if (topMoves.length === 0) return -1;
    
    console.log("Top moves:", topMoves);
    console.log("Selected difficulty:", botDifficulty);
    
    // Select move based on difficulty
    const selectedMove = selectMoveWithDifficulty(topMoves);
    console.log("Final selected move:", selectedMove);
    
    return selectedMove;
  };

  const findWinningMove = (board: Cell[], player: Player): number => {
    for (const move of getAvailableMoves(board)) {
      const newBoard = [...board];
      newBoard[move] = player;
      const { winner } = checkWinner(newBoard);
      if (winner === player) {
        return move;
      }
    }
    return -1;
  };

  const analyzePlayerPatterns = (moveIndex: number) => {
    const newPatterns = { ...playerPatterns };
    
    // Track opening moves (first 2 moves)
    if (moveHistory.length < 2) {
      newPatterns.openingMoves.push(moveIndex);
    }
    
    // Track favorite corners
    if ([0, 2, 6, 8].includes(moveIndex)) {
      if (!newPatterns.favoriteCorners.includes(moveIndex)) {
        newPatterns.favoriteCorners.push(moveIndex);
      }
    }
    
    // Analyze playing style based on move patterns
    if (moveHistory.length >= 3) {
      const recentMoves = moveHistory.slice(-3);
      const centerMoves = recentMoves.filter(move => move === 4).length;
      const cornerMoves = recentMoves.filter(move => [0, 2, 6, 8].includes(move)).length;
      
      if (centerMoves > cornerMoves) {
        newPatterns.style = "aggressive";
      } else if (cornerMoves > centerMoves) {
        newPatterns.style = "defensive";
      } else {
        newPatterns.style = "balanced";
      }
    }
    
    setPlayerPatterns(newPatterns);
  };

  const makeBotMove = () => {
    console.log("🤖 Bot move initiated", { 
      gameStatus, 
      currentPlayer, 
      mode, 
      difficulty: botDifficulty 
    });
    
    if (gameStatus !== "playing" || currentPlayer !== "O") {
      console.log("❌ Bot move blocked", { gameStatus, currentPlayer });
      return;
    }
    
    setIsBotThinking(true);
    console.log(`🤔 Bot (${botDifficulty}) is thinking...`);
    
    // Add a small delay to make the bot move feel more natural
    setTimeout(() => {
      const bestMove = getBestMove(board);
      console.log(`🎯 Bot (${botDifficulty}) calculated best move:`, bestMove);
      
      if (bestMove !== -1) {
        // Create a new board with the bot's move
        const newBoard = [...board];
        newBoard[bestMove] = "O";
        setBoard(newBoard);
        console.log(`✅ Bot (${botDifficulty}) made move at index:`, bestMove);
        
        // Check for winner after bot's move
        const { winner: gameWinner, pattern } = checkWinner(newBoard);
        
        if (gameWinner) {
          setWinner(gameWinner);
          setWinningPattern(pattern);
          setGameStatus("won");
          setScores(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }));
          console.log(`🏆 Bot (${botDifficulty}) WON the game!`);
        } else if (newBoard.every(cell => cell !== null)) {
          setGameStatus("draw");
          setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          console.log(`🤝 Game ended in a DRAW`);
        } else {
          setCurrentPlayer("X"); // Switch to player's turn
          console.log(`🔄 Turn switched to player (X)`);
        }
      }
      setIsBotThinking(false);
    }, 500);
  };

  // Set initial player based on mode
  useEffect(() => {
    setCurrentPlayer("X"); // X always goes first in Tic Tac Toe
    if (mode === "pve") {
      console.log(`🎮 New PvE game started with Bot difficulty: ${botDifficulty}`);
    }
  }, [mode, botDifficulty]);

  // Bot makes move when it's its turn
  useEffect(() => {
    console.log("useEffect triggered", { mode, currentPlayer, gameStatus, isBotThinking, gameStarted });
    if (mode === "pve" && currentPlayer === "O" && gameStatus === "playing" && !isBotThinking && gameStarted) {
      console.log("Calling makeBotMove from useEffect");
      makeBotMove();
    }
  }, [currentPlayer, gameStatus, mode, isBotThinking, gameStarted]);

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
    console.log("handleCellClick called", { index, currentPlayer, mode, gameStatus });
    if (board[index] || gameStatus !== "playing") return;
    
    // In PvE mode, only allow player moves when it's player's turn
    if (mode === "pve" && currentPlayer === "O") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    console.log("Player made move at index:", index, "as", currentPlayer);
    
    // Mark that the game has started (for PvE mode)
    if (mode === "pve" && !gameStarted) {
      setGameStarted(true);
    }
    
    // Track move history and analyze player patterns
    if (mode === "pve") {
      setMoveHistory(prev => [...prev, index]);
      analyzePlayerPatterns(index);
    }

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
      // In PvE mode, always switch to bot's turn after player move
      if (mode === "pve") {
        console.log("Switching to bot's turn (O)");
        setCurrentPlayer("O");
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
  };

  const resetGame = () => {
    setWinningPattern(null);
    setWinner(null);
    setGameStatus("playing");
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X"); // X always goes first
    setIsBotThinking(false);
    setGameStarted(false);
    setMoveHistory([]);
    setPlayerPatterns({
      favoriteCorners: [],
      openingMoves: [],
      style: "balanced"
    });
    
    if (mode === "pve") {
      console.log(`🔄 New game started with Bot difficulty: ${botDifficulty}`);
    }
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
          <div className={styles.modeIndicator}>
            <button 
              onClick={onBackToMenu}
              className={styles.backButton}
            >
              ← Back to Menu
            </button>
            <span className={styles.modeText}>
              {mode === "pvp" ? "Player vs Player" : "Player vs Bot"}
            </span>
            {mode === "pve" && (
              <div className={styles.botSettings}>
                <label className={styles.difficultyLabel}>Difficulty:</label>
                <select 
                  value={botDifficulty} 
                  onChange={(e) => {
                    const newDifficulty = e.target.value as "easy" | "medium" | "hard";
                    console.log(`🎯 Bot difficulty changed from ${botDifficulty} to ${newDifficulty}`);
                    setBotDifficulty(newDifficulty);
                  }}
                  className={styles.botSelect}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            )}
          </div>
          
          <div className={styles.scores}>
            <div className={styles.scoreItem}>
              <div className={`${styles.scoreNumber} ${styles.scoreNumberX}`}>
                {scores.X}
              </div>
              <div className={styles.scoreLabel}>
                {mode === "pve" ? "You" : "X"}
              </div>
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
              <div className={styles.scoreLabel}>
                {mode === "pve" ? "Bot" : "O"}
              </div>
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
                {mode === "pve" && currentPlayer === "O" && isBotThinking ? (
                  <span>🤖 Bot is thinking...</span>
                ) : (
                  <span className={currentPlayer === "X" ? styles.playerX : styles.playerO}>
                    {mode === "pve" && currentPlayer === "X" ? "You" : mode === "pve" ? `Bot (${botDifficulty})` : `Player ${currentPlayer}`}
                  </span>
                )}&apos;s turn
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
                  {mode === "pve" && winner === "X" ? "You" : mode === "pve" && winner === "O" ? "Bot" : `Player ${winner}`}
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
                key={`${index}-${gameStatus}-${winningPattern?.join(',') || 'none'}`}
                onClick={() => handleCellClick(index)}
                className={`
                  ${styles.cell}
                  ${winningPattern?.includes(index) && gameStatus === "won" ? styles.cellWinning : ''}
                  ${!cell && gameStatus === "playing" ? styles.cellPlaying : ''}
                `}
                disabled={!!cell || gameStatus !== "playing" || (mode === "pve" && currentPlayer === "O")}
                whileHover={!cell && gameStatus === "playing" && !(mode === "pve" && currentPlayer === "O") ? { scale: 1.02 } : {}}
                whileTap={!cell && gameStatus === "playing" && !(mode === "pve" && currentPlayer === "O") ? { scale: 0.98 } : {}}
                animate={winningPattern?.includes(index) && gameStatus === "won" ? { 
                  scale: [1, 1.02, 1], 
                  boxShadow: [
                    "0 4px 6px -1px rgba(0,0,0,0.1)",
                    "0 0px 24px 2px #fca5a5",
                    "0 4px 6px -1px rgba(0,0,0,0.1)"
                  ] 
                } : {
                  scale: 1,
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
                }}
                transition={winningPattern?.includes(index) && gameStatus === "won" ? { 
                  repeat: Infinity, 
                  duration: 0.8, 
                  ease: "easeInOut" 
                } : {
                  duration: 0.2,
                  ease: "easeOut"
                }}
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
