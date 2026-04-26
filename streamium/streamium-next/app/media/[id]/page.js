import { TMDBService } from '@/lib/services/tmdb';
import MediaClient from './MediaClient';
import { notFound } from 'next/navigation';

export default async function MediaPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const tmdb = new TMDBService();
  const { id } = resolvedParams;
  const type = resolvedSearchParams.type || 'movie';

  if (!id) {
    return notFound();
  }

  try {
    let media;
    if (type === 'movie') {
      media = await tmdb.getMovieDetails(id);
    } else {
      media = await tmdb.getTVShowDetails(id);
    }

    if (!media) {
      return notFound();
    }

    return (
      <MediaClient 
        media={media} 
        type={type} 
      />
    );
  } catch (err) {
    console.error('Failed to load media details:', err);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center">
          <h2 className="text-red-500 text-2xl font-black uppercase tracking-tighter mb-4">Neural Link Offline</h2>
          <p className="text-gray-400 font-medium">Failed to retrieve media data from our servers. The cinematic stream might be temporarily unavailable.</p>
          <a 
            href="/"
            className="mt-6 inline-block px-8 py-3 bg-primary-600 text-white font-black rounded-full uppercase text-xs tracking-widest active:scale-95 transition-all"
          >
            Return to Base
          </a>
        </div>
      </div>
    );
  }
}
