"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import CommentList from '@/components/CommentList';
import WatchlistButton from '@/components/WatchlistButton';
import EpisodeSelector from '@/components/EpisodeSelector';
import NextEpisode from '@/components/NextEpisode';
import Navbar from '@/components/Navbar';
import TrailerModal from '@/components/TrailerModal';
import { getMLAnalysis } from '@/lib/services/ml';
import { useProviders } from '@/context/ProviderContext';

export default function MediaClient({ media, type }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { providers } = useProviders();

  const season = parseInt(searchParams.get('season') || '1');
  const episode = parseInt(searchParams.get('episode') || '1');

  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [mlAnalysis, setMlAnalysis] = useState(null);
  const videoPlayerRef = useRef(null);
  const playerSectionRef = useRef(null);

  useEffect(() => {
    if (media?.id) {
      getMLAnalysis(media.id).then(setMlAnalysis);
    }
  }, [media.id]);

  const scrollToPlayer = () => {
    playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEpisodeSelect = ({ season: s, episode: e }) => {
    const params = new URLSearchParams(searchParams);
    params.set('season', s.toString());
    params.set('episode', e.toString());
    router.replace(`/media/${media.id}?${params.toString()}`);
  };

  const handleNextEpisode = (s, e) => {
    const params = new URLSearchParams(searchParams);
    params.set('season', s.toString());
    params.set('episode', e.toString());
    router.replace(`/media/${media.id}?${params.toString()}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const seasonCount = type === 'tv' ? media?.number_of_seasons : 0;
  const episodeCount = type === 'tv' ? media?.number_of_episodes : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary-500/30 overflow-x-hidden">
      <Navbar />

      {/* Compact Cinematic Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[65vh] flex items-end">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {(media?.backdrop_path || media?.poster_path) && (
            <img
              src={(media?.backdrop_path || media?.poster_path).startsWith('http') ? (media?.backdrop_path || media?.poster_path) : `https://image.tmdb.org/t/p/original${media?.backdrop_path || media?.poster_path}`}
              alt=""
              className="w-full h-full object-cover opacity-80 transition-transform duration-[20s] ease-out scale-100 animate-slow-zoom"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/20 to-transparent"></div>
        </div>

        <div className="container relative z-10 pb-12 md:pb-16">
          <div className="max-w-3xl space-y-4 md:space-y-6 animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-2">
              {(media.genres || []).slice(0, 3).map((genre) => (
                <span key={genre.id} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[9px] font-bold uppercase tracking-[0.1em] text-white border border-white/10">{genre.name}</span>
              ))}
              <span className="flex items-center gap-1 px-2 py-0.5 bg-primary-600/20 backdrop-blur-md rounded-md text-[9px] font-bold uppercase tracking-[0.1em] text-primary-400 border border-primary-500/20">
                ⭐ {media.vote_average?.toFixed(1)}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[1] filter drop-shadow-2xl">
              {media.title || media.name}
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed font-medium opacity-90 line-clamp-2 md:line-clamp-3 border-l border-primary-500/50 pl-4">
              {media.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={scrollToPlayer}
                className="group relative flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-500 rounded-xl transition-all duration-500 shadow-xl active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Stream</span>
              </button>

              <button 
                onClick={() => setIsTrailerOpen(true)}
                className="group relative flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-500 active:scale-95 overflow-hidden"
              >
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Preview</span>
              </button>
              
              <div className="scale-90 origin-left">
                <WatchlistButton
                   id={media.id}
                   type={type}
                   title={media.title || media.name || ''}
                   posterPath={media.poster_path || null}
                   voteAverage={media.vote_average}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-16 md:space-y-20 pb-24">
        {/* Stream Interface Section */}
        <section ref={playerSectionRef} className="container pt-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary-500 mb-0.5">Neural Link</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Cinematic Feed</h2>
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-primary-600/20 via-primary-600/5 to-transparent"></div>
            </div>

            <div className="group relative">
              <div className="relative bg-slate-900/40 rounded-[32px] overflow-hidden border border-white/5 shadow-3xl backdrop-blur-3xl p-2 md:p-3">
                <VideoPlayer
                  ref={videoPlayerRef}
                  mediaId={media.id}
                  mediaType={type}
                  title={media.title || media.name || ''}
                  season={type === 'tv' ? season : undefined}
                  episode={type === 'tv' ? episode : undefined}
                />

                {type === 'tv' && (
                  <div className="mt-4 px-4 py-5 bg-white/5 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-primary-500/60 uppercase tracking-[0.3em]">Sequence</span>
                          <span className="text-xl md:text-2xl font-black text-white tracking-tighter">
                            S{season} <span className="text-primary-500">/</span> E{episode}
                          </span>
                       </div>
                       <button
                         type="button"
                         className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest"
                         onClick={() => setShowEpisodeModal(true)}
                       >
                         Switch
                       </button>
                    </div>

                    <div className="scale-90">
                      <NextEpisode
                        mediaId={media.id}
                        currentSeason={season}
                        currentEpisode={episode}
                        onSelect={handleNextEpisode}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Scaled Data Grid */}
        <section className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* Metadata Sidebar */}
            <div className="lg:col-span-3 space-y-6">
               <div className="relative aspect-[3/4.5] rounded-[32px] overflow-hidden shadow-2xl border border-white/5 group">
                  <img
                    src={media.poster_path ? (media.poster_path.startsWith('http') ? media.poster_path : `https://image.tmdb.org/t/p/w500${media.poster_path}`) : '/placeholder-poster.jpg'}
                    alt={media.title || media.name || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
               </div>

               <div className="bg-white/5 rounded-[24px] p-6 border border-white/5 space-y-4">
                 <h3 className="text-sm font-black uppercase tracking-widest border-b border-white/5 pb-2">Specs</h3>
                 <div className="space-y-2">
                    <StatRow label="Launch" value={(media.release_date || media.first_air_date)?.split(' ')[2] || 'Archive'} />
                    <StatRow label="Rating" value={media.vote_average?.toFixed(1)} highlight />
                    {media.runtime && <StatRow label="Time" value={media.runtime} />}
                 </div>
               </div>
            </div>

            {/* AI Analysis & Interaction */}
            <div className="lg:col-span-9 flex flex-col gap-12">
              
              {/* AI Analysis Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-800 rounded-[48px] blur-[20px] opacity-10"></div>
                <div className="relative bg-white/5 backdrop-blur-3xl rounded-[48px] p-8 md:p-12 border border-white/5 overflow-hidden shadow-2xl">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500">Neural Scan</span>
                         </div>
                         <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Vector distribution</h3>
                         
                         <div className="space-y-6">
                            {[
                              { label: 'Intensity', value: mlAnalysis?.tone?.intensity ?? 85, color: 'bg-primary-500' },
                              { label: 'Narrative', value: mlAnalysis?.tone?.narrative_complexity ?? 72, color: 'bg-indigo-500' },
                              { label: 'Aesthetic', value: mlAnalysis?.tone?.aesthetic_mood_shift ?? 35, color: 'bg-purple-600' }
                            ].map((stat) => (
                              <div key={stat.label} className="space-y-2.5">
                                 <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                                    <span className="text-xs font-black text-white">{stat.value}%</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${stat.color} rounded-full transition-all duration-1000`} style={{ width: `${stat.value}%` }}></div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-8 bg-[#020617]/40 rounded-[40px] border border-white/5 text-center">
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Probability Index</span>
                         <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            <svg className="w-full h-full -rotate-90">
                               <circle cx="80" cy="80" r="72" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                               <circle cx="80" cy="80" r="72" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-primary-500" 
                                  strokeDasharray="452.3" 
                                  style={{ strokeDashoffset: 452.3 - (452.3 * (mlAnalysis?.neural_match ?? 92) / 100) }} />
                            </svg>
                            <span className="absolute text-5xl font-black tracking-tighter text-glow">{mlAnalysis?.neural_match ?? 92}%</span>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-500">Lock: High</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Cast & Crew Intel Section */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                   <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Cast & Crew Intel</h3>
                   <div className="h-[1px] flex-1 bg-gradient-to-r from-primary-600/30 via-primary-600/5 to-transparent"></div>
                </div>

                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 mask-fade-right">
                   {/* Director & Writers First */}
                   {[
                     ...(media?.director ? media.director.split(',').map(d => ({ name: d.trim(), role: 'Director' })) : []),
                     ...(media?.writer ? media.writer.split(',').map(w => ({ name: w.trim(), role: 'Writer' })) : []),
                     ...(media?.actors ? media.actors.split(',').map(a => ({ name: a.trim(), role: 'Cast' })) : [])
                   ].map((person, idx) => (
                     <button
                       key={`${person.name}-${idx}`}
                       onClick={() => router.push(`/search?query=${encodeURIComponent(person.name)}`)}
                       className="flex-shrink-0 group flex flex-col items-center gap-6 w-32 md:w-36 transition-all duration-500 hover:-translate-y-4"
                     >
                       <div className="relative w-full aspect-square rounded-[36px] overflow-hidden bg-slate-950 shadow-xl border border-white/5 group-hover:border-primary-500/40 group-hover:shadow-[0_20px_40px_rgba(229,9,20,0.2)] transition-all flex items-center justify-center">
                          <span className="absolute text-2xl font-black text-primary-900/40 uppercase select-none">{person.name?.charAt(0)}</span>
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(person.name)}&backgroundColor=020617&fontFamily=Outfit&fontSize=40&chars=1`}
                            alt={person.name}
                            className="relative z-10 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-40"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-primary-600/10">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                       </div>
                       <div className="text-center space-y-1">
                          <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate w-full group-hover:text-primary-400 transition-colors">{person.name}</h4>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{person.role}</p>
                       </div>
                     </button>
                   ))}
                </div>
              </div>

              {/* Members Intel (Comments) */}
              <div className="bg-white/5 backdrop-blur-3xl rounded-[48px] p-8 md:p-12 border border-white/5 shadow-2xl">
                <div className="flex items-center gap-6 mb-12">
                   <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Member Intel</h2>
                   <div className="h-[1px] flex-1 bg-gradient-to-r from-primary-600/30 to-transparent"></div>
                </div>
                <CommentList
                  mediaId={media.id}
                  mediaType={type}
                  season={type === 'tv' ? season : undefined}
                  episode={type === 'tv' ? episode : undefined}
                />
              </div>

            </div>
          </div>
        </section>
      </div>

      <EpisodeSelector
        mediaId={media.id}
        showModal={showEpisodeModal}
        onSelect={handleEpisodeSelect}
        onClose={() => setShowEpisodeModal(false)}
      />

      <TrailerModal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
        title={media.title || media.name || ""} 
        mediaId={media.id}
        mediaType={type}
      />
    </div>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">{label}</span>
      <span className={`font-black uppercase tracking-widest ${highlight ? 'text-primary-500 text-lg' : 'text-white text-xs'}`}>{value}</span>
    </div>
  );
}

