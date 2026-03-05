import { useQuery } from '@tanstack/react-query';
import { fetchMovieVideos } from '../api/tmdb';

export const useMovieVideos = (movieId: number | null) =>
  useQuery({
    queryKey: ['videos', movieId],
    queryFn: () => fetchMovieVideos(movieId!),
    enabled: movieId !== null,
    staleTime: 10 * 60 * 1000,
  });
