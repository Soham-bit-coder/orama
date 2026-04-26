export const dynamic = 'force-dynamic';

import { TMDBService } from '@/lib/services/tmdb';
import { getMLRecommendations } from '@/lib/services/ml';
import SearchClient from './SearchClient';

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || '';
  const page = parseInt(resolvedParams.page || '1');
  const tmdb = new TMDBService();

  if (!query) {
    return <SearchClient results={[]} recommendations={[]} totalPages={0} query={query} />;
  }

  // Background fetch to ML backend (optional, like Svelte version)
  const ML_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://127.0.0.1:5000';
  fetch(`${ML_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }).catch(err => console.error('ML Background Search Error:', err));

  try {
    const [data, recommendations] = await Promise.all([
      tmdb.searchMulti(query, page),
      getMLRecommendations(query, 6),
    ]);

    const results = data.results.filter(
      (item) =>
        (item.media_type === 'movie' || item.media_type === 'tv') &&
        item.poster_path &&
        item.vote_average > 0
    );

    return (
      <SearchClient 
        results={results} 
        recommendations={recommendations || []} 
        totalPages={Math.min(data.total_pages || 0, 500)} 
        query={query}
      />
    );
  } catch (err) {
    console.error('Search Load Error:', err);
    return <SearchClient results={[]} recommendations={[]} totalPages={0} query={query} error="Failed to link with neural search matrix" />;
  }
}
