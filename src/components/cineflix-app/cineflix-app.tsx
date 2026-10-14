import { Component, Element, h, Listen, State } from '@stencil/core';
import { Movie, movies } from '../../data/movies';

@Component({ tag: 'cineflix-app', styleUrl: 'cineflix-app.css', shadow: true })
export class CineflixApp {
  @Element() host: HTMLElement;
  @State() view = 'discover';
  @State() genre = 'All films';
  @State() query = '';
  @State() sort = 'curated';
  @State() saved: number[] = [];
  @State() selected: Movie;
  @State() inspector = false;
  @State() toast = '';
  private dialog: HTMLDialogElement;
  private toastTimer: ReturnType<typeof setTimeout>;

  componentWillLoad() {
    try {
      const stored = JSON.parse(localStorage.getItem('cineflix-watchlist') || '[]');
      if (Array.isArray(stored)) this.saved = stored.filter(id => movies.some(movie => movie.id === id));
    } catch {
      /* Private browsing can disable storage. */
    }
  }
  @Listen('movieSelected')
  onMovieSelected(event: CustomEvent<number>) {
    const movie = movies.find(movie => movie.id === event.detail);
    if (movie) this.openMovie(movie);
  }
  @Listen('watchlistToggle')
  onWatchlistToggle(event: CustomEvent<number>) {
    this.toggleSave(event.detail);
  }
  @Listen('keydown', { target: 'document' })
  onShortcut(event: KeyboardEvent) {
    const typing = event.composedPath().some(target => target instanceof HTMLElement && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable));
    if (event.key === '/' && !typing && !this.dialog.open) {
      event.preventDefault();
      this.host.shadowRoot.querySelector<HTMLInputElement>('input[type="search"]').focus();
    }
    if (event.key === 'Escape') this.inspector = false;
  }
  disconnectedCallback() {
    clearTimeout(this.toastTimer);
  }
  private toggleSave(id: number) {
    const removing = this.saved.includes(id);
    this.saved = removing ? this.saved.filter(value => value !== id) : [...this.saved, id];
    try {
      localStorage.setItem('cineflix-watchlist', JSON.stringify(this.saved));
    } catch {
      /* Watchlist still works for this visit. */
    }
    this.toast = removing ? 'Removed from your watchlist' : 'Added to your watchlist';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 2400);
  }
  private openMovie(movie: Movie) {
    this.selected = movie;
    this.dialog.showModal();
  }
  private browse(view: string) {
    this.view = view;
    this.genre = 'All films';
    this.query = '';
  }
  private resetFilters() {
    this.query = '';
    this.genre = 'All films';
    this.sort = 'curated';
  }
  render() {
    let visible = movies.filter(
      movie =>
        (this.view !== 'watchlist' || this.saved.includes(movie.id)) &&
        (this.genre === 'All films' || movie.genre === this.genre) &&
        `${movie.title} ${movie.director} ${movie.year}`.toLowerCase().includes(this.query.toLowerCase().trim()),
    );
    if (this.sort === 'rating') visible = [...visible].sort((a, b) => b.rating - a.rating);
    if (this.sort === 'newest') visible = [...visible].sort((a, b) => b.year - a.year);
    if (this.sort === 'title') visible = [...visible].sort((a, b) => a.title.localeCompare(b.title));
    return (
      <div class="app">
        <a href="#collection" class="skip">
          Skip to films
        </a>
        <header>
          <a class="brand" href="#" onClick={() => this.browse('discover')} aria-label="Cineflix home">
            <span class="brand-symbol">
              c<span>✳</span>
            </span>
            cineflix<span class="brand-dot">.</span>
          </a>
          <nav aria-label="Main navigation">
            <button class={{ active: this.view === 'discover' }} onClick={() => this.browse('discover')}>
              Discover
            </button>
            <button class={{ active: this.view === 'watchlist' }} onClick={() => this.browse('watchlist')}>
              Watchlist <span class="count">{this.saved.length}</span>
            </button>
          </nav>
          <button class="built" onClick={() => (this.inspector = !this.inspector)}>
            <span class="code-icon">〈/〉</span>
            <span>Built with web components</span>
            <span class="status-dot"></span>
          </button>
        </header>
        <main>
          <section class="intro">
            <div class="eyebrow">
              <span class="status-dot"></span> A LITTLE LESS SCROLLING. A LITTLE MORE CINEMA.
            </div>
            <h1>
              Good films. <em>Great evenings.</em>
            </h1>
            <p>A considered collection for the endlessly curious. Find your next favorite.</p>
          </section>
          {this.view === 'discover' && (
            <section class="hero" aria-label="Featured film: Dune Part Two">
              <img
                class="hero-image"
                src="https://image.tmdb.org/t/p/original/o869RihWTdTyBcEZBjz0izvEsVf.jpg"
                alt="An expansive desert landscape from Dune: Part Two"
                fetchpriority="high"
              />
              <div class="hero-shade"></div>
              <span class="hero-edition">
                THE SPOTLIGHT <span>01 / SELECTED</span>
              </span>
              <div class="hero-content">
                <span class="hero-kicker">EXTRAORDINARY WORLDS. UNFORGETTABLE STORIES.</span>
                <h2>
                  DUNE<span>PART TWO</span>
                </h2>
                <div class="hero-meta">
                  <span class="star">★ 8.5</span>
                  <span>2024</span>
                  <span>2h 46m</span>
                  <span class="genre-tag">Sci-fi / Adventure</span>
                </div>
                <p>
                  Some destinies are written in sand.
                  <br />
                  An epic journey to the very edge of the possible.
                </p>
                <div class="hero-actions">
                  <button class="primary" onClick={() => this.openMovie(movies[0])}>
                    Explore film <span>↗</span>
                  </button>
                  <button class="secondary" onClick={() => this.toggleSave(1)}>
                    {this.saved.includes(1) ? '✓ In watchlist' : '+ Watchlist'}
                  </button>
                </div>
              </div>
              <div class="hero-caption">
                <span>DENIS VILLENEUVE</span>A world worth getting lost in.
              </div>
            </section>
          )}
          <section class="collection" id="collection" tabIndex={-1}>
            <div class="section-heading">
              <div>
                <span class="eyebrow">{this.view === 'watchlist' ? 'SAVED FOR A GOOD EVENING' : 'LESS NOISE. MORE GOOD STORIES.'}</span>
                <h2>
                  {this.view === 'watchlist' ? 'Your watchlist' : 'Find your next favorite'}
                  <span class="film-count">{visible.length} films</span>
                </h2>
              </div>
              <label class="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  type="search"
                  aria-label="Search films or directors"
                  placeholder="Search films, directors…"
                  value={this.query}
                  onInput={event => (this.query = (event.target as HTMLInputElement).value)}
                />
                <kbd>/</kbd>
              </label>
            </div>
            <div class="filter-row">
              <div class="filters" role="group" aria-label="Filter by genre">
                {['All films', 'Sci-fi', 'Drama', 'Thriller', 'Comedy', 'Romance', 'Fantasy', 'Animation'].map(genre => (
                  <button aria-pressed={this.genre === genre ? 'true' : 'false'} class={{ chosen: this.genre === genre }} onClick={() => (this.genre = genre)}>
                    {genre}
                  </button>
                ))}
              </div>
              <label class="sort">
                <span>Sort by:</span>
                <select aria-label="Sort films" onChange={event => (this.sort = (event.target as HTMLSelectElement).value)}>
                  <option value="curated" selected={this.sort === 'curated'}>
                    Handpicked
                  </option>
                  <option value="rating" selected={this.sort === 'rating'}>
                    Top rated
                  </option>
                  <option value="newest" selected={this.sort === 'newest'}>
                    Newest first
                  </option>
                  <option value="title" selected={this.sort === 'title'}>
                    Title A–Z
                  </option>
                </select>
              </label>
            </div>
            <div class="film-grid">
              {visible.map(movie => (
                <wc-movie-card key={movie.id} movie={movie} saved={this.saved.includes(movie.id)} />
              ))}
            </div>
            {visible.length === 0 && (
              <div class="empty">
                <span>✳</span>
                <h3>{this.view === 'watchlist' && !this.saved.length ? 'Your next great evening starts here.' : 'No films in this frame.'}</h3>
                <p>{this.view === 'watchlist' && !this.saved.length ? 'Tap the + on any film to save it for later.' : 'Try a different title, director, or genre.'}</p>
                <button
                  class="primary"
                  onClick={() => {
                    this.resetFilters();
                    if (!this.saved.length) this.view = 'discover';
                  }}
                >
                  Explore films ↗
                </button>
              </div>
            )}
            <div class="collection-end">
              <span></span>
              <p>A small collection. An infinite love for cinema.</p>
              <span></span>
            </div>
          </section>
          <section class="craft">
            <div class="craft-mark">〈/〉</div>
            <div>
              <span class="eyebrow">SMALL COMPONENTS. BIG POSSIBILITIES.</span>
              <h2>Made for the love of the craft.</h2>
              <p>
                A film discovery experience by Ignatius Seto. Built with Stencil, TypeScript,
                <br class="desktop-break" /> and native web components. Thoughtful by design, reusable by nature.
              </p>
              <div class="tech-tags">
                <span>Shadow DOM</span>
                <span>Custom events</span>
                <span>Local-first storage</span>
                <span>Responsive by default</span>
              </div>
            </div>
            <button class="craft-link" onClick={() => (this.inspector = true)}>
              Under the hood <span>↗</span>
            </button>
          </section>
        </main>
        <footer>
          <a class="brand footer-brand" href="#">
            cineflix<span class="brand-dot">.</span>
          </a>
          <span>Curated with intention. Built with curiosity.</span>
          <a href="https://github.com/iseto/wc-cineflix" target="_blank" rel="noopener noreferrer">
            View source ↗
          </a>
          <span class="credit">Film imagery via TMDB · Independent demo</span>
        </footer>
        <dialog
          ref={element => (this.dialog = element)}
          onClick={event => {
            if (event.target === this.dialog) this.dialog.close();
          }}
          aria-label={this.selected ? this.selected.title : 'Film details'}
        >
          <button class="close" aria-label="Close film details" onClick={() => this.dialog.close()}>
            ×
          </button>
          {this.selected && (
            <div class="detail">
              <img src={this.selected.poster} alt={`${this.selected.title} poster`} />
              <div>
                <span class="eyebrow">THE CINEFLIX COLLECTION</span>
                <h2>{this.selected.title}</h2>
                <p class="detail-meta">
                  ★ {this.selected.rating} · {this.selected.year} · {this.selected.duration} · {this.selected.genre}
                </p>
                <p>{this.selected.overview}</p>
                <p class="director">
                  Directed by <strong>{this.selected.director}</strong>
                </p>
                <button class="primary" onClick={() => this.toggleSave(this.selected.id)}>
                  {this.saved.includes(this.selected.id) ? '✓ Saved to watchlist' : '+ Add to watchlist'}
                </button>
              </div>
            </div>
          )}
        </dialog>
        {this.inspector && (
          <aside class="inspector" aria-label="Web component inspector">
            <div class="inspector-heading">
              <span class="eyebrow">COMPONENT SPOTLIGHT</span>
              <button aria-label="Close component inspector" onClick={() => (this.inspector = false)}>
                ×
              </button>
            </div>
            <h2>Native at the core.</h2>
            <p>Every film card is an encapsulated custom element. Its styles stay inside; its events travel out.</p>
            <pre>
              <code>{'<wc-movie-card\n  movie={film}\n  saved={true}\n/>'}</code>
            </pre>
            <dl>
              <div>
                <dt>Rendering</dt>
                <dd>Stencil + TypeScript</dd>
              </div>
              <div>
                <dt>Encapsulation</dt>
                <dd>Shadow DOM</dd>
              </div>
              <div>
                <dt>Communication</dt>
                <dd>Custom DOM events</dd>
              </div>
              <div>
                <dt>Watchlist</dt>
                <dd>localStorage · {this.saved.length} saved</dd>
              </div>
            </dl>
            <p class="inspector-note">Try saving a film. Independent components update through shared application state, with no page reload.</p>
            <a href="https://github.com/iseto/wc-cineflix" target="_blank" rel="noopener noreferrer">
              Explore the source ↗
            </a>
          </aside>
        )}
        <div class={{ toast: true, visible: !!this.toast }} role="status" aria-live="polite">
          ✓ {this.toast}
        </div>
      </div>
    );
  }
}
