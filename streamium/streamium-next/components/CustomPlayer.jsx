"use client";

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Hls from 'hls.js';

const CustomPlayer = forwardRef(({ streamUrl, title, isMuted = false, onProgress, onDuration, onPlay, onPause, onEnded }, ref) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !streamUrl) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!isMuted) video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
           switch (data.type) {
             case Hls.ErrorTypes.NETWORK_ERROR:
               hls.startLoad();
               break;
             case Hls.ErrorTypes.MEDIA_ERROR:
               hls.recoverMediaError();
               break;
             default:
               hls.destroy();
               break;
           }
        }
      });
    } 
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [streamUrl, isMuted]);

  useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (time) => { if (videoRef.current) videoRef.current.currentTime = time; },
    setVolume: (v) => { if (videoRef.current) videoRef.current.volume = v; }
  }));

  const togglePlay = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    onProgress?.(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    onDuration?.(videoRef.current.duration);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.parentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onPlay={() => { setIsPlaying(true); onPlay?.(); }}
        onPause={() => { setIsPlaying(false); onPause?.(); }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        muted={isMuted}
        playsInline
      />

      {/* Custom Neural Interaction Layer */}
      <div className={`absolute inset-0 z-50 flex flex-col justify-between transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Top Gradient */}
        <div className="h-24 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-none">
           <h4 className="text-white/60 text-[9px] font-black uppercase tracking-[0.6em] mb-1">Neural Secure Stream</h4>
           <h2 className="text-white text-xl font-bold tracking-tight truncate max-w-2xl">{title}</h2>
        </div>

        {/* Center Play Button (Visual) */}
        {!isPlaying && (
          <button 
             onClick={togglePlay}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary-600/90 rounded-full flex items-center justify-center text-white shadow-3xl hover:scale-110 active:scale-95 transition-all animate-pulse"
          >
             <svg className="w-10 h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        )}

        {/* Bottom Neural Dashboard */}
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 md:p-10">
           {/* Progress Bar (Scrum) */}
           <div className="group/scrub relative w-full h-1 bg-white/10 rounded-full mb-8 cursor-pointer overflow-hidden">
              <div 
                className="absolute h-full bg-primary-600 rounded-full shadow-[0_0_15px_#E50914]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <input 
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                step={0.1}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  videoRef.current.currentTime = val;
                  setCurrentTime(val);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
              />
           </div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                 <button onClick={togglePlay} className="text-white hover:text-primary-500 transition-colors pointer-events-auto">
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                 </button>

                 <div className="flex items-center gap-4 group/vol">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    <div className="w-0 group-hover/vol:w-24 overflow-hidden transition-all duration-500">
                       <input 
                         type="range" 
                         min="0" max="1" step="0.01" 
                         value={volume}
                         onChange={(e) => { setVolume(e.target.value); videoRef.current.volume = e.target.value; }}
                         className="pointer-events-auto accent-primary-600"
                       />
                    </div>
                 </div>

                 <span className="text-[10px] font-black text-gray-500 tracking-widest font-mono select-none">
                    {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} 
                    <span className="mx-2 opacity-30">/</span> 
                    {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                 </span>
              </div>

              <div className="flex items-center gap-6">
                 <button onClick={toggleFullscreen} className="text-white hover:text-primary-500 transition-colors pointer-events-auto opacity-70 hover:opacity-100">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
});

CustomPlayer.displayName = 'CustomPlayer';

export default CustomPlayer;
