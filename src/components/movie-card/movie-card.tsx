import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { Movie } from '../../data/movies';

@Component({ tag: 'wc-movie-card', styleUrl: 'movie-card.css', shadow: true })
export class MovieCard {
  @Prop() movie: Movie;
  @Prop() saved = false;
  @Event() movieSelected: EventEmitter<number>;
  @Event() watchlistToggle: EventEmitter<number>;

  render() {
    const movie = this.movie;
    return (
      <article>
        <div class="artwork">
          <button class="poster" onClick={() => this.movieSelected.emit(movie.id)} aria-label={`View ${movie.title}`}>
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              onError={event => {
                (event.target as HTMLImageElement).style.visibility = 'hidden';
              }}
            />
            <span class="fallback">{movie.title}</span>
            <span class="view">Explore film ↗</span>
          </button>
          <span class="rating">
            <span>★</span> {movie.rating.toFixed(1)}
          </span>
          <button
            class={{ save: true, saved: this.saved }}
            aria-label={`${this.saved ? 'Remove' : 'Save'} ${movie.title}${this.saved ? ' from' : ' to'} watchlist`}
            aria-pressed={this.saved ? 'true' : 'false'}
            onClick={() => this.watchlistToggle.emit(movie.id)}
          >
            {this.saved ? '✓' : '+'}
          </button>
        </div>
        <button class="title" onClick={() => this.movieSelected.emit(movie.id)}>
          {movie.title}
        </button>
        <p>
          {movie.year || 'TBA'}
          <span>·</span>
          {movie.genre}
        </p>
      </article>
    );
  }
}
