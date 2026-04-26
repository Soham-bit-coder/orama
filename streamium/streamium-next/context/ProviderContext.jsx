"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProviderContext = createContext();

export function ProviderProvider({ children }) {
  const [urls, setUrls] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProviderUrls = useCallback(async () => {
    try {
      const response = await fetch("/api/providers");
      if (!response.ok) throw new Error("Failed to fetch providers");
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      console.error("Failed to load provider URLs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProviderUrls();
  }, [loadProviderUrls]);

  const getEmbedUrl = (providerId, mediaId, type, season, episode) => {
    const idStr = typeof mediaId === "number"
      ? "tt" + mediaId.toString().padStart(7, "0")
      : mediaId.toString();

    switch (providerId) {
      case "neural_clean":
        return `neural://resolve?id=${idStr}&type=${type}${season ? `&season=${season}` : ''}${episode ? `&episode=${episode}` : ''}`;

      case "vidsrc_icu":
        if (type === "movie") return `https://vidsrc.icu/embed/movie/${idStr}`;
        if (season && episode) return `https://vidsrc.icu/embed/tv/${idStr}/${season}/${episode}`;
        return `https://vidsrc.icu/embed/tv/${idStr}`;

      case "vidsrc_me":
        if (type === "movie") return `https://vidsrc.me/embed/movie?imdb=${idStr}`;
        if (season && episode) return `https://vidsrc.me/embed/tv?imdb=${idStr}&season=${season}&episode=${episode}`;
        return `https://vidsrc.me/embed/tv?imdb=${idStr}`;

      case "superembed":
        if (type === "movie") return `https://multiembed.mov/?video_id=${idStr}&tmdb=0`;
        if (season && episode) return `https://multiembed.mov/?video_id=${idStr}&tmdb=0&s=${season}&e=${episode}`;
        return `https://multiembed.mov/?video_id=${idStr}&tmdb=0`;

      case "vidsrc_net":
        if (type === "movie") return `https://vidsrc.net/embed/movie/${idStr}`;
        if (season && episode) return `https://vidsrc.net/embed/tv/${idStr}/${season}/${episode}`;
        return `https://vidsrc.net/embed/tv/${idStr}`;

      case "vidlink":
        if (type === "movie") return `https://vidlink.pro/movie/${idStr}?autoplay=true&title=true&primaryColor=E50914`;
        if (season && episode) return `https://vidlink.pro/tv/${idStr}/${season}/${episode}?autoplay=true&title=true&primaryColor=E50914`;
        return `https://vidlink.pro/tv/${idStr}/1/1?autoplay=true&title=true&primaryColor=E50914`;

      case "vidbinge":
        if (type === "movie") return `https://vidbinge.dev/embed/movie/${idStr}`;
        if (season && episode) return `https://vidbinge.dev/embed/tv/${idStr}/${season}/${episode}`;
        return `https://vidbinge.dev/embed/tv/${idStr}`;

      default:
        return "";
    }
  };

  const providers = [
    { id: "neural_clean", name: "Neural Sync (Clean • No Ads)" },
    { id: "vidsrc_icu",   name: "VidSrc ICU" },
    { id: "vidsrc_me",    name: "VidSrc ME" },
    { id: "superembed",   name: "MultiEmbed" },
    { id: "vidbinge",     name: "VidBinge" },
    { id: "vidlink",      name: "VidLink" },
    { id: "vidsrc_net",   name: "VidSrc NET" },
  ];

  return (
    <ProviderContext.Provider value={{ urls, loading, getEmbedUrl, providers }}>
      {children}
    </ProviderContext.Provider>
  );
}

export const useProviders = () => useContext(ProviderContext);
