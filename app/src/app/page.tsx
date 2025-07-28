'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 3;

export default function Home() {
  const [moves, setMoves] = useState<(null | "X" | "O")[]>(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [step, setStep] = useState<0 | 1>(0); // 0: waiting for X, 1: waiting for O
  const [xIndex, setXIndex] = useState<number | null>(null);
  const [oIndex, setOIndex] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    if (moves[idx] !== null) return;
    if (step === 0) {
      setMoves((prev) => prev.map((v, i) => (i === idx ? "X" : v)));
      setXIndex(idx);
      setStep(1);
    } else if (step === 1 && idx !== xIndex) {
      setMoves((prev) => prev.map((v, i) => (i === idx ? "O" : v)));
      setOIndex(idx);
      setStep(0); // Optionally lock after O, or keep as 0 for more moves
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
    }}>
      <div
        style={{
          width: 600,
          height: 600,
          border: "4px solid #000",
          borderRadius: 8,
          background: "transparent",
          position: "relative",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid lines */}
        {[1, 2].map((i) => (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              top: 0,
              left: `${(i * 100) / 3}%`,
              width: 0,
              height: "100%",
              borderLeft: "4px solid #000",
              transform: "translateX(-2px)",
              pointerEvents: "none",
            }}
          />
        ))}
        {[1, 2].map((i) => (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              left: 0,
              top: `${(i * 100) / 3}%`,
              width: "100%",
              height: 0,
              borderTop: "4px solid #000",
              transform: "translateY(-2px)",
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Squares */}
        {moves.map((val, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            style={{
              cursor: val === null && (step === 0 || (step === 1 && xIndex !== null && idx !== xIndex)) ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 120,
              userSelect: "none",
              zIndex: 1,
              position: "relative",
            }}
          >
            {val === "X" && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ color: "#222", fontWeight: 700 }}
              >
                ×
              </motion.span>
            )}
            {val === "O" && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ color: "#1976d2", fontWeight: 700 }}
              >
                ○
              </motion.span>
            )}
            {/* Index in bottom-right */}
            <span style={{
              position: "absolute",
              bottom: 8,
              right: 12,
              fontSize: 20,
              color: "#bbb",
              pointerEvents: "none",
              fontFamily: "monospace"
            }}>{idx}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
