"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Hero({ media, type }) {
  const currentType = media?.media_type || type || 'movie';
  const backdropUrl = media?.backdrop_path ? `/api/image/original${media.backdrop_path}` : '';
  const title = currentType === 'movie' ? media?.title : media?.name;
  const href = `/media/${media?.id}?type=${currentType}`;

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] min-h-[500px] md:min-h-[700px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {backdropUrl && (
          <motion.div
            key={backdropUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover object-top scale-105"
            />
            {/* Multiple Gradients for mobile-first legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 md:via-slate-950/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 via-slate-950/40 to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center pb-20 md:pb-48 lg:pb-64 z-10">
        <div className="container">
          <div className="max-w-3xl flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-primary-600/20 border border-primary-500/30 text-primary-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-full">
                 {currentType === 'movie' ? 'Movie' : 'TV Show'}
               </span>
               <span className="text-white/40 font-bold text-[10px] md:text-xs">⭐ {media?.vote_average?.toFixed(1) || '0.0'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] md:leading-[0.9] uppercase tracking-tighter drop-shadow-2xl">
              {title}
            </h1>
            {media?.overview && (
              <p className="text-sm md:text-lg text-gray-300 md:text-gray-400 mb-2 line-clamp-2 md:line-clamp-3 drop-shadow-md font-medium max-w-xl leading-relaxed opacity-90">
                {media.overview}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-2 md:mt-4">
              <Link
                href={href}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-10 py-3 md:py-4 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-black text-sm md:text-lg transition-all shadow-2xl shadow-primary-600/30 active:scale-95"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Now
              </Link>
              <Link
                href={href}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-10 py-3 md:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-sm md:text-lg transition-all border border-white/10 backdrop-blur-md"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Playlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
