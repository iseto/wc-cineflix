import { Component, h } from '@stencil/core';

@Component({
  tag: 'wc-movie-finder',
  styleUrl: 'movie-finder.css',
  shadow: true,
})
export class MovieFinder {
  movieNameInput: HTMLInputElement;

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
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }

  render() {
    return [
      <form onSubmit={this.onFindMovies.bind(this)}>
        <div class="movie-finder">
          <input type="text" name="movie-finder-input" id="movie-finder-input" class="movie-finder-input" ref={el => (this.movieNameInput = el)} />
          <button type="submit">Find!</button>
        </div>
      </form>,
    ];
  }
}
