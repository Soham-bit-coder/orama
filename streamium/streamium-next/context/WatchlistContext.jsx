"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { csrfFetch } from '@/lib/utils/csrf';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [state, setState] = useState({
    items: [],
    total: 0,
    loading: false,
    error: null,
  });

  const getWatchlist = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setState(s => ({ ...s, items: [], total: 0, loading: false, error: null }));
      return { items: [], total: 0 };
    }

    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const response = await fetch("/api/watchlist");
      if (!response.ok) throw new Error("Failed to fetch watchlist");
      const data = await response.json();
      setState(s => ({
        ...s,
        items: data.items,
        total: data.total,
        loading: false,
      }));
      return data;
    } catch (error) {
      setState(s => ({
        ...s,
        error: error.message || "Failed to fetch watchlist",
        loading: false,
      }));
      throw error;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    getWatchlist();
  }, [getWatchlist]);

  const addToWatchlist = async (mediaId, mediaType, title, posterPath, voteAverage) => {
    if (!isAuthenticated || !user) {
      throw new Error("Must be logged in to add to watchlist");
    }

    try {
      const response = await csrfFetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId,
          mediaType,
          title,
          posterPath,
          voteAverage,
        }),
      });
      if (!response.ok) throw new Error("Failed to add to watchlist");
      const newItem = await response.json();
      setState(s => ({
        ...s,
        items: [newItem, ...s.items],
        total: s.total + 1,
      }));
      return newItem;
    } catch (error) {
      throw error;
    }
  };

  const removeFromWatchlist = async (mediaId, mediaType) => {
    if (!isAuthenticated || !user) {
      throw new Error("Must be logged in to remove from watchlist");
    }

    try {
      const response = await csrfFetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, mediaType }),
      });
      if (!response.ok) throw new Error("Failed to remove from watchlist");
      setState(s => ({
        ...s,
        items: s.items.filter(
          (item) =>
            !(item.mediaId === mediaId && item.mediaType === mediaType),
        ),
        total: s.total - 1,
      }));
    } catch (error) {
      throw error;
    }
  };

  const isInWatchlist = async (mediaId, mediaType) => {
    if (!isAuthenticated || !user) {
      return false;
    }

    try {
      const response = await fetch(
        `/api/watchlist/check?mediaId=${mediaId}&mediaType=${mediaType}`,
      );
      if (!response.ok) throw new Error("Failed to check watchlist status");
      const { inWatchlist } = await response.json();
      return inWatchlist;
    } catch (error) {
      throw error;
    }
  };

  const reset = useCallback(() => {
    setState({
      items: [],
      total: 0,
      loading: false,
      error: null,
    });
  }, []);

  return (
    <WatchlistContext.Provider value={{ ...state, getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, reset }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
