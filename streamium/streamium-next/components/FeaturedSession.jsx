"use client";

import React from 'react';

export default function FeaturedSession({ mainMedia, media, onHover, onLeave }) {
  const mainTitle = mainMedia?.title || mainMedia?.name;

  return (
    <div className="relative w-full py-20 px-4 md:px-12 lg:px-16 overflow-hidden min-h-[500px]">
      {/* Big Background Image */}
      <div className="absolute inset-0 bg-gray-900 border-y border-white/5">
        <img 
          src={`/api/image/original${mainMedia.backdrop_path}`} 
          alt={mainTitle} 
          className="w-full h-full object-cover blur-2xl opacity-20 scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
           <span className="text-primary-500 font-black text-sm uppercase tracking-[0.4em]">Featured in Orama</span>
           <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">{mainTitle}</h2>
           <div className="flex items-center gap-4 text-gray-400 font-bold text-sm">
             <span>⭐ {mainMedia.vote_average.toFixed(1)}</span>
             <div className="h-1 w-1 rounded-full bg-gray-600"></div>
             <span>2024</span>
             <div className="h-1 w-1 rounded-full bg-gray-600"></div>
             <span>{mainMedia.media_type?.toUpperCase() || 'MOVIE'}</span>
           </div>
           <p className="text-gray-400 font-medium max-w-lg line-clamp-3 leading-relaxed">
             {mainMedia.overview}
           </p>
           <div className="flex gap-4">
             <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-full shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 uppercase text-xs tracking-widest active:scale-95">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               Play Now
             </button>
             <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-full border border-white/10 backdrop-blur-md transition-all uppercase text-xs tracking-widest active:scale-95">
               Add Playlist
             </button>
           </div>
        </div>

        {/* Small Row Grid items */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-8">
          {media.slice(0, 4).map((item) => (
            <div 
              key={item.id}
              className="w-64 h-80 relative rounded-3xl overflow-hidden shrink-0 border-2 border-transparent hover:border-primary-500 transition-all shadow-2xl cursor-pointer group/item"
              onMouseEnter={() => onHover && onHover({ ...item, media_type: item.media_type || 'movie' })}
              onMouseLeave={() => onLeave && onLeave()}
            >
               <img src={`/api/image/w500${item.poster_path}`} alt={item.title || item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white font-black text-sm block truncate uppercase tracking-tight">{item.title || item.name}</span>
                  <span className="text-primary-400 text-xs font-bold">⭐ {item.vote_average.toFixed(1)}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
