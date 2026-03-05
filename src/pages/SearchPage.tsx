import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { RowSkeleton, ErrorState } from '../components/Skeletons';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useSearch(query, page);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#141414] pt-24 px-6 md:px-12 pb-20">
      {/* Titre + barre de recherche */}
      <div className="mb-10">
        <h1 className="text-white text-3xl font-bold mb-6 flex items-center gap-3">
          <Search className="w-7 h-7 text-red-500" />
          Rechercher
        </h1>
        <SearchBar autoFocus />
      </div>

      {/* Résultats */}
      {!query ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Tapez un titre pour commencer la recherche</p>
          <p className="text-gray-600 text-sm mt-2">Films, séries, documentaires...</p>
        </div>
      ) : isLoading ? (
        <RowSkeleton count={8} />
      ) : isError ? (
        <ErrorState message="Erreur lors de la recherche. Vérifiez votre connexion." />
      ) : data && data.results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Aucun résultat pour « {query} »</p>
          <p className="text-gray-600 text-sm mt-2">Essayez un autre mot-clé</p>
        </div>
      ) : data ? (
        <>
          {/* Info résultats */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              {isFetching ? (
                <span className="text-gray-500">Chargement...</span>
              ) : (
                <>
                  Résultats pour{' '}
                  <span className="text-white font-semibold">« {query} »</span>
                  {' '}— Page {data.page} / {data.total_pages}
                </>
              )}
            </p>
          </div>

          {/* Grille de résultats */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {data.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isFetching}
                className="flex items-center gap-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(data.total_pages - 4, page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isFetching}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === page
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= data.total_pages || isFetching}
                className="flex items-center gap-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : null}
    </main>
  );
}
