export const dynamic = 'force-dynamic';

import { TMDBService } from '@/lib/services/tmdb';
import ListingClient from '@/components/ListingClient';

export const metadata = {
  title: 'TV Shows - Orama Streaming',
  description: 'Discover the latest and greatest TV shows on Orama Streaming.',
};

export default async function TVShowsPage() {
  const tmdb = new TMDBService();
  let initialItems = [];
  let featured = null;

  try {
    const res = await tmdb.getTrendingTVShows(1);
    initialItems = res.results || [];
    if (initialItems.length > 0) {
      const best = initialItems.slice(0, 5);
      featured = best[Math.floor(Math.random() * best.length)];
    }
  } catch (err) {
    console.error('Failed to pre-fetch TV shows:', err);
  }

  return (
    <ListingClient 
      type="tv" 
      initialFeatured={featured} 
    />
  );
}
