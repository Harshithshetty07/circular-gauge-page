// components/MetallicGauge.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnalogPage = ({
  value = 65, // Default value
  min = 0,
  max = 180,
  size = 300,
  showNeedle = true,
  needleColor = '#ff3b30',
  randomize = false,
  randomInterval = 1000,
}) => {
  const [currentValue, setCurrentValue] = useState(min);
  
  // Normalize the value to be within min and max
  const normalizedValue = Math.min(Math.max(value, min), max);
  
  // Update current value when props change
  useEffect(() => {
    setCurrentValue(normalizedValue);
  }, [normalizedValue]);
  
  // Random value generator
  useEffect(() => {
    let interval;
    
    if (randomize) {
      interval = setInterval(() => {
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        setCurrentValue(randomValue);
      }, randomInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [randomize, randomInterval, min, max]);
  
  // Calculate the center coordinates
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate needle properties
  const needleLength = size * 0.35;
  
  // Setup gradient IDs
  const outerRingGradientId = "outerRingGradient";
  const innerRingGradientId = "innerRingGradient";
  const centerCircleGradientId = "centerCircleGradient";
  const innerBlackGradientId = "innerBlackGradient";
  
  // Generate tick marks and labels
  const ticks = [];
  const majorTickInterval = 20; // Every 20 units
  const majorTicksCount = (max - min) / majorTickInterval + 1;
  
  for (let i = 0; i < majorTicksCount; i++) {
    const tickValue = min + (i * majorTickInterval);
    const tickPercent = (tickValue - min) / (max - min);
    const tickAngle = -135 + (tickPercent * 270);
    const tickRadians = (tickAngle * Math.PI) / 180;
    
    const isImportantTick = (tickValue % 20 === 0);
    const tickLength = isImportantTick ? 0.08 : 0.04;
    
    const outerRadius = size * 0.38;
    const innerRadius = size * (0.38 - tickLength);
    
    const outerX = centerX + outerRadius * Math.cos(tickRadians);
    const outerY = centerY + outerRadius * Math.sin(tickRadians);
    const innerX = centerX + innerRadius * Math.cos(tickRadians);
    const innerY = centerY + innerRadius * Math.sin(tickRadians);
    
    const labelRadius = size * 0.32;
    const labelX = centerX + labelRadius * Math.cos(tickRadians);
    const labelY = centerY + labelRadius * Math.sin(tickRadians);
    
    // Determine if this tick should be colored red (for values > 120)
    const isRed = tickValue > 120;
    
    ticks.push({
      line: { x1: outerX, y1: outerY, x2: innerX, y2: innerY },
      isImportantTick,
      isRed,
      label: { 
        value: tickValue,
        x: labelX,
        y: labelY
      }
    });
  }
  
  // Calculate the angle based on the current value (0 at -135 degrees, max at 135 degrees)
  const angle = ((currentValue - min) / (max - min)) * 270 - 135;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          {/* Gradient for outer metallic ring */}
          <linearGradient id={outerRingGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b0b0b0" />
            <stop offset="50%" stopColor="#d0d0d0" />
            <stop offset="100%" stopColor="#808080" />
          </linearGradient>
          
          {/* Gradient for inner metallic ring */}
          <linearGradient id={innerRingGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#505050" />
            <stop offset="100%" stopColor="#303030" />
          </linearGradient>
          
          {/* Gradient for inner black area */}
          <radialGradient id={innerBlackGradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#202020" />
            <stop offset="80%" stopColor="#101010" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          
          {/* Gradient for center circle */}
          <linearGradient id={centerCircleGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#606060" />
            <stop offset="50%" stopColor="#808080" />
            <stop offset="100%" stopColor="#404040" />
          </linearGradient>
          
          {/* Filter for shadow effect */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer metallic ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.48}
          fill={`url(#${outerRingGradientId})`}
          stroke="#2a2a2a"
          strokeWidth="1"
          filter="url(#shadow)"
        />
        
        {/* Inner metallic ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.44}
          fill={`url(#${innerRingGradientId})`}
          stroke="#2a2a2a"
          strokeWidth="1"
        />
        
        {/* Inner black area */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.40}
          fill={`url(#${innerBlackGradientId})`}
        />
        
        {/* Tick marks and labels */}
        {ticks.map((tick, i) => (
          <React.Fragment key={`tick-${i}`}>
            <line
              x1={tick.line.x1}
              y1={tick.line.y1}
              x2={tick.line.x2}
              y2={tick.line.y2}
              stroke={tick.isRed ? "#ff3b30" : "#ffffff"}
              strokeWidth={tick.isImportantTick ? "0.1" : "0.1"}
              opacity={tick.isImportantTick ? 1 : 0.6}
            />
            {tick.isImportantTick && (
              <text
                x={tick.label.x}
                y={tick.label.y}
                fill={tick.isRed ? "#ff3b30" : "#ffffff"}
                fontSize={size * 0.04}
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {tick.label.value}
              </text>
            )}
          </React.Fragment>
        ))}
        
        {/* Center metallic circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.1}
          fill={`url(#${centerCircleGradientId})`}
          stroke="#2a2a2a"
          strokeWidth="1"
        />
        
        {/* Inner black center */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.07}
          fill="#111111"
        />
        
        {/* Needle using Framer Motion */}
        {showNeedle && (
          <>
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + needleLength * Math.cos((angle * Math.PI) / 180)}
              y2={centerY + needleLength * Math.sin((angle * Math.PI) / 180)}
              stroke={needleColor}
              strokeWidth={size * 0.015}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0px 0px 3px rgba(0,0,0,0.7))" }}
              initial={false}
              animate={{
                x2: centerX + needleLength * Math.cos((angle * Math.PI) / 180),
                y2: centerY + needleLength * Math.sin((angle * Math.PI) / 180)
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 15,
                mass: 1.5
              }}
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={size * 0.025}
              fill={needleColor}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default AnalogPage;