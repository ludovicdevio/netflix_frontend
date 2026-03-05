import { useQuery } from '@tanstack/react-query';
import { searchContent } from '../api/tmdb';

export const useSearch = (query: string, page = 1) =>
  useQuery({
    queryKey: ['search', query, page],
    queryFn: () => searchContent(query, page),
    enabled: query.trim().length > 1,
    staleTime: 2 * 60 * 1000,
  });
