"use client";

import React, { useState, useEffect } from 'react';
import styles from './NetflixIntro.module.css';

export default function NetflixIntro({ onFinish }) {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Premium cinematic impact sound effect
    const audio = new Audio('https://www.soundjay.com/free-music/sounds/cinematic-impact-01.mp3');
    audio.volume = 1.0;
    audio.load();

    // Small delay before starting
    const startTimeout = setTimeout(() => {
      setStarted(true);
      audio.play().catch(e => console.warn("Autoplay blocked:", e));
    }, 150);

    // Duration of Netflix intro
    const finishTimeout = setTimeout(() => {
      setFinished(true);
      if (onFinish) onFinish();
    }, 4500);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(finishTimeout);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onFinish]);

  if (finished) return null;

  return (
    <div className={`fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-1000 px-4 ${finished ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center w-full max-w-5xl">
        {/* The Dramatic Zooming Logo */}
        <div className={`${styles.oramaEngineWrapper} w-full text-center ${started ? styles.animateZoom : ''}`}>
          <h1 className="text-white font-black text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] tracking-tighter uppercase select-none relative inline-block">
            <span className={styles.oramaTextGlitch} data-text="ORAMA">ORAMA</span>
            {/* Underline Glow */}
            <div className={`absolute -bottom-2 md:-bottom-4 left-0 right-0 h-1 md:h-2 bg-primary-600 shadow-[0_0_50px_#E50914] rounded-full scale-x-0 transition-transform duration-[2000ms] ${started ? 'scale-x-100' : ''}`}></div>
          </h1>
          <p className={`text-primary-500 font-bold tracking-[0.5em] sm:tracking-[1em] md:tracking-[1.5em] text-center mt-4 md:mt-8 transition-all duration-1000 uppercase text-[10px] sm:text-xs md:text-lg ${started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Streaming
          </p>
        </div>

        {/* Cinematic Flickering Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className={styles.flickerOverlay}></div>
        </div>
      </div>
    </div>
  );
}
