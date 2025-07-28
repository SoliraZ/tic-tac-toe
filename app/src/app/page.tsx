import React from "react";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
    }}>
      <div style={{
        width: 600,
        height: 600,
        border: "4px solid #000",
        borderRadius: 8,
        background: "transparent",
        position: "relative",
        boxSizing: "border-box",
      }}>
        {/* Vertical lines */}
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
            }}
          />
        ))}
        {/* Horizontal lines */}
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
            }}
          />
        ))}
      </div>
    </div>
  );
}
