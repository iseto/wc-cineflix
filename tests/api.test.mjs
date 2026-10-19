import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/movies.mjs';

async function request(url, method = 'GET') {
  const headers = {};
  let body;
  const response = {
    statusCode: 200,
    setHeader(name, value) {
      headers[name] = value;
    },
    end(value) {
      body = JSON.parse(value);
    },
  };
  await handler({ url, method }, response);
  return { status: response.statusCode, headers, body };
}
test('movie API validates input, protects credentials, normalizes results and handles upstream errors', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { TMDB_AUTH: process.env.TMDB_AUTH, TMDB_READ_ACCESS_TOKEN: process.env.TMDB_READ_ACCESS_TOKEN, TMDB_API_KEY: process.env.TMDB_API_KEY };
  try {
    for (const key of Object.keys(originalEnv)) delete process.env[key];
    assert.equal((await request('/api/movies?q=Arrival')).status, 503);
    assert.equal((await request('/api/movies?q=Arrival', 'POST')).status, 405);
    for (const url of ['/api/movies', '/api/movies?q=x&page=0', '/api/movies?q=x&page=1.5', '/api/movies?id=bad', '/api/movies?q=' + 'x'.repeat(201)])
      assert.equal((await request(url)).status, 400);
    process.env.TMDB_AUTH = 'Bearer server-only-test-token';
    globalThis.fetch = async (url, options) => {
      assert.equal(url.origin, 'https://api.themoviedb.org');
      assert.equal(url.searchParams.get('query'), 'Arrival & aliens');
      assert.equal(url.searchParams.get('include_adult'), 'false');
      assert.equal(options.headers.Authorization, 'Bearer server-only-test-token');
      return Response.json({
        results: [
          { id: 329865, title: 'Arrival', release_date: '2016-11-10', genre_ids: [18, 878], vote_average: 7.6, poster_path: null, overview: 'A linguist makes first contact.' },
          { id: 4, adult: true, title: 'Excluded' },
        ],
        total_pages: 2,
        total_results: 21,
      });
    };
    const result = await request('/api/movies?q=Arrival%20%26%20aliens');
    assert.equal(result.status, 200);
    assert.equal(result.body.movies.length, 1);
    assert.equal(result.body.movies[0].id, -329865);
    assert.deepEqual(result.body.movies[0].genres, ['Drama', 'Sci-fi']);
    assert.equal(result.body.movies[0].poster, '');
    assert.equal(result.body.totalPages, 2);
    assert.equal(JSON.stringify(result).includes('server-only-test-token'), false);
    globalThis.fetch = async url => {
      assert.equal(url.pathname, '/3/movie/329865');
      return Response.json({ id: 329865, title: 'Arrival', runtime: 116, genres: [{ id: 878 }], credits: { crew: [{ job: 'Director', name: 'Denis Villeneuve' }] } });
    };
    const details = await request('/api/movies?id=329865');
    assert.equal(details.body.movie.duration, '1h 56m');
    assert.equal(details.body.movie.director, 'Denis Villeneuve');
    globalThis.fetch = async () => new Response('', { status: 401 });
    assert.equal((await request('/api/movies?q=Arrival')).status, 502);
    globalThis.fetch = async () => new Response('', { status: 429 });
    assert.equal((await request('/api/movies?q=Arrival')).status, 429);
    globalThis.fetch = async () => {
      throw new Error('Do not expose internal details');
    };
    const failure = await request('/api/movies?q=Arrival');
    assert.equal(failure.status, 502);
    assert.equal(JSON.stringify(failure).includes('internal details'), false);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
