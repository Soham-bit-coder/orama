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
    
    if (genre || year) {
       res = await tmdb.discoverTVShows({ 
         page, 
         with_genres: genre, 
         first_air_date_year: year,
         sort_by: sort === 'popular' ? 'popularity.desc' : (sort === 'top_rated' ? 'vote_average.desc' : 'popularity.desc')
       });
    } else {
      switch(sort) {
        case 'trending': res = await tmdb.getTrendingTVShows(page); break;
        case 'popular': res = await tmdb.getPopularTVShows(page); break;
        case 'top_rated': res = await tmdb.getTopRatedTVShows(page); break;
        case 'on_the_air': res = await tmdb.getOnTheAirTVShows(page); break;
        default: res = await tmdb.discoverTVShows({ page });
      }
    }
    
    return NextResponse.json(res);
  } catch (err) {
    console.error('TV API error:', err);
    return NextResponse.json({ error: err.message, results: [] }, { status: 500 });
  }
}
