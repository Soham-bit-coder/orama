"use client";

import React from 'react';
import Link from 'next/link';
import Image from './Image';
import WatchlistButton from './WatchlistButton';

export default function MediaCard({ id, type, title, posterPath, voteAverage, showWatchlist = true, media = null, onHover, onLeave, onTrailer }) {
  const href = `/media/${id}?type=${type}`;

  return (
    <div 
      className="group relative flex flex-col gap-3 w-full transition-all duration-700 hover:scale-[1.03] hover:-translate-y-1.5 active:scale-95"
      onMouseEnter={() => onHover && onHover({ id, type, title, posterPath, voteAverage, ...media })}
      onMouseLeave={() => onLeave && onLeave()}
    >
      <Link href={href} className="block relative aspect-[2/3] rounded-[24px] overflow-hidden shadow-xl border border-white/5 bg-slate-900 group-hover:border-primary-500/20 transition-all duration-500">
        <Image
          src={posterPath}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(min-width: 1280px) 16.666vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33.333vw, 50vw"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[1px]">
           <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 border border-white/10 active:scale-90">
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
           </div>
        </div>

        {/* Top Info Bar */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 translate-y-[-5px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <div className="flex gap-2">
              <span className="px-1.5 py-0.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-md text-[7px] font-black uppercase tracking-widest text-primary-400">HD</span>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTrailer && onTrailer({ id, type, title, posterPath, ...media }); }}
                className="w-6 h-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-md flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                title="Neural Preview"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
            {showWatchlist && (
               <div className="scale-75 -mr-3 transform hover:scale-90 transition-transform duration-300">
                 <WatchlistButton id={id} type={type} title={title} posterPath={posterPath} voteAverage={voteAverage} />
               </div>
            )}
        </div>
      </Link>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-white font-black text-[10px] md:text-[11px] truncate uppercase tracking-tight group-hover:text-primary-400 transition-colors duration-400 leading-tight">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
           <span className="text-primary-500 font-black">⭐ {voteAverage.toFixed(1)}</span>
           <div className="w-0.5 h-0.5 rounded-full bg-slate-800"></div>
           <span className="opacity-60">{type === 'movie' ? 'Movie' : 'TV Show'}</span>
        </div>
      </div>
    </div>
  );
}
