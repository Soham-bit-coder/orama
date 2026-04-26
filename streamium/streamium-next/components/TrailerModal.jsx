"use client";

import React, { useEffect } from 'react';

export default function TrailerModal({ isOpen, onClose, title, mediaId, mediaType }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // ANTI-REDIRECT SCRIPT
  useEffect(() => {
    if (isOpen) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Neural Sync: Trailer redirect blocked.";
        return e.returnValue;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const searchQuery = mediaId ? `${mediaId} ${title} official trailer` : `${title} official trailer`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl animate-fade-in-up"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl aspect-video bg-slate-900 rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(229,9,20,0.2)] animate-fade-in-up">
        <div className="absolute top-6 right-6 z-50">
           <button 
             onClick={onClose}
             className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all hover:rotate-90 active:scale-90"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="absolute top-6 left-8 z-50 pointer-events-none">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500 animate-pulse block mb-1">Neural Preview Active</span>
           <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white drop-shadow-lg">{title} Trailer</h2>
        </div>

        <div className="w-full h-full bg-black relative">
           <iframe
             key={title}
             src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}&autoplay=1&mute=1&rel=0`}
             className="w-full h-full border-0"
             allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
             allowFullScreen
             /* PRO-SECURITY: Block redirects but allow interaction */
             sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-popups"
             title={`${title} Trailer`}
           ></iframe>
           
           {/* Fallback & Helper Overlay (Only shows if there's an issue or just to be helpful) */}
           <div className="absolute bottom-8 right-8 z-50 flex gap-4">
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary-600/20 hover:bg-primary-600 backdrop-blur-xl border border-primary-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 flex items-center gap-2 group shadow-[0_10px_30px_#E5091444]"
              >
                <span>Direct Intelligence</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>
           </div>
        </div>

        {/* Cinematic Scan Line Overlay (Subtle) */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-40 bg-[length:100%_4px,3px_100%] opacity-20"></div>
      </div>
    </div>
  );
}
