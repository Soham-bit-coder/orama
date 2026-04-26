"use client";

import React, { useState, useEffect, useCallback } from 'react';

export default function NextEpisode({ mediaId, currentSeason, currentEpisode, onSelect }) {
  const [nextEpisode, setNextEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNextEpisode = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tv/${mediaId}/season/${currentSeason}`);
      if (response.ok) {
        const data = await response.json();
        const episodes = data.episodes || [];
        const nextInSeason = episodes.find((ep) => ep.episode_number === currentEpisode + 1);

        if (nextInSeason) {
          setNextEpisode({ ...nextInSeason, season_number: currentSeason });
        } else {
          const seasonsResponse = await fetch(`/api/tv/${mediaId}/seasons`);
          if (seasonsResponse.ok) {
            const seasonsData = await seasonsResponse.json();
            const seasons = (seasonsData.seasons || []).filter((s) => s.season_number > 0);
            const nextSeason = seasons.find((s) => s.season_number === currentSeason + 1);

            if (nextSeason) {
              const nextSeasonResponse = await fetch(`/api/tv/${mediaId}/season/${nextSeason.season_number}`);
              if (nextSeasonResponse.ok) {
                const nextSeasonData = await nextSeasonResponse.json();
                const firstEpisode = nextSeasonData.episodes?.[0];
                if (firstEpisode) {
                  setNextEpisode({ ...firstEpisode, season_number: nextSeason.season_number });
                }
              }
            } else {
               setNextEpisode(null);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading next episode:', error);
    } finally {
      setLoading(false);
    }
  }, [mediaId, currentSeason, currentEpisode]);

  useEffect(() => {
    if (mediaId && currentSeason && currentEpisode) {
      loadNextEpisode();
    }
  }, [mediaId, currentSeason, currentEpisode, loadNextEpisode]);

  const handleNextEpisode = () => {
    if (nextEpisode && nextEpisode.season_number) {
      onSelect(nextEpisode.season_number, nextEpisode.episode_number);
    }
  };

  if (loading || !nextEpisode) return null;

  return (
    <button
      className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors whitespace-nowrap flex items-center gap-2"
      onClick={handleNextEpisode}
    >
      <span>Next: {nextEpisode.season_number !== currentSeason ? `S${nextEpisode.season_number}E${nextEpisode.episode_number}` : `E${nextEpisode.episode_number}`}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
