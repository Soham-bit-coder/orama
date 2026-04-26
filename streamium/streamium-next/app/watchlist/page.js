"use client";

import React, { useEffect } from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { useAuth } from '@/context/AuthContext';
import MediaCard from '@/components/MediaCard';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function WatchlistPage() {
  const { items, loading, error, getWatchlist } = useWatchlist();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      getWatchlist();
    }
  }, [user, getWatchlist]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <div className="pt-40 flex flex-col items-center justify-center container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 text-gray-500">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Neural Access Denied</h1>
          <p className="text-gray-500 font-bold mb-10 max-w-md">You must synchronize your identity with the Orama Network to access your personal archive.</p>
          <Link 
            href="/login"
            className="px-10 py-4 bg-primary-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-500 transition-all shadow-2xl shadow-primary-600/20 active:scale-95"
          >
            Authenticate Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="pt-32 md:pt-44 pb-20 container mx-auto px-4 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
           <div className="flex flex-col gap-4">
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-primary-500">Neural Repository</span>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">Personal Archive</h1>
           </div>
           <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sync Status: Online</span>
              <span className="text-xs font-black text-white ml-4">{items.length} Sequences Cached</span>
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <div className="w-20 h-20 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-widest">Traversing Data Blocks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/20 border border-red-500/20 p-12 rounded-[40px] text-center shadow-2xl">
            <h3 className="text-xl font-black text-red-500 uppercase tracking-tighter mb-2">Sync Error Detected</h3>
            <p className="text-gray-500 font-bold">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/5 border border-white/5 border-dashed rounded-[50px] p-24 text-center group hover:border-primary-500/30 transition-all duration-1000">
            <div className="w-24 h-24 bg-black/40 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-10 text-gray-700 group-hover:text-primary-500 group-hover:scale-110 transition-all duration-700 group-hover:rotate-[360deg]">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.4em] mb-4 text-gray-500 group-hover:text-white transition-colors">Archive Empty</h2>
            <p className="text-gray-600 font-bold mb-12 group-hover:text-gray-400 transition-colors">Your personal repository is currently offline or lacks valid sequences.</p>
            <Link 
              href="/"
              className="inline-block px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-600 hover:border-primary-500 transition-all shadow-xl active:scale-95"
            >
              Discover Reality
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 md:gap-10 xl:gap-12">
            {items.map((item) => (
              <div 
                key={`${item.mediaType}-${item.mediaId}`}
                className="transition-all duration-500 hover:scale-105 active:scale-95 group relative"
              >
                <div className="absolute -inset-2 bg-primary-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative z-10">
                  <MediaCard
                    id={item.mediaId}
                    type={item.mediaType}
                    title={item.title}
                    posterPath={item.posterPath}
                    voteAverage={item.voteAverage}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
