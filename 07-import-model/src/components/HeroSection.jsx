// src/components/HeroSection.jsx
import React from "react";

const heroStyle = {
  position: "absolute",
  top: "15vh",
  left: 0,
  width: "100vw",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#fff",
  textShadow: "0 2px 16px rgba(0,0,0,0.5)",
  pointerEvents: "none", // allows interaction with canvas below
};

const buttonStyle = {
  marginTop: 32,
  padding: "12px 32px",
  fontSize: "1.2rem",
  borderRadius: "24px",
  border: "none",
  background: "linear-gradient(90deg, #ffb347 0%, #ffcc80 100%)",
  color: "#222",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  pointerEvents: "auto", // enables button click
  transition: "background 0.2s",
};

export default function HeroSection({onCVClick}) {
  return (
    <section style={heroStyle}>
      <h1 style={{ fontSize: "3rem", margin: 0, letterSpacing: "2px" }}>
        Hi, I'm Atai Askarov
      </h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 400, margin: "16px 0 0 0" }}>
        Creative Developer & 3D Enthusiast
      </h2>
      <button
        style={buttonStyle}
        onClick={() => {
          if (typeof onCVClick === "function") {
            onCVClick();
  }
        }}
      >
        View Resume
      </button>
      <img
            src="/assets/avatar.png"
            alt="Avatar"
            style={{
              position: "absolute",
              top: 40,
              right: "30vw",
              width: 200,
              height: "auto",
              pointerEvents: "none",
              zIndex: 10,
              margin: 0,
        padding: 0
            }}
          />
    </section>
  );
}