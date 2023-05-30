import { Component, h } from '@stencil/core';

@Component({
  tag: 'wc-movie-finder',
  styleUrl: 'movie-finder.css',
  shadow: true,
})
export class MovieFinder {
  render() {
    return [
      <form>
        <div class="movie-finder">
          <input type="text" name="movie-finder-input" id="movie-finder-input" />
          <button type="submit">Find!</button>
        </div>
      </form>,
    ];
  }
}
