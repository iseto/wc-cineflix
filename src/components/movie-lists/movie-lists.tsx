import { Component, Prop, State, h } from '@stencil/core';
@Component({
  tag: 'wc-movie-lists',
  styleUrl: 'movie-lists.css',
  shadow: true,
})
export class MovieLists {
  @State() movieListsResults: {
    original_title: string;
    overview: string;
    release: string;
    image_url: string;
    rating: number;
  }[] = [];

  @Prop({ reflect: true }) movieListType: string;

  connectedCallback() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `${process.env.TMDB_AUTH}`,
      },
    };

    console.log(this.movieListType);

    fetch(`${process.env.TMDB_BASE_URL}movie/${this.movieListType}?language=en-US&page=1`, options)
      .then(response => response.json())
      .then(parsedRes => {
        console.log(parsedRes['results']);
        this.movieListsResults = parsedRes['results'].slice(0, 5).map(match => {
          return {
            original_title: match['original_title'],
            overview: match['overview'],
            release: match['release_date'],
            image_url: match['poster_path'],
            rating: match['vote_average'],
          };
        });
        console.log(this.movieListsResults);
      })
      .catch(err => console.error(err));
  }

  toTitleCase(text) {
    return text.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  render() {
    const IMAGE_BASE_URL = `https://image.tmdb.org/t/p/w220_and_h330_face`;
    const MOVIE_LIST_TITLE = this.toTitleCase(this.movieListType.replace('_', ' '));

    return [
      <h3 class="movie-lists_header">{MOVIE_LIST_TITLE + ' Movies'}</h3>,

      <ul>
        {this.movieListsResults.map(result => (
          <li class="movie-lists-wrapper">
            <a class="movie-lists_image-wrapper">
              <img src={IMAGE_BASE_URL + result.image_url} class="movie-lists-image"></img>
            </a>
            <div class="movie-lists-info">
              <strong>{result.original_title}</strong>
              <p>
                <strong>Rating</strong> : {result.rating}
              </p>
              <p>
                <strong>Released</strong> : {result.release}
              </p>
              <p>{result.overview}</p>
            </div>
          </li>
        ))}
      </ul>,
    ];
  }
}
