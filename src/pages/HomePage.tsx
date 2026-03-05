import { useTrending } from '../hooks/useTrending';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import { HeroSkeleton, RowSkeleton, ErrorState } from '../components/Skeletons';
import type { Movie } from '../types';

export default function HomePage() {
  const { data, isLoading, isError } = useTrending(1);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#141414]">
        <HeroSkeleton />
        <div className="pt-4">
          <RowSkeleton count={6} />
          <RowSkeleton count={6} />
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-[#141414] pt-20">
        <ErrorState message="Impossible de charger les contenus. Vérifiez que le backend est lancé." />
      </main>
    );
  }

  const movies = data.results;
  const hero = movies[0];

  // Segmenter les films par type pour des rangées différentes
  const allMovies = movies.filter((m: Movie) => m.media_type === 'movie' || !m.media_type);
  const allSeries = movies.filter((m: Movie) => m.media_type === 'tv');
  const topRated = [...movies].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));

  return (
    <main className="min-h-screen bg-[#141414]">
      {/* Hero */}
      {hero && <HeroSection movie={hero} />}

      {/* Rangées de contenu */}
      <div className="pt-6 pb-20">
        <MovieRow title="🔥 Tendances de la semaine" movies={movies} />
        {allMovies.length > 0 && <MovieRow title="🎬 Films populaires" movies={allMovies} />}
        {allSeries.length > 0 && <MovieRow title="📺 Séries tendance" movies={allSeries} />}
        {topRated.length > 0 && <MovieRow title="⭐ Les mieux notés" movies={topRated} />}
      </div>
    </main>
  );
}
