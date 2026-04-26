"use client";

import React from 'react';

export default function PopularNumberCard({ media, rank, type, onHover, onLeave }) {
  const title = type === 'movie' ? media.title : media.name;

  return (
    <div 
      className="relative group flex items-end gap-2 w-[300px] shrink-0 cursor-pointer"
      onMouseEnter={() => onHover && onHover({ ...media, media_type: type })}
      onMouseLeave={() => onLeave && onLeave()}
    >
      <div className="flex-none -mr-4 z-10 leading-none">
        <span className="text-[120px] font-black text-gray-950 tracking-tighter" style={{ WebkitTextStroke: '4px #555' }}>
          {rank}
        </span>
      </div>
      <div className="relative bg-gray-900/40 rounded-3xl p-4 flex gap-4 border border-white/5 group-hover:bg-gray-800 transition-colors w-full">
        <div className="w-16 h-24 rounded-2xl overflow-hidden shrink-0">
          <img src={`/api/image/w500${media.poster_path}`} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center py-2 truncate">
           <span className="text-white font-black text-lg truncate uppercase tracking-tight">{title}</span>
           <span className="text-primary-500 font-bold text-xs">⭐ {media.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
