export const dynamic = 'force-dynamic';

import { TMDBService } from '@/lib/services/tmdb';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const tmdb = new TMDBService();

  if (!tmdb.isConfigured()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center">
          <h2 className="text-red-500 text-2xl font-black uppercase tracking-tighter mb-4">Configuration Error</h2>
          <p className="text-gray-400 font-medium">OMDB API key is not configured. Please add OMDB_API_KEY to your environment variables to initialize Orama.</p>
        </div>
      </div>
    );
  }

  try {
    const [tMovies, pMovies, pShows, trMovies, tShows] = await Promise.all([
      tmdb.getTrendingMovies(1),
      tmdb.getPopularMovies(1),
      tmdb.getPopularTVShows(1),
      tmdb.getTopRatedMovies(1),
      tmdb.getTrendingTVShows(1)
    ]);

    const unique = (arr) => arr.filter((m, i, self) => i === self.findIndex(x => x.id === m.id));

    const trending = unique([...(tMovies.results || []), ...(tShows.results || [])]).slice(0, 12);
    const movies = unique([...(pMovies.results || []), ...(trMovies.results || [])]).slice(0, 12);
    const tvShows = unique(pShows.results || []).slice(0, 12);

    return <HomeClient trending={trending} movies={movies} tvShows={tvShows} />;
  } catch (err) {
    console.error('Homepage load error:', err);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center">
          <h2 className="text-red-500 text-2xl font-black uppercase tracking-tighter mb-4">Initialization Failed</h2>
          <p className="text-gray-400 font-medium">Failed to load content from our neural servers. Please try again later.</p>
          <button className="mt-6 px-8 py-3 bg-red-600 text-white font-black rounded-full uppercase text-xs tracking-widest active:scale-95 transition-all">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
}
