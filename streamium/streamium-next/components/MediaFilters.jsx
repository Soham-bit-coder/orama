"use client";

import React from 'react';

const genres = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Science Fiction' },
  { id: '10770', name: 'TV Movie' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

export default function MediaFilters({ type, selectedSort, selectedGenre, selectedYear, onFilter }) {
  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'popular', label: 'Popular' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'now_playing', label: type === 'movie' ? 'Now Playing' : 'Currently Airing' },
    { value: 'upcoming', label: type === 'movie' ? 'Upcoming' : 'Upcoming Shows' }
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    onFilter({
      sort: id === 'sort' ? value : selectedSort,
      genre: id === 'genre' ? value : selectedGenre,
      year: id === 'year' ? value : selectedYear
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex flex-col gap-1.5 md:gap-2 min-w-[140px] md:min-w-[160px]">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Sort Selection</span>
            <select
              id="sort"
              value={selectedSort}
              onChange={handleChange}
              className="bg-transparent text-white font-black text-base md:text-lg uppercase tracking-tighter focus:outline-none cursor-pointer hover:text-primary-400 transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900 text-sm capitalize">{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:gap-2 min-w-[140px] md:min-w-[160px] border-l border-white/5 md:border-white/10 pl-6 md:pl-10">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Genre</span>
            <select
              id="genre"
              value={selectedGenre}
              onChange={handleChange}
              className="bg-transparent text-white font-black text-base md:text-lg uppercase tracking-tighter focus:outline-none cursor-pointer hover:text-primary-400 transition-colors"
            >
              <option value="" className="bg-slate-900 text-sm">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id} className="bg-slate-900 text-sm">{genre.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:gap-2 min-w-[110px] md:min-w-[120px] border-l border-white/5 md:border-white/10 pl-6 md:pl-10">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Year</span>
            <select
              id="year"
              value={selectedYear}
              onChange={handleChange}
              className="bg-transparent text-white font-black text-base md:text-lg uppercase tracking-tighter focus:outline-none cursor-pointer hover:text-primary-400 transition-colors"
            >
              <option value="" className="bg-slate-900 text-sm">Any Year</option>
              {years.map((year) => (
                <option key={year} value={year} className="bg-slate-900 text-sm">{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
           <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Discovery</span>
        </div>
      </div>
    </div>
  );
}
