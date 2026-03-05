import { useQuery } from '@tanstack/react-query';
import { fetchTrending } from '../api/tmdb';

export const useTrending = (page = 1) =>
  useQuery({
    queryKey: ['trending', page],
    queryFn: () => fetchTrending(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
