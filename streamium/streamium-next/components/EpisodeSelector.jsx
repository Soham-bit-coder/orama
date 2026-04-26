"use client";

import React, { useState, useEffect, useCallback } from 'react';

export default function EpisodeSelector({ mediaId, showModal, onSelect, onClose }) {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const loadEpisodes = useCallback(async (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    try {
      const response = await fetch(`/api/tv/${mediaId}/season/${seasonNumber}`);
      if (response.ok) {
        const data = await response.json();
        setEpisodes(data.episodes);
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  }, [mediaId]);

  const loadSeasons = useCallback(async () => {
    try {
      const response = await fetch(`/api/tv/${mediaId}/seasons`);
      if (response.ok) {
        const data = await response.json();
        const validSeasons = (data.seasons || []).filter((s) => s.season_number > 0);
        setSeasons(validSeasons);
        if (validSeasons.length > 0) {
          await loadEpisodes(validSeasons[0].season_number);
        }
      }
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  }, [mediaId, loadEpisodes]);

  useEffect(() => {
    if (showModal && mediaId && seasons.length === 0) {
      loadSeasons();
    }
  }, [showModal, mediaId, seasons.length, loadSeasons]);

  const handleEpisodeSelect = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
    if (onSelect) {
      onSelect({ season: selectedSeason, episode: episodeNumber });
    }
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
      <div className="bg-[#050505] border border-white/10 rounded-[40px] w-full max-w-5xl h-[85vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative">
        
        {/* Ambient Glow Decorator */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-600/5 blur-[120px] rounded-full"></div>

        {/* Header */}
        <div className="flex justify-between items-center px-10 py-8 border-b border-white/5 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-1">Navigation Console</span>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Select Episode</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 shadow-xl"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5 relative z-10">
          
          {/* Seasons Sidebar */}
          <div className="h-1/4 md:h-full w-full md:w-1/4 overflow-x-auto md:overflow-y-auto no-scrollbar bg-black/20">
            <div className="px-4 md:px-6 py-4 md:py-8 flex flex-row md:flex-col gap-2">
              <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-4">Seasons</span>
              {seasons.map((season) => (
                <button
                  key={season.season_number}
                  type="button"
                  className={`flex-none w-32 md:w-full px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-left transition-all relative group flex flex-col md:flex-row items-center md:justify-between ${selectedSeason === season.season_number ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/30 font-black' : 'text-gray-400 hover:text-white hover:bg-white/5 font-bold'}`}
                  onClick={() => loadEpisodes(season.season_number)}
                >
                  <span className="text-xs md:text-lg tracking-tight whitespace-nowrap">S{season.season_number}</span>
                  <span className="text-[8px] md:text-[10px] font-black opacity-40 group-hover:opacity-100 uppercase">{season.episode_count} EP</span>
                  
                  {selectedSeason === season.season_number && (
                     <div className="hidden md:block absolute left-0 top-4 bottom-4 w-1 bg-white rounded-r-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Episodes Main List */}
          <div className="flex-1 overflow-y-auto no-scrollbar bg-[#080808]/50 p-4 md:p-10">
            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between mb-2 md:mb-6 px-2">
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Catalogue</span>
                 {selectedSeason && (
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary-500">SERIES ACTIVE</span>
                 )}
               </div>

              {selectedSeason && episodes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {episodes.map((episode) => (
                    <button
                      key={episode.episode_number}
                      type="button"
                      className={`w-full p-4 md:p-6 rounded-[24px] text-left transition-all border group relative isolate overflow-hidden ${selectedEpisode === episode.episode_number ? 'bg-primary-600/20 border-primary-500/50 shadow-2xl shadow-primary-500/10' : 'bg-white/3 border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                      onClick={() => handleEpisodeSelect(episode.episode_number)}
                    >
                      <div className="flex items-start gap-4 md:gap-6 relative z-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex-none flex items-center justify-center rounded-xl md:rounded-2xl bg-black/40 text-sm md:text-xl font-black group-hover:text-primary-500 transition-colors">
                           {episode.episode_number.toString().padStart(2, '0')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm md:text-xl font-black text-white tracking-tight mb-1 md:mb-2 uppercase group-hover:translate-x-1 transition-transform truncate md:whitespace-normal">{episode.name}</h3>
                          <p className="text-[10px] md:text-sm text-gray-400 line-clamp-1 md:line-clamp-2 leading-relaxed opacity-60 font-medium">
                            {episode.overview || 'Synopsis not available for this episode yet.'}
                          </p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 flex-none flex items-center justify-center rounded-full bg-primary-600 text-white scale-0 md:group-hover:scale-100 transition-transform shadow-xl">
                          <svg className="w-4 h-4 md:w-5 md:h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 md:py-40 gap-4 opacity-20">
                  <svg className="w-12 h-12 md:w-20 md:h-20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-black uppercase tracking-widest text-[8px] md:text-sm">Initiate Sequence</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
