"use client";

import React, { createContext, useContext } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const value = {
    items: [],
    total: 0,
    loading: false,
    error: null,
    getWatchlist: async () => ({ items: [], total: 0 }),
    addToWatchlist: async () => {},
    removeFromWatchlist: async () => {},
    isInWatchlist: async () => false,
    reset: () => {},
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export const useWatchlist = () => useContext(WatchlistContext);
