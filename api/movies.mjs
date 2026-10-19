const genres = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-fi',
  10770: 'TV movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};
const curatedIds = { 693134: 1, 666277: 2, 792307: 3, 120467: 4, 157336: 5, 976893: 6, 872585: 7, 545611: 8, 965150: 9, 414906: 10, 313369: 11, 569094: 12 };
function normalize(movie) {
  const genreIds = movie.genre_ids || movie.genres?.map(genre => genre.id) || [];
  return {
    id: curatedIds[movie.id] || -movie.id,
    tmdbId: movie.id,
    title: movie.title,
    year: Number(movie.release_date?.slice(0, 4)) || 0,
    genre: genres[genreIds[0]] || 'Other',
    genres: genreIds.map(id => genres[id]).filter(Boolean),
    rating: Number(movie.vote_average) || 0,
    duration: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '',
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    overview: movie.overview || 'No synopsis available yet.',
    director:
      movie.credits?.crew
        ?.filter(person => person.job === 'Director')
        .map(person => person.name)
        .join(', ') || '',
  };
}
export default async function handler(request, response) {
  const send = (status, body) => {
    response.statusCode = status;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(body));
  };
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return send(405, { error: 'Method not allowed.' });
  }
  const params = new URL(request.url, 'http://localhost').searchParams;
  const query = (params.get('q') || '').trim();
  const id = params.get('id');
  const page = Number(params.get('page') || 1);
  if (id ? !/^[1-9]\d{0,8}$/.test(id) : !query || query.length > 200 || !Number.isInteger(page) || page < 1 || page > 500)
    return send(400, { error: 'Enter a movie title of up to 200 characters.' });
  const token = (process.env.TMDB_AUTH || process.env.TMDB_READ_ACCESS_TOKEN || '').trim();
  const key = (process.env.TMDB_API_KEY || '').trim();
  if (!token && !key) return send(503, { error: 'Movie search is not configured yet. You can still browse and search the curated collection.' });
  const url = new URL(id ? `movie/${id}` : 'search/movie', 'https://api.themoviedb.org/3/');
  url.searchParams.set('language', 'en-US');
  if (id) url.searchParams.set('append_to_response', 'credits');
  else {
    url.searchParams.set('query', query);
    url.searchParams.set('page', String(page));
    url.searchParams.set('include_adult', 'false');
  }
  if (!token) url.searchParams.set('api_key', key);
  try {
    const upstream = await fetch(url, { headers: token ? { Authorization: `Bearer ${token.replace(/^Bearer\s+/i, '')}` } : {}, signal: AbortSignal.timeout(8000) });
    if (!upstream.ok)
      return send(upstream.status === 429 ? 429 : 502, {
        error: upstream.status === 429 ? 'Movie search is busy. Please try again shortly.' : 'Movie search is temporarily unavailable. Please try again.',
      });
    const data = await upstream.json();
    if (id && (!Number.isInteger(data.id) || !data.title)) throw new Error('Invalid movie');
    if (!id && !Array.isArray(data.results)) throw new Error('Invalid search response');
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return send(
      200,
      id
        ? { movie: normalize(data) }
        : {
            movies: data.results.filter(movie => !movie.adult && Number.isInteger(movie.id) && movie.title).map(normalize),
            page,
            totalPages: Math.min(data.total_pages || 0, 500),
            totalResults: data.total_results || 0,
          },
    );
  } catch {
    return send(502, { error: 'Movie search could not be reached. Please try again.' });
  }
}
