import React, { useEffect, useState } from "react";
import "./background.css";

const colors = [
  ["from-white/70", "to-blue-100"],
  ["from-white/80", "to-sky-100"],
  ["from-blue-50", "to-white/60"],
  ["from-sky-100", "to-blue-100"],
  ["from-cyan-100", "to-blue-50"],
  ["from-blue-100", "to-blue-200"],
  ["from-white/60", "to-cyan-100"],
];

const depths = [
  { z: "z-0", blur: "blur-md", opacity: 0.3 },
  { z: "z-10", blur: "blur-lg", opacity: 0.45 },
  { z: "z-20", blur: "blur-2xl", opacity: 0.6 },
];

const generateCircles = (count = 30) => {
  return Array.from({ length: count }, () => {
    const depth = depths[Math.floor(Math.random() * depths.length)];
    return {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 180 + 80),
      colors: colors[Math.floor(Math.random() * colors.length)],
      delay: `${(Math.random() * 5).toFixed(1)}s`,
      duration: `${(18 + Math.random() * 10).toFixed(1)}s`,
      blur: depth.blur,
      z: depth.z,
      opacity: depth.opacity,
    };
  });
};

const circles = generateCircles();

const Background = () => {
  const [sparkTrigger, setSparkTrigger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkTrigger(true);
      setTimeout(() => setSparkTrigger(false), 800); // Match spark animation duration
    }, Math.random() * 1000 + 2000); // Every 2–3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.04),_transparent)] mix-blend-overlay" />

      {circles.map((circle, index) => (
        <div
          key={index}
          className={`
            absolute rounded-full bg-gradient-to-br 
            ${circle.colors.join(" ")} shimmer 
            ${circle.blur} ${circle.z}
            ${sparkTrigger ? "spark" : ""}
          `}
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            top: circle.top,
            left: circle.left,
            opacity: circle.opacity,
            animation: `floatXY ${circle.duration} cubic-bezier(0.45, 0, 0.55, 1) infinite`,
            animationDelay: circle.delay,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
