import React from "react";

export default function SkillsSection() {
  return (
    <section style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      scrollSnapAlign: "start"
    }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 24 }}>Skills</h2>
      <ul style={{ fontSize: "1.2rem", listStyle: "none", padding: 0 }}>
        <li>JavaScript / TypeScript</li>
        <li>React / Three.js</li>
        <li>WebGL / GLSL</li>
        <li>Node.js</li>
        <li>Python</li>
        <li>UI/UX Design</li>
        <li>Creative Coding</li>
      </ul>
    </section>
  );
}