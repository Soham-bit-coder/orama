"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if the splash screen has already been shown this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShowSplash(false);
      return;
    }

    sessionStorage.setItem('hasSeenSplash', 'true');

    // Remove component completely after animation sequence
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8500);

    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#05050a] pointer-events-none"
      >
        {/* Digital Film Grain Overlay */}
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none opacity-[0.15] mix-blend-overlay"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />

        {/* Camera Recording UI */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute top-10 right-10 md:top-16 md:right-16 flex items-center gap-3 z-40"
        >
          <motion.div 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
            className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" 
          />
          <span className="text-red-500 font-mono text-xs md:text-sm tracking-widest font-bold drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">REC</span>
        </motion.div>

        {/* Camera Focus Brackets */}
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="absolute inset-6 md:inset-12 z-40 pointer-events-none"
        >
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white"></div>
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white"></div>
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white"></div>
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white"></div>
          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white/50">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current"></div>
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-current"></div>
          </div>
        </motion.div>

        {/* Background Ambient Glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 4, ease: "easeOut", delay: 1 }}
          className="absolute inset-0 flex items-center justify-center opacity-80"
        >
          <div className="w-[80vw] h-[50vh] bg-primary-900/10 blur-[120px] rounded-full"></div>
        </motion.div>

        <div className="relative flex flex-col items-center justify-center w-full h-full">
          
          {/* Volumetric Spotlight Flare from above */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0, originY: 0, rotate: -20 }}
            animate={{ opacity: [0, 0.4, 0], scaleY: [0, 1.5, 0], rotate: [-20, 0, 20] }}
            transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
            className="absolute -top-40 w-64 md:w-96 h-[120vh] bg-gradient-to-b from-white/30 via-white/5 to-transparent blur-3xl z-30 pointer-events-none"
          />

          {/* Spark Line */}
          <motion.div 
            initial={{ width: 0, opacity: 0, boxShadow: "0 0 0px #8b5cf6" }}
            animate={{ 
              width: ["0px", "10px", "400px", "600px"],
              opacity: [0, 1, 1, 0],
              boxShadow: ["0 0 0px #8b5cf6", "0 0 40px 10px #8b5cf6", "0 0 20px 2px #8b5cf6", "0 0 0px #8b5cf6"],
              backgroundColor: ["#8b5cf6", "#fff", "#fff", "#8b5cf6"]
            }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute z-20 h-[2px]"
          />

          {/* ORAMA Text */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, filter: "blur(20px)", y: 50, scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 1 }}
              className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-[0.3em] ml-[0.15em] text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            >
              Orama
            </motion.h1>

            <motion.span 
              initial={{ opacity: 0, filter: "blur(10px)", y: -20, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0, letterSpacing: "1.5em" }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
              className="block text-[10px] md:text-sm font-black uppercase ml-[0.75em] mt-2 text-primary-500"
            >
              Studios
            </motion.span>
          </div>

          {/* Light Sweep */}
          <motion.div 
            initial={{ x: "-100vw", opacity: 0, skewX: "-30deg" }}
            animate={{ x: "100vw", opacity: [0, 0.5, 0.5, 0], skewX: "-30deg" }}
            transition={{ duration: 3, ease: "easeInOut", delay: 2 }}
            className="absolute z-30 w-1/3 h-64 bg-gradient-to-r from-transparent via-white to-transparent blur-xl mix-blend-overlay"
          />

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
