"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import TrailerModal from '@/components/TrailerModal';
import MediaCard from '@/components/MediaCard';

export default function HomeClient({ trending = [], movies = [], tvShows = [] }) {
  const { isAuthenticated } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState(trending?.[0] || null);
  const [activeCategory, setActiveCategory] = useState('trending');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerMedia, setTrailerMedia] = useState(null);

  useEffect(() => {
    if (trending.length > 0 && !selectedMovie) {
      setSelectedMovie(trending[0]);
    }
  }, [trending]);

  const handleTrailer = (media) => {
    setTrailerMedia(media);
    setIsTrailerOpen(true);
  };

  const getImageUrl = (path, size = 'w500') => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    return `/api/image/${size}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const categories = [
    { id: 'trending', label: 'Network Stream', items: trending },
    { id: 'movies', label: 'Premier Cinema', items: movies },
    { id: 'tv', label: 'Serialized Media', items: tvShows },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30 overflow-x-hidden">
      <Navbar />

      {/* Compact Cinematic Spotlight Hero */}
      <section className="relative h-[75vh] min-h-[600px] w-full flex items-center overflow-hidden">
        {selectedMovie && (
          <div key={selectedMovie.id} className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={getImageUrl(selectedMovie.backdrop_path || selectedMovie.poster_path, 'original')}
              alt={selectedMovie.title || selectedMovie.name}
              className="h-full w-full object-cover scale-100 transition-transform duration-[10s] ease-linear animate-slow-zoom opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/20" />
          </div>
        )}

        <div className="container relative z-10 pt-16 md:pt-0">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-10 bg-primary-500 rounded-full"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary-500 mb-0.5">
                 Network Spotlight
               </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {selectedMovie?.title || selectedMovie?.name}
            </h1>
            
            <p className="text-sm md:text-base text-gray-300 font-medium mb-8 line-clamp-3 leading-relaxed max-w-xl border-l-2 border-primary-600/50 pl-6">
              {selectedMovie?.overview || "Neural analysis loading for this cinematic sequence..."}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={`/media/${selectedMovie?.id}`}
                className="group relative flex items-center gap-3 bg-primary-600 hover:bg-primary-500 px-8 py-4 rounded-xl transition-all duration-500 shadow-[0_15px_30px_-10px_rgba(229,9,20,0.4)] active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initialize</span>
              </Link>
              
              <button 
                onClick={() => handleTrailer(selectedMovie)}
                className="group relative flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-3xl px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-500 active:scale-95 overflow-hidden"
              >
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Neural Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scaled Down Hero Carousel */}
        <div className="absolute bottom-10 right-0 left-0 container z-20">
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 items-end">
              {trending.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMovie(item)}
                  className={`relative flex-shrink-0 group ${selectedMovie?.id === item.id ? 'w-40 sm:w-56' : 'w-20 sm:w-28'} h-24 sm:h-32 rounded-[20px] overflow-hidden transition-all duration-700 bg-slate-900 border-2 ${selectedMovie?.id === item.id ? 'border-primary-500 shadow-[0_0_30px_rgba(229,9,20,0.3)]' : 'border-white/5 grayscale translate-y-2 opacity-40 hover:opacity-100 hover:grayscale-0'}`}
                >
                   <img src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className={`absolute bottom-3 left-3 right-3 text-left transition-all duration-500 delay-100 ${selectedMovie?.id === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                      <h4 className="text-[8px] font-black truncate text-white uppercase">{item.title || item.name}</h4>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Refined Content Navigation */}
      <div className="sticky top-[72px] z-[45] bg-[#020617]/80 backdrop-blur-xl border-y border-white/5 py-4">
        <div className="container flex items-center justify-between">
           <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group relative py-1"
                >
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300 ${activeCategory === cat.id ? 'text-primary-500' : 'text-gray-500 group-hover:text-white'}`}>
                    {cat.label}
                  </span>
                  {activeCategory === cat.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
           </div>
           
           <div className="hidden md:flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
              <span className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                 Stable Sync
              </span>
           </div>
        </div>
      </div>

      {/* Scaled Main Content */}
      <main className="container relative z-30 pt-12 pb-32">
        <div className="space-y-20">
          {categories.find(c => c.id === activeCategory)?.items.length > 0 ? (
            <MediaSection 
              title={categories.find(c => c.id === activeCategory).label} 
              items={categories.find(c => c.id === activeCategory).items} 
              getImageUrl={getImageUrl}
              onTrailer={handleTrailer}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[32px]">
               <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Transmission Zero.</p>
            </div>
          )}

          {/* Collateral Streams: Smaller */}
          <div className="space-y-16">
             {categories.filter(c => c.id !== activeCategory).map(cat => (
                <MediaSection 
                  key={cat.id}
                  title={cat.label} 
                  items={cat.items} 
                  getImageUrl={getImageUrl}
                  onTrailer={handleTrailer}
                  mini
                />
             ))}
          </div>
        </div>
      </main>

      <TrailerModal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
        title={trailerMedia?.title || trailerMedia?.name || ""} 
        mediaId={trailerMedia?.id}
        mediaType={trailerMedia?.type || (trailerMedia?.title ? 'movie' : 'tv')}
      />

      {/* Global Background Particles/Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-[-1]">
         <div className="absolute inset-0 bg-[#020617]" />
         <div className="absolute inset-y-0 left-0 w-[500px] bg-primary-950/20 blur-[150px] -translate-x-1/2 rounded-full" />
         <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-indigo-950/10 blur-[200px] translate-x-1/4 translate-y-1/4 rounded-full" />
      </div>
    </div>
  );
}

function MediaSection({ title, items, getImageUrl, mini = false, onTrailer }) {
  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center gap-8 mb-12">
        <h2 className={`font-black uppercase tracking-tighter text-white ${mini ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>
          {title}
        </h2>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-primary-600/40 via-primary-600/5 to-transparent"></div>
        <Link href="#" className="flex items-center gap-3 group">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-primary-500 transition-colors">Sector Data</span>
          <svg className="w-5 h-5 text-gray-500 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </Link>
      </div>

      <div className={`grid ${mini ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'} gap-6 md:gap-10`}>
        {items.slice(0, mini ? 12 : 12).map((item) => (
          <MediaCard
            key={item.id}
            id={item.id}
            type={item.title ? 'movie' : 'tv'}
            title={item.title || item.name}
            posterPath={item.poster_path}
            voteAverage={item.vote_average || 0}
            onTrailer={onTrailer}
          />
        ))}
      </div>
    </section>
  );
}

