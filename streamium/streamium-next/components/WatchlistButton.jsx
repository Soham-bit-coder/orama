"use client";

import React, { useState, useEffect } from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function WatchlistButton({ id, type, title, posterPath, voteAverage }) {
  const { isAuthenticated } = useAuth();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { success, error: toastError } = useToast();

  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      if (!isAuthenticated) return;
      try {
        const status = await isInWatchlist(id, type);
        if (mounted) setInWatchlist(status);
      } catch (err) {
        console.error('Failed to check watchlist status:', err);
      }
    };
    checkStatus();
    return () => { mounted = false; };
  }, [id, type, isAuthenticated, isInWatchlist]);

  const toggleWatchlist = async (e) => {
    e.stopPropagation(); // Prevent triggering parent link/click
    if (loading) return;
    if (!isAuthenticated) {
      toastError('Neural Sync Required: Please Login');
      return;
    }

    setLoading(true);

    try {
      if (inWatchlist) {
        await removeFromWatchlist(id, type);
        success('Memory Sector Purged: Removed from Watchlist');
      } else {
        await addToWatchlist(id, type, title, posterPath, voteAverage);
        success('Memory Block Initialized: Added to Watchlist');
      }
      setInWatchlist(!inWatchlist);
    } catch (err) {
      console.error('Failed to update watchlist:', err);
      toastError('Link Sequence Failure: Watchlist update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`p-3 rounded-2xl transition-all duration-500 border backdrop-blur-2xl active:scale-75 flex items-center justify-center group/btn shadow-xl
                 ${inWatchlist 
                   ? 'bg-primary-600 border-primary-500 text-white shadow-primary-600/30' 
                   : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
      onClick={toggleWatchlist}
      disabled={loading}
      aria-label={inWatchlist ? `De-link ${title}` : `Link ${title} to Repository`}
    >
      <div className="relative w-5 h-5">
         {loading ? (
            <div className="absolute inset-0 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
         ) : (
            <svg
              className={`w-full h-full transition-all duration-500 transform group-hover/btn:scale-110 
                         ${inWatchlist ? 'text-white' : 'text-gray-400 group-hover/btn:text-primary-400'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d={inWatchlist 
                  ? "M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" 
                  : "M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"}
              />
            </svg>
         )}
      </div>
      {/* Cinematic Label Fade (Optional for Large buttons) */}
    </button>
  );
}
