import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'wc-movie-finder',
  styleUrl: 'movie-finder.css',
  shadow: true,
})
export class MovieFinder {
  movieNameInput: HTMLInputElement;

  @State() fetchedMovies: {
    title: string;
    image_url: string;
    release: string;
  };
  @State() movieUserInput: string;
  @State() movieInputValid = false;

  onUserInput(event: Event) {
    this.movieUserInput = (event.target as HTMLInputElement).value; // get value of user input
    this.movieInputValid = this.movieUserInput.trim() !== '' ? true : false;
  }

  onFindMovies(event) {
    event.preventDefault();
    const movieName = this.movieNameInput.value;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `${process.env.TMDB_AUTH}`,
      },
    };

    fetch(`${process.env.TMDB_BASE_URL}search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`, options)
      .then(response => response.json())
      .then(parsedRes => {
        this.fetchedMovies = parsedRes['results'].map(match => {
          return {
            title: match['original_title'],
            image_url: match['poster_path'],
            release: match['release_date'],
          };
        });
        console.log(this.fetchedMovies);
      })
      .catch(err => console.error(err));
  }

  render() {
    return [
      <form onSubmit={this.onFindMovies.bind(this)}>
        <div class="movie-finder">
          <input
            type="text"
            name="movie-finder-input"
            id="movie-finder-input"
            class="movie-finder-input"
            ref={el => (this.movieNameInput = el)}
            value={this.movieUserInput}
            onInput={this.onUserInput.bind(this)}
          />
          <button type="submit" disabled={!this.movieInputValid}>
            Find!
          </button>
        </div>
      </form>,
    ];
  }
}
