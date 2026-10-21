# Cineflix

A curated film discovery experience by Ignatius Seto. Built with Stencil, TypeScript, and native web components, with a responsive charcoal-and-sage interface.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm start
```

The development server serves the app and movie API at http://localhost:3333. Run `npm run build` for production assets in `www/`, and reusable components in `dist/` and `loader/`.

## Features

- Twelve curated films, plus live title search across TMDB with paginated results. Curated films and saved films also match director or year.
- Genre filters and sorting by rating, release year, or title.
- Persistent watchlist using localStorage, with an in-memory fallback when storage is unavailable.
- Film details in a native dialog, keyboard dismissal, visible focus states, and a `/` search shortcut.
- Responsive layouts, reduced-motion support, lazy-loaded posters, and image fallbacks.
- Interactive component inspector explaining the implementation.

## Component architecture

`<cineflix-app>` owns filters, the watchlist, and the details dialog. Each `<wc-movie-card>` uses Shadow DOM to encapsulate styles and emits typed, bubbling custom events (`movieSelected`, `watchlistToggle`). The app listens for these events and updates component properties through reactive state.

Edit the collection in `src/data/movies.ts`. The curated catalog is bundled demo data with fixed ratings; title search retrieves live TMDB results. Browsing the curated collection needs no credential. Live search uses the server-only `/api/movies` endpoint. Copy `.env.example` to `.env.local` and set your TMDB Read Access Token as `TMDB_AUTH` for local development. On Vercel, set `TMDB_AUTH` in the project environment settings and redeploy. The existing `Bearer` prefix is optional; `TMDB_READ_ACCESS_TOKEN` or `TMDB_API_KEY` are also supported. Never put a credential in `src/`. Posters and backdrop images load from TMDB; the font loads from Google Fonts with a system fallback. This independent demo is not endorsed or certified by TMDB.

The obsolete Bootstrap interface, credential-dependent requests, starter components and utilities, dotenv plugin, and old Jest toolchain have been removed.

## Validation

```sh
npm test
```

This creates a production build and runs real-browser integration tests for search, genre filtering, sorting, watchlist persistence, cross-component events, dialog behavior, keyboard access, and layout overflow at 320, 390, 768, and 1440 pixels.

API tests mock TMDB to verify validation, credential isolation, response mapping, and failures. Browser tests include films outside the curated collection and saved search results.

Tests use a locally installed Chrome on macOS/Linux, or `CHROME_PATH` if provided. If Chrome is unavailable, install Puppeteer's browser with `npx puppeteer browsers install chrome`.

Source: https://github.com/iseto/wc-cineflix

## Automated dependency maintenance

Weekly Dependabot updates and daily full dependency audits are configured.
See [automation schedules and notification behavior](docs/AUTOMATIONS.md).

## Portfolio listing

`portfolio.json` supplies the title, technology tags, and English/German/Indonesian descriptions for [the portfolio landing page](https://github.com/iseto/portfolio-landing). Update it when shipping user-facing features. The landing page checks this file and the repository homepage hourly, validates all three translations and live links, and publishes verified changes automatically. Set the GitHub repository website to the canonical deployed demo URL. Screenshots and case-study evidence are maintained separately.

## Appearance

Choose System, Light or Dark and an independent System, Standard or More contrast preference in the header. Choices are remembered locally; system forced colors remain supported. See [appearance behavior and verification](docs/APPEARANCE.md).

Project regression checks run on pull requests and main pushes, covering the production build and browser workflows, including appearance preferences.
