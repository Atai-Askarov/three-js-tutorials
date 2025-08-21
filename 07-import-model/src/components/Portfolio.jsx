// src/components/ProjectsSection.jsx
import React, { forwardRef } from "react";

const projects = [
  {
    title: "3D Flocking Simulation + Portfolio Website",
    description: "Hundreds of real time, animated origami birds flock together to display the contents of this portfolio website.",
    image: "/assets/preview.jpg",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  {
    title: "Concordia University Navigation System",
    description: `An interactive map that allows navigation around Concordia campuses indoors, outdoors and in between.`,
    image: "/assets/preview.jpg",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  {
    title: "Full Stack Car Rental Application",
    description: "",
    image: "/assets/preview.jpg",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  {
    title: "Platform for Group and Private Lessons",
    description: "A real-time animated origami crane using Three.js and GLTF.",
    image: "/assets/preview.jpg",
    link: "https://github.com/yourusername/3d-origami-crane"
  },
  // Add more projects if needed
];

const ProjectsSection = forwardRef((props, ref) => {
  return (
    <div
    style={{position: "relative"}}>
      
    <section
      ref={ref}
      style={{
        height: "100vh",
        padding: "60px 0",
        textAlign: "center",
        position: "absolute",
        left: "7vw",
        top: "25vh"
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: 32 }}>Projects</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 32,
          
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
    </div>
  );
});

export default ProjectsSection;
