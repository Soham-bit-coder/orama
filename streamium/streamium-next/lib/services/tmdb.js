const OMDB_API_KEY = process.env.OMDB_API_KEY || '';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const MAX_RETRIES = 2;

export class TMDBApiError extends Error {
  constructor(message, statusCode, isAuthError = false) {
    super(message);
    this.name = 'TMDBApiError';
    this.statusCode = statusCode;
    this.isAuthError = isAuthError;
  }
}

export class TMDBService {
  constructor() {
    this.apiKey = OMDB_API_KEY || '';
    this.baseUrl = OMDB_BASE_URL;
  }

  isConfigured() {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  async fetchOMDB(params, retryCount = 0) {
    if (!this.isConfigured()) {
      throw new TMDBApiError(
        'OMDB API key is not configured. Please add OMDB_API_KEY to your env variables.',
        401,
        true
      );
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('apikey', this.apiKey);

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.append(key, value);
      }
    }

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status === 401) {
          throw new TMDBApiError('Invalid OMDB API key.', 401, true);
        }
        if (response.status >= 500 && retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return this.fetchOMDB(params, retryCount + 1);
        }
        throw new TMDBApiError(`OMDB API error: ${response.status} ${response.statusText}`, response.status);
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        if (data.Error === 'Invalid API key!') {
          throw new TMDBApiError('Invalid OMDB API key.', 401, true);
        }
        if (data.Error && data.Error.toLowerCase().includes('not found')) {
          return { Search: [], totalResults: "0", Response: "True" };
        }
        if (data.Error === 'Incorrect IMDb ID.') {
          throw new TMDBApiError('Incorrect IMDb ID.', 404);
        }
        throw new TMDBApiError(`OMDB Error: ${data.Error}`, 400);
      }

      return data;
    } catch (error) {
      if (error instanceof TMDBApiError) throw error;
      throw new TMDBApiError('Failed to fetch from OMDB API', 500);
    }
  }

  getOptimizedPoster(url, target = 'grid') {
    if (!url || url === 'N/A') return null;
    if (target === 'grid') return url.replace(/_V1_SX\d+\.jpg$/, '_V1_SX500.jpg');
    return url.replace(/_V1_SX\d+\.jpg$/, '_V1_.jpg');
  }

  mapSearchResult(item) {
    const rawId = item.imdbID || `fallback-${Date.now()}-${Math.random()}`;
    const gridPoster = this.getOptimizedPoster(item.Poster, 'grid');
    const highResPoster = this.getOptimizedPoster(item.Poster, 'high');
    return {
      id: rawId,
      title: item.Type === 'movie' ? item.Title : undefined,
      name: item.Type === 'series' ? item.Title : undefined,
      overview: '',
      poster_path: gridPoster,
      backdrop_path: highResPoster,
      release_date: item.Year,
      first_air_date: item.Year,
      vote_average: 8.0,
      vote_count: 100,
      genre_ids: [],
      media_type: item.Type === 'series' ? 'tv' : 'movie',
      popularity: 0,
    };
  }

  mapDetailResult(item, mediaType) {
    const rawId = item.imdbID || `fallback-${Date.now()}`;
    const isTv = mediaType === "tv";
    const gridPoster = this.getOptimizedPoster(item.Poster, 'grid');
    const highResPoster = this.getOptimizedPoster(item.Poster, 'high');
    return {
      id: rawId,
      title: isTv ? undefined : item.Title,
      name: isTv ? item.Title : undefined,
      overview: item.Plot !== 'N/A' ? item.Plot : 'No overview available.',
      poster_path: gridPoster,
      backdrop_path: highResPoster,
      release_date: item.Released,
      first_air_date: item.Released,
      vote_average: parseFloat(item.imdbRating) || 0,
      vote_count: parseInt((item.imdbVotes || '').replace(/,/g, '')) || 0,
      genre_ids: [],
      media_type: mediaType,
      popularity: parseFloat(item.imdbRating) || 0,
      number_of_seasons: isTv ? (parseInt(item.totalSeasons) || 1) : 0,
      actors: item.Actors || '',
      director: item.Director || '',
      writer: item.Writer || '',
      runtime: item.Runtime || '',
      rated: item.Rated || '',
      released: item.Released || '',
    };
  }

  dedup(items) {
    const seen = new Set();
    return items.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  getOMDBId(id) {
    const strId = id.toString();
    if (strId.startsWith('tt')) return strId;
    return 'tt' + strId.padStart(7, '0');
  }

  async getMovieDetails(id) {
    const data = await this.fetchOMDB({ i: this.getOMDBId(id) });
    return this.mapDetailResult(data, "movie");
  }

  async getTVShowDetails(id) {
    const data = await this.fetchOMDB({ i: this.getOMDBId(id) });
    return this.mapDetailResult(data, "tv");
  }

  async searchMovies(query, page = 1) {
    const data = await this.fetchOMDB({ s: query, type: 'movie', page: page.toString() });
    const results = this.dedup((data.Search || []).map(item => this.mapSearchResult(item)));
    return {
      page,
      results,
      total_pages: Math.ceil(parseInt(data.totalResults || '0') / 10),
      total_results: parseInt(data.totalResults || '0')
    };
  }

  async searchTVShows(query, page = 1) {
    const data = await this.fetchOMDB({ s: query, type: 'series', page: page.toString() });
    const results = this.dedup((data.Search || []).map(item => this.mapSearchResult(item)));
    return {
      page,
      results,
      total_pages: Math.ceil(parseInt(data.totalResults || '0') / 10),
      total_results: parseInt(data.totalResults || '0')
    };
  }

  async searchMulti(query, page = 1) {
    const data = await this.fetchOMDB({ s: query, page: page.toString() });
    const results = this.dedup((data.Search || []).map(item => this.mapSearchResult(item)));
    return {
      page,
      results,
      total_pages: Math.ceil(parseInt(data.totalResults || '0') / 10),
      total_results: parseInt(data.totalResults || '0')
    };
  }

  async fetchMulti(terms, type, page = 1) {
    const term = terms[(page - 1) % terms.length];
    const data = await this.fetchOMDB({ s: term, type: type === 'tv' ? 'series' : 'movie', page: page.toString() });
    return {
      page,
      results: this.dedup((data.Search || []).map(item => this.mapSearchResult(item))),
      total_pages: Math.ceil(parseInt(data.totalResults || '0') / 10),
      total_results: parseInt(data.totalResults || '0')
    };
  }

  static MOVIE_TERMS = ['Marvel', 'Star Wars', 'Fast', 'Mission', 'Spider', 'Avatar', 'Jurassic', 'Inception'];
  static TV_TERMS = ['Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Office', 'Friends', 'Sherlock', 'Narcos'];

  async discoverMovies(params = {}) {
    return this.fetchMulti(TMDBService.MOVIE_TERMS, 'movie', Number(params.page) || 1);
  }

  async discoverTVShows(params = {}) {
    return this.fetchMulti(TMDBService.TV_TERMS, 'tv', Number(params.page) || 1);
  }

  async getTrending(mediaType, page = 1) {
    return mediaType === 'movie'
      ? this.getTrendingMovies(page)
      : this.getTrendingTVShows(page);
  }

  async getTrendingMovies(page = 1) {
    return this.fetchMulti(TMDBService.MOVIE_TERMS, 'movie', page);
  }

  async getTrendingTVShows(page = 1) {
    return this.fetchMulti(TMDBService.TV_TERMS, 'tv', page);
  }

  async getPopularMovies(page = 1) {
    return this.fetchMulti(TMDBService.MOVIE_TERMS, 'movie', page);
  }

  async getPopularTVShows(page = 1) {
    return this.fetchMulti(TMDBService.TV_TERMS, 'tv', page);
  }

  async getTopRatedMovies(page = 1) {
    return this.fetchMulti(['Godfather', 'Schindler', 'Shawshank', 'Pulp Fiction', 'Dark Knight', 'Forrest', 'Inception'], 'movie', page);
  }

  async getTopRatedTVShows(page = 1) {
    return this.fetchMulti(['Breaking Bad', 'Wire', 'Sopranos', 'Chernobyl', 'Band of Brothers', 'Fleabag'], 'tv', page);
  }

  async getUpcomingMovies(page = 1) {
    return this.fetchMulti(['2025', 'Mission', 'Avatar', 'Marvel', 'Star Wars'], 'movie', page);
  }

  async getOnTheAirTVShows(page = 1) {
    return this.fetchMulti(['2025', 'House', 'Law', 'Grey', 'Chicago'], 'tv', page);
  }

  getImageUrl(path, size = 'w500') {
    if (!path || path === 'N/A') return null;
    return path;
  }
}
