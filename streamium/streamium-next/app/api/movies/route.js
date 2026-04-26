import { NextResponse } from 'next/server';
import { TMDBService } from '@/lib/services/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tmdb = new TMDBService();
  
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'trending';
  const genre = searchParams.get('genre');
  const year = searchParams.get('year');

  try {
    let res;
    
    // If genre or year is selected, use discoverMovies
    if (genre || year) {
       res = await tmdb.discoverMovies({ 
         page, 
         with_genres: genre, 
         primary_release_year: year,
         sort_by: sort === 'popular' ? 'popularity.desc' : (sort === 'top_rated' ? 'vote_average.desc' : 'popularity.desc')
       });
    } else {
      switch(sort) {
        case 'trending': res = await tmdb.getTrendingMovies(page); break;
        case 'popular': res = await tmdb.getPopularMovies(page); break;
        case 'top_rated': res = await tmdb.getTopRatedMovies(page); break;
        case 'upcoming': res = await tmdb.getUpcomingMovies(page); break;
        case 'now_playing': res = await tmdb.getPopularMovies(page); break; // Simplified
        default: res = await tmdb.discoverMovies({ page });
      }
    }
    
    return NextResponse.json(res);
  } catch (err) {
    console.error('Movies API error:', err);
    return NextResponse.json({ error: err.message, results: [] }, { status: 500 });
  }
}
