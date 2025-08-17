import React, { forwardRef } from 'react';
import SmolderingText from './SmolderingText';

const text2 = `
Hi! I'm a creative developer passionate about 3D graphics,
interactive experiences, and building beautiful web applications.

I love exploring new technologies and sharing what I learn
through tutorials and open source projects!

This portfolio demonstrates my journey in 3D web development,
featuring flocking birds, paper grid animations, and more. 

Scroll down to see my projects, skills, and how to get in touch!
`;

const AboutSection = forwardRef(({ text = text2, visible = true, gridDimensions }, ref) => {
  return (
    <div>
      {visible && (
        <section 
          ref={ref} 
          style={{
            zIndex: 10,
            color: "#fff",
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100vw",
            height: "100vh"
          }}
        >
          <SmolderingText text={text} dimensions={gridDimensions} />
        </section>
      )}
    </div>
  );
});

export default AboutSection;
