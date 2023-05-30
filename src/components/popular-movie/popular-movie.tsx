import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'wc-popular-movie',
  styleUrl: 'popular-movie.css',
  shadow: true,
})
export class PopularMovie {
  @State() popularMoviesResults: {
    original_title: string;
    popularity: number;
    overview: string;
    release: string;
  }[] = [];

  connectedCallback() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNTVmZjk2MjM1NDY3MTQ2NWNmY2MxNmFhNjBmZTU2ZSIsInN1YiI6IjY0NzVkYWVmMWJmMjY2MDQ0MmE3OGE3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oU13ebZk5Ra6YfNf-TWZ62-eEG8Au-QadFSXQ44-dKo',
      },
    };

    fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
      .then(response => response.json())
      .then(parsedRes => {
        console.log(parsedRes['results']);
        this.popularMoviesResults = parsedRes['results'].map(match => {
          return {
            original_title: match['original_title'],
            popularity: match['popularity'],
            overview: match['overview'],
            release: match['release_date'],
          };
        });
        console.log(this.popularMoviesResults);
      })
      .catch(err => console.error(err));
  }

  render() {
    return [
      <h3 class="popular-movie_header">Popular Movies</h3>,

      <ul>
        {this.popularMoviesResults.map(result => (
          <li>
            <strong>{result.original_title}</strong> - <strong>Released</strong> : {result.release} - <strong>Popularity</strong>: {result.popularity}
            <p>
              Synopsis:
              {result.overview}
            </p>
          </li>
        ))}
      </ul>,
    ];
  }
}
