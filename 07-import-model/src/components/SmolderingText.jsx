import React, { useEffect, useRef } from "react";
import opentype from "opentype.js";

export default function SmolderingText({ text, dimensions }) {

  const scale = 2.5;
  const width = dimensions.width * scale;
  const height = dimensions.height * scale;
  const fontSize = 7
  const svgRef = useRef();
  

  useEffect(() => {
    if (!svgRef.current) return;
    opentype.load("./fonts/Lugrasimo-Regular.ttf", function (err, font) {
      if (err) return console.error(err);
      // Use your original x, y coordinates
      
      let x;//dimensions.x
      
      const lines = text.split('\n');
      const lineHeight = fontSize * 1.2;
      const totalHeight =lines.length * lineHeight;


      const ascent = (font.ascender && font.unitsPerEm)
      ? (font.ascender * fontSize / font.unitsPerEm)
      : fontSize * 0.8;
      let svgPaths = '';

      const firstBaselineY = dimensions.y + (dimensions.height - totalHeight) / 2 + ascent;


      lines.forEach((line, i) => {
        const textWidth = font.getAdvanceWidth(line, fontSize);
        const centeredX = dimensions.x + (dimensions.width - textWidth) / 2;
        x = centeredX;
        // Offset each line vertically
        
        const y = firstBaselineY + i * lineHeight
        const path = font.getPath(line, x, y, fontSize);
        svgPaths += `<path d="${path.toPathData()}" />`;
      });
      
      const svg = svgRef.current;
      svg.innerHTML = svgPaths;

      // Style all paths
      svg.querySelectorAll('path').forEach(p => {
        const length = p.getTotalLength();
        Object.assign(p.style, {
          fill: "none",
          stroke: "#fff3e0",
          strokeWidth: 1,
          strokeLinecap: "round",
          strokeDasharray: length,
          strokeDashoffset: length,
          filter: "drop-shadow(0 0 5px #FFAE42) drop-shadow(0 0 70px #FF4500) drop-shadow(0 0 15px #FFF176)",
          animation: `write 4s ease-in-out forwards, glow 3s ease-out forwards`,
        });
      });

      // Create keyframes dynamically so it's inline-friendly
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(`
        @keyframes write {
          to { stroke-dashoffset: 0; }
        }
      `, styleSheet.cssRules.length);
      styleSheet.insertRule(`
        @keyframes glow {
          0%, 80% {
            filter: drop-shadow(0 0 5px orange) drop-shadow(0 0 15px red);
          }
          100% {
            stroke: #3e2a1f;
            filter: none;
          }
        }
      `, styleSheet.cssRules.length);
    });
  }, [text]);

  if (!dimensions) return null;

  
  return (
    <div style={{
      position: "absolute",
      width: width,
      height: height,
      backgroundSize: "cover",
      overflow: "visible",
      zIndex: 9
    }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`${dimensions.x} ${dimensions.y} ${dimensions.width} ${dimensions.height}`}
        style={{
          position: "absolute",
          zIndex: 9,
    //       border: "2px solid red", // makes the SVG edges visible
    // background: "rgba(255,255,0,0.1)",
    // display: "block"
        }}
      >
         
      </svg>
    </div>
  );
}
