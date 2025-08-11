// src/components/ProjectsSection.jsx
import React, { forwardRef } from "react";

const projects = [
  {
    title: "3D Origami Crane",
    description: "A real-time animated origami crane using Three.js and GLTF.",
    image: "/assets/3d_origami_crane_gltf/preview.png",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  {
    title: "3D Origami Crane",
    description: "A real-time animated origami crane using Three.js and GLTF.",
    image: "/assets/3d_origami_crane_gltf/preview.png",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  {
    title: "3D Origami Crane",
    description: "A real-time animated origami crane using Three.js and GLTF.",
    image: "/assets/3d_origami_crane_gltf/preview.png",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  {
    title: "3D Origami Crane",
    description: "A real-time animated origami crane using Three.js and GLTF.",
    image: "/assets/3d_origami_crane_gltf/preview.png",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  // Add more projects if needed
];

const ProjectsSection = forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      style={{
        height: "100vh",
        padding: "60px 0",
        textAlign: "center",
        position: "absolute",
        left: "30vh"
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: 32 }}>Projects</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 32
        }}
      >
        {projects.map((project, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 16,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              width: 300,
              padding: 24,
              textAlign: "left"
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",
                borderRadius: 8,
                marginBottom: 16
              }}
            />
            <h3 style={{ margin: "8px 0" }}>{project.title}</h3>
            <p style={{ fontSize: "1rem", color: "#ccc" }}>
              {project.description}
            </p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ffb347", fontWeight: "bold" }}
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
});

export default ProjectsSection;
