"use client";
import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Person Icon Component
const PersonIcon = ({ x, y, index, color, isDark }) => (
  <g>
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      {/* Person silhouette */}
      <motion.circle
        cx={x}
        cy={y - 4}
        r="3"
        fill={color}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
      <motion.ellipse
        cx={x}
        cy={y + 3}
        rx="3.5"
        ry="6"
        fill={color}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
    </motion.g>
  </g>
);

export default function WorldMap({ dots = [] }) {
  const svgRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dimensions = { width: 800, height: 400 };

  // Dynamic colors based on theme
  const colors = {
    lineColor: isDark ? "#fb923c" : "#f97316", // orange-400 : orange-500
    personColor: isDark ? "#fb923c" : "#f97316",
    worldPeopleColor: isDark ? "#6b7280" : "#9ca3af", // gray-500 : gray-400
    pulseColor: isDark ? "#fb923c" : "#f97316",
  };

  const projectPoint = (lat, lng) => {
    const x = (lng + 180) * (dimensions.width / 360);
    const y = (90 - lat) * (dimensions.height / 180);
    return { x, y };
  };

  const createCurvedPath = (start, end) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Generate strategic person locations (major cities/regions)
  const worldPeople = useMemo(() => {
    const locations = [
      { x: 200, y: 150 }, // North America
      { x: 350, y: 120 }, // Europe
      { x: 450, y: 180 }, // Asia
      { x: 600, y: 200 }, // East Asia
      { x: 380, y: 280 }, // Africa
      { x: 150, y: 320 }, // South America
      { x: 650, y: 320 }, // Australia
      { x: 500, y: 160 }, // Central Asia
      { x: 250, y: 100 }, // Greenland
      { x: 580, y: 140 }, // Russia
    ];

    return locations.map((loc, i) => ({
      ...loc,
      delay: i * 0.2,
    }));
  }, []);

  return (
    <div className="w-full h-96 md:h-[500px] relative overflow-hidden bg-transparent">
      <svg
        ref={svgRef}
        className="w-full h-full absolute inset-0"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
        style={{ background: "transparent" }}
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.lineColor} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.lineColor} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="person-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.personColor} stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={isDark ? "#ea580c" : "#ea580c"}
              stopOpacity="0.8"
            />
          </radialGradient>
          <radialGradient id="world-person-gradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={colors.worldPeopleColor}
              stopOpacity="0.8"
            />
            <stop
              offset="100%"
              stopColor={colors.worldPeopleColor}
              stopOpacity="0.4"
            />
          </radialGradient>
        </defs>

        {/* World People Icons - Static background people */}
        {worldPeople.map((person, i) => (
          <PersonIcon
            key={i}
            x={person.x}
            y={person.y}
            index={i}
            color="url(#world-person-gradient)"
            isDark={isDark}
          />
        ))}

        {/* Connection Lines */}
        {dots.map((dot, index) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`connection-${index}`}>
              {/* Main line */}
              <motion.path
                d={createCurvedPath(start, end)}
                stroke="url(#path-gradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 4,
                  delay: index * 0.8,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
            </g>
          );
        })}

        {/* Connection Points with Person Icons */}
        {dots.map((dot, index) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);

          return (
            <g key={`points-${index}`}>
              {/* Start point person */}
              <PersonIcon
                x={start.x}
                y={start.y}
                index={index * 2}
                color="url(#person-gradient)"
                isDark={isDark}
              />

              {/* End point person */}
              <PersonIcon
                x={end.x}
                y={end.y}
                index={index * 2 + 1}
                color="url(#person-gradient)"
                isDark={isDark}
              />

              {/* Subtle pulse effect around connection points */}
              <motion.circle
                cx={start.x}
                cy={start.y}
                r="15"
                fill="none"
                stroke={colors.pulseColor}
                strokeWidth="1"
                strokeOpacity={isDark ? "0.4" : "0.3"}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  delay: index * 0.8,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeOut",
                }}
              />
              <motion.circle
                cx={end.x}
                cy={end.y}
                r="15"
                fill="none"
                stroke={colors.pulseColor}
                strokeWidth="1"
                strokeOpacity={isDark ? "0.4" : "0.3"}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  delay: index * 0.8 + 1,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeOut",
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
