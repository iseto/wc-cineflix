export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  duration: string;
  poster: string;
  overview: string;
  director: string;
}
const poster = (path: string) => `https://image.tmdb.org/t/p/w500${path}`;
/** A curated, credential-free demo catalog. No user data is sent to a server. */
export const movies: Movie[] = [
  {
    id: 1,
    title: 'Dune: Part Two',
    year: 2024,
    genre: 'Sci-fi',
    rating: 8.5,
    duration: '2h 46m',
    director: 'Denis Villeneuve',
    poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. A choice between love and the fate of the universe awaits.',
  },
  {
    id: 2,
    title: 'Past Lives',
    year: 2023,
    genre: 'Romance',
    rating: 7.9,
    duration: '1h 46m',
    director: 'Celine Song',
    poster: poster('/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg'),
    overview:
      'Nora and Hae Sung, two deeply connected childhood friends, reunite in New York for one fateful week as they confront notions of destiny, love, and the choices that make a life.',
  },
  {
    id: 3,
    title: 'Poor Things',
    year: 2023,
    genre: 'Fantasy',
    rating: 7.8,
    duration: '2h 21m',
    director: 'Yorgos Lanthimos',
    poster: poster('/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg'),
    overview: 'Brought back to life by an unorthodox scientist, Bella Baxter embarks on a whirlwind adventure across continents, discovering the world on her own terms.',
  },
  {
    id: 4,
    title: 'The Grand Budapest Hotel',
    year: 2014,
    genre: 'Comedy',
    rating: 8.1,
    duration: '1h 40m',
    director: 'Wes Anderson',
    poster: poster('/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg'),
    overview: 'A legendary concierge and his trusted lobby boy become entangled in the theft of a priceless painting and a battle for an enormous family fortune.',
  },
  {
    id: 5,
    title: 'Interstellar',
    year: 2014,
    genre: 'Sci-fi',
    rating: 8.7,
    duration: '2h 49m',
    director: 'Christopher Nolan',
    poster: poster('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    overview: 'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars, while one father struggles with the cost of leaving home.',
  },
  {
    id: 6,
    title: 'Perfect Days',
    year: 2023,
    genre: 'Drama',
    rating: 7.9,
    duration: '2h 4m',
    director: 'Wim Wenders',
    poster: poster('/tvUHVSTJV9ITON3oyHaWp7oaAc8.jpg'),
    overview: 'In Tokyo, Hirayama finds beauty in everyday routines, music, books, and photographing trees. Unexpected encounters reveal more of his quiet inner world.',
  },
  {
    id: 7,
    title: 'Oppenheimer',
    year: 2023,
    genre: 'Drama',
    rating: 8.3,
    duration: '3h',
    director: 'Christopher Nolan',
    poster: poster('/ptpr0kGAckfQkJeJIt8st5dglvd.jpg'),
    overview: 'The story of physicist J. Robert Oppenheimer, his role in the development of the atomic bomb, and the profound consequences of scientific discovery.',
  },
  {
    id: 8,
    title: 'Everything Everywhere All at Once',
    year: 2022,
    genre: 'Sci-fi',
    rating: 7.8,
    duration: '2h 20m',
    director: 'Daniel Kwan & Daniel Scheinert',
    poster: poster('/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg'),
    overview: 'An exhausted laundromat owner is swept into an adventure through parallel universes, where the smallest acts of kindness can change everything.',
  },
  {
    id: 9,
    title: 'Aftersun',
    year: 2022,
    genre: 'Drama',
    rating: 7.7,
    duration: '1h 42m',
    director: 'Charlotte Wells',
    poster: poster('/evKz85EKouVbIr51zy5fOtpNRPg.jpg'),
    overview:
      'Sophie reflects on a holiday she took with her father twenty years earlier. Memories and imagined moments fill the gaps between what she knew and what she now understands.',
  },
  {
    id: 10,
    title: 'The Batman',
    year: 2022,
    genre: 'Thriller',
    rating: 7.7,
    duration: '2h 56m',
    director: 'Matt Reeves',
    poster: poster('/74xTEgt7R36Fpooo50r9T25onhq.jpg'),
    overview:
      'A trail of cryptic clues sends Batman into Gotham’s underworld, where he must forge new relationships and bring justice to the corruption that has plagued the city.',
  },
  {
    id: 11,
    title: 'La La Land',
    year: 2016,
    genre: 'Romance',
    rating: 8.0,
    duration: '2h 8m',
    director: 'Damien Chazelle',
    poster: poster('/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg'),
    overview: 'An aspiring actress and a jazz musician fall in love in Los Angeles, balancing the joy of finding each other with the demands of their creative dreams.',
  },
  {
    id: 12,
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    genre: 'Animation',
    rating: 8.6,
    duration: '2h 20m',
    director: 'Joaquim Dos Santos, Kemp Powers & Justin K. Thompson',
    poster: poster('/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'),
    overview:
      'Miles Morales journeys across the multiverse and encounters a team of Spider-People. When they disagree on how to handle a threat, Miles must redefine what it means to be a hero.',
  },
];
