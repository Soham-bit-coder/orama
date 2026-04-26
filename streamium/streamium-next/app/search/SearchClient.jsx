"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/Navbar';

export default function SearchClient({ results, recommendations, totalPages, query, error }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(query || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePageChange = (p) => {
    router.push(`/search?query=${encodeURIComponent(query)}&page=${p}`);
  };

  const currentPage = parseInt(searchParams.get('page') || '1');

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="pt-32 md:pt-44 pb-24 px-4 md:px-12 lg:px-20 container mx-auto">
        <div className="mb-12 max-w-4xl mx-auto">
           <div className="flex flex-col items-center text-center gap-3 mb-8">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-primary-500">Neural Search Engine</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none">Find Your Reality</h1>
           </div>
     
           <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/30 to-purple-600/30 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-primary-500/50 transition-all backdrop-blur-3xl p-1 shadow-2xl">
                 <div className="pl-6 py-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-500" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
                 <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Keywords, actors, or genres..."
                    className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-transparent text-white text-lg md:text-xl font-bold placeholder-gray-600 focus:outline-none"
                 />
                 <button
                    type="submit"
                    className="mr-1 px-6 md:px-8 py-3 md:py-4 bg-primary-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl active:scale-95"
                 >
                    Search
                 </button>
              </div>
           </form>
        </div>

        {error && (
          <div className="mb-12 p-8 bg-red-950/20 border border-red-500/30 rounded-[40px] text-center">
            <h3 className="text-xl font-black uppercase text-red-500 tracking-tighter">{error}</h3>
          </div>
        )}

        {!query ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-10 space-y-8 animate-pulse">
            <svg className="w-32 h-32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.5em]">Awaiting Instruction</h2>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-t border-white/5 space-y-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-gray-600">Zero Signals Found</h2>
            <p className="text-gray-700 font-bold tracking-tight">The requested sequence is not present in our archives</p>
          </div>
        ) : (
          <div className="space-y-24">
            {recommendations.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-1.5 h-8 bg-primary-600 rounded-full"></div>
                   <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">AI Recommendations</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 md:gap-8">
                  {recommendations.map((rec) => (
                    <div key={rec.imdbID} className="transition-all duration-500 hover:scale-105 active:scale-95 group">
                      <MediaCard
                        id={rec.imdbID}
                        type={rec.type === 'series' ? 'tv' : 'movie'}
                        title={rec.title}
                        posterPath={rec.poster !== 'N/A' ? rec.poster : null}
                        voteAverage={parseFloat(rec.imdbRating) || 0}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-white/20 rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Database Scan</h2>
                 </div>
                 <span className="text-[10px] md:text-[12px] font-black text-primary-500/50 uppercase tracking-[0.4em]">Primary Results ({results.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 xl:gap-10">
                {results.map((item) => (
                  <div key={item.id} className="transition-all duration-500 hover:scale-105 active:scale-95 group">
                    <MediaCard
                      id={item.id}
                      type={item.media_type === 'movie' ? 'movie' : 'tv'}
                      title={item.media_type === 'movie' ? (item.title || '') : (item.name || '')}
                      posterPath={item.poster_path}
                      voteAverage={item.vote_average}
                    />
                  </div>
                ))}
              </div>
            </section>

            {totalPages > 1 && (
              <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Traversal Coordinate</span>
                    <span className="px-6 py-2 bg-white/5 rounded-2xl text-xs font-black text-white border border-white/10 uppercase tracking-widest shadow-xl">
                       Archive Block {currentPage} of {totalPages}
                    </span>
                 </div>

                <div className="flex items-center gap-6">
                  {currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-10 py-4 bg-white/5 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                    >
                      PREV DATA
                    </button>
                  )}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-10 py-4 bg-primary-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-primary-500 transition-all shadow-2xl shadow-primary-600/20 active:scale-95"
                    >
                      NEXT DATA
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
