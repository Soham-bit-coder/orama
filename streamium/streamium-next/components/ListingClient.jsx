"use client";

import React, { useState, useEffect, useCallback } from 'react';
import MediaCard from '@/components/MediaCard';
import MediaFilters from '@/components/MediaFilters';
import VideoPlayer from '@/components/VideoPlayer';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import TrailerModal from '@/components/TrailerModal';

export default function ListingClient({ type, initialFeatured }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState('trending');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [featuredMedia, setFeaturedMedia] = useState(initialFeatured);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerMedia, setTrailerMedia] = useState(null);

  const handleTrailer = (media) => {
    setTrailerMedia(media);
    setIsTrailerOpen(true);
  };

  const ITEMS_PER_CLIENT_PAGE = 4; // Fetch 4 OMDB pages (40 items) per client page

  const fetchItems = useCallback(async (currentPage = 1, sort = selectedSort, genre = selectedGenre, year = selectedYear) => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/${type === 'movie' ? 'movies' : 'tv'}`;
      
      const fetchPage = async (p) => {
        const params = new URLSearchParams({
          page: p.toString(),
          sort: sort,
          ...(genre && { genre: genre }),
          ...(year && { year: year })
        });
        const response = await fetch(`${url}?${params}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type}`);
        return response.json();
      };

      // Fetch 4 TMDB pages per custom pagination for a fuller grid (40 items)
      const startPage = (currentPage - 1) * ITEMS_PER_CLIENT_PAGE + 1;
      const responses = await Promise.all([
        fetchPage(startPage),
        fetchPage(startPage + 1),
        fetchPage(startPage + 2),
        fetchPage(startPage + 3),
      ]);
      
      let newResults = [];
      let lastData;
      for (const data of responses) {
        newResults = [...newResults, ...(data.results || [])];
        lastData = data;
      }

      // Deduplicate and filter out items missing poster artwork
      const filteredResults = newResults.filter((item, index, self) => 
        item.poster_path && index === self.findIndex((m) => m.id === item.id)
      );

      setItems(filteredResults);

      if (currentPage === 1 && filteredResults.length > 0 && !featuredMedia) {
        const best = filteredResults.slice(0, 5);
        setFeaturedMedia(best[Math.floor(Math.random() * best.length)]);
      }

      setTotalPages(Math.ceil(Math.min(lastData?.total_pages || 1, 1000) / ITEMS_PER_CLIENT_PAGE)); 
      setPage(currentPage);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setError(`Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  }, [type, selectedSort, selectedGenre, selectedYear, featuredMedia]);

  useEffect(() => {
    fetchItems(1);
  }, []);

  const handleFilter = ({ sort, genre, year }) => {
    setSelectedSort(sort);
    setSelectedGenre(genre);
    setSelectedYear(year);
    fetchItems(1, sort, genre, year);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages && p !== page) {
      fetchItems(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setTimeout(() => {
      const playerTarget = document.getElementById('media-player-container');
      if (playerTarget) {
        playerTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const closePlayer = () => {
    setSelectedMedia(null);
  };

  const paginationPages = () => {
    let pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-primary-500/30 overflow-x-hidden">
      <Navbar />

      {featuredMedia && page === 1 && (
        <Hero media={featuredMedia} type={type} />
      )}

      <div className={`${page === 1 ? 'pb-16 -mt-32' : 'py-16'} relative z-20`}>
        <div className="container">
          
          <div className="mb-12 p-6 md:p-8 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-primary-600/10 blur-[120px] rounded-full group-hover:bg-primary-600/20 transition-all duration-1000"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
               <div className="flex items-center gap-4">
                 <div className="h-10 w-1 bg-primary-600 rounded-full shadow-[0_0_20px_rgba(229,9,20,0.5)]"></div>
                 <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                      {type === 'movie' ? 'Cinema Discovery' : 'Broadcast Discovery'}
                    </h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mt-1">Catalogue Sequence</p>
                 </div>
               </div>
               
               <div className="scale-90 md:scale-100 origin-right">
                 <MediaFilters
                   type={type}
                   selectedSort={selectedSort}
                   selectedGenre={selectedGenre}
                   selectedYear={selectedYear}
                   onFilter={handleFilter}
                 />
               </div>
            </div>
          </div>

          {selectedMedia && (
            <div id="media-player-container" className="mb-16 bg-slate-900/60 rounded-[40px] overflow-hidden shadow-3xl backdrop-blur-3xl border border-white/10 animate-in fade-in slide-in-from-bottom-12 duration-700 relative z-30 p-2 md:p-4">
              <div className="flex justify-between items-start mb-8 gap-6 px-4 pt-4">
                <div>
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary-500 mb-2 block animate-pulse">Neural Link...</span>
                   <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedMedia.title || selectedMedia.name}</h2>
                   {selectedMedia.overview && (
                     <p className="text-gray-400 mt-4 max-w-4xl text-sm font-medium leading-relaxed opacity-90 line-clamp-2 md:line-clamp-none border-l border-primary-500/50 pl-6">{selectedMedia.overview}</p>
                   )}
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all flex-shrink-0 border border-white/10 shadow-2xl group active:scale-90"
                  onClick={closePlayer}
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="rounded-[32px] overflow-hidden shadow-2xl bg-black aspect-video flex relative insulate z-10 border border-white/10">
                 <VideoPlayer
                   mediaId={selectedMedia.id}
                   mediaType={type}
                   title={selectedMedia.title || selectedMedia.name || 'Unknown'}
                 />
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-48 min-h-[50vh]">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-3 border-primary-600/10 rounded-full"></div>
                <div className="absolute inset-0 border-3 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-primary-500 animate-pulse">Scanning Nodes</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-24 bg-red-950/10 rounded-[48px] border border-red-500/20 shadow-3xl max-w-4xl mx-auto px-8 backdrop-blur-3xl">
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-tight">Link Severed</h3>
              <p className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8">System Error: {error}</p>
              <button 
                onClick={() => fetchItems(page)} 
                className="btn btn-primary px-10 py-4 text-[10px] uppercase tracking-[0.3em] rounded-xl shadow-[0_20px_40px_rgba(229,9,20,0.3)]"
              >
                Re-Sync
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-gray-500 text-center py-40 bg-white/5 rounded-[48px] border border-white/10 border-dashed max-w-4xl mx-auto animate-fade-in-up">
              <p className="text-xl font-black uppercase tracking-[0.4em] text-gray-600">Zero Results</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-12 animate-fade-in-up">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => handleMediaClick(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <MediaCard
                      id={item.id}
                      type={type}
                      title={item.title || item.name || ''}
                      posterPath={item.poster_path}
                      voteAverage={item.vote_average}
                      onTrailer={handleTrailer}
                    />
                  </div>
                ))}
              </div>

              {/* Sophisticated High-Performance Pagination */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-24 mb-12 p-6 md:p-8 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-3xl animate-fade-in-up">
                <div className="flex items-center gap-3 order-2 md:order-1">
                   {page > 1 && (
                     <button
                       onClick={() => goToPage(1)}
                       className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-[9px] font-black uppercase hover:bg-white/10 transition-all hover:scale-105"
                     >
                       First
                     </button>
                   )}
                   <button 
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-white disabled:opacity-20 transition-all border border-white/10 active:scale-95 group"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                    Prev
                  </button>
                </div>
                
                <div className="flex items-center gap-2 order-1 md:order-2">
                  {paginationPages().map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black transition-all border duration-500
                                ${p === page 
                                  ? 'bg-primary-600 border-primary-400 text-white shadow-[0_0_20px_rgba(229,9,20,0.4)] scale-110' 
                                  : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10 hover:scale-105'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 order-3">
                  <button 
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-[9px] font-black uppercase tracking-widest text-white disabled:opacity-20 transition-all shadow-xl active:scale-95 border border-primary-500 group"
                  >
                     Next
                     <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <TrailerModal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)} 
        title={trailerMedia?.title || trailerMedia?.name || ""} 
        mediaId={trailerMedia?.id}
        mediaType={type || (trailerMedia?.title ? 'movie' : 'tv')}
      />
    </div>
  );
}
