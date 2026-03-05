// Types correspondant aux modèles Rust du backend

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  media_type?: string;
}

export interface TmdbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

// Helper: retourne le titre d'un film ou d'une série
export const getTitle = (item: Movie): string =>
  item.title ?? item.name ?? 'Titre inconnu';

// Helper: construit l'URL d'une image TMDB
export const getPosterUrl = (path?: string, size = 'w500'): string =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/no-image.png';

export const getBackdropUrl = (path?: string): string =>
  path ? `https://image.tmdb.org/t/p/original${path}` : '';
