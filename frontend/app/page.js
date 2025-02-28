// pages/index.js
"use client";

import { useState, useEffect } from 'react';
import MetallicGauge from '../components/AnalogPage';

export default function Home() {
  const [gaugeValue, setGaugeValue] = useState(130);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(180);
  
  // Automatically update the gauge value every second
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random value between min and max
      const newValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      setGaugeValue(newValue);
    }, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [minValue, maxValue]);
  
  const handleValueChange = (e) => {
    let newValue = parseInt(e.target.value, 10);
    
    // Validate input to be a number between min and max
    if (!isNaN(newValue)) {
      newValue = Math.min(Math.max(newValue, minValue), maxValue);
      setGaugeValue(newValue);
    }
  };
  
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Temperature  ({minValue}-{maxValue})</h1>
        
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 w-full flex items-center space-x-4">
          </div>
          <MetallicGauge 
            value={gaugeValue} 
            min={minValue}
            max={maxValue}
            size={400}
            needleColor="#ff3b30"
          />
        </div>
      </div>
    </div>
  );
}