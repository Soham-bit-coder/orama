import { TMDBService } from '@/lib/services/tmdb';
import ListingClient from '@/components/ListingClient';

export const metadata = {
  title: 'Movies - Orama Streaming',
  description: 'Discover the latest and greatest movies on Orama Streaming.',
};

export default async function MoviesPage() {
  const tmdb = new TMDBService();
  let initialItems = [];
  let featured = null;

  try {
    const res = await tmdb.getTrendingMovies(1);
    initialItems = res.results || [];
    if (initialItems.length > 0) {
      const best = initialItems.slice(0, 5);
      featured = best[Math.floor(Math.random() * best.length)];
    }
  } catch (err) {
    console.error('Failed to pre-fetch movies:', err);
  }

  return (
    <ListingClient 
      type="movie" 
      initialFeatured={featured} 
    />
  );
}
