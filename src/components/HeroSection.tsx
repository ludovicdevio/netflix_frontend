import { useState } from 'react';
import { Play, Info, Star } from 'lucide-react';
import type { Movie } from '../types';
import { getTitle, getBackdropUrl } from '../types';
import TrailerModal from './TrailerModal';

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const title = getTitle(movie);

  return (
    <>
      <section
        className="relative w-full h-[90vh] flex items-end pb-24 px-8 md:px-16 overflow-hidden"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'linear-gradient(to right, #141414, #333)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {movie.media_type === 'tv' ? 'SÉRIE' : 'FILM'}
            </span>
            {movie.vote_average && (
              <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                <Star className="w-4 h-4 fill-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-2xl">
            {title}
          </h1>

          {movie.overview && (
            <p className="text-gray-200 text-sm md:text-base line-clamp-3 mb-6 max-w-lg">
              {movie.overview}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm shadow-lg"
            >
              <Play className="w-5 h-5 fill-black" />
              Lecture
            </button>
            <button
              onClick={() => setShowTrailer(true)}
              className="flex items-center gap-2 bg-gray-600/70 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              Plus d'infos
            </button>
          </div>
        </div>
      </section>

      {showTrailer && (
        <TrailerModal movieId={movie.id} title={title} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
