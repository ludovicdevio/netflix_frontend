import axios from 'axios';
import type { TmdbResponse, VideoResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * GET /api/trending?page=N
 * Retourne les films/séries tendance de la semaine
 */
export const fetchTrending = async (page = 1): Promise<TmdbResponse> => {
  const { data } = await api.get<TmdbResponse>('/trending', { params: { page } });
  return data;
};

/**
 * GET /api/search?query=Q&page=N
 * Recherche multi-contenus (films + séries)
 */
export const searchContent = async (query: string, page = 1): Promise<TmdbResponse> => {
  const { data } = await api.get<TmdbResponse>('/search', {
    params: { query, page },
  });
  return data;
};

/**
 * GET /api/movie/{id}/videos
 * Retourne les vidéos (trailers YouTube) d'un film
 */
export const fetchMovieVideos = async (movieId: number): Promise<VideoResponse> => {
  const { data } = await api.get<VideoResponse>(`/movie/${movieId}/videos`);
  return data;
};
