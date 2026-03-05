import { useState } from 'react';
import { Play, Star, Tv } from 'lucide-react';
import type { Movie } from '../types';
import { getTitle, getPosterUrl } from '../types';
import TrailerModal from './TrailerModal';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [imgError, setImgError] = useState(false);
  const title = getTitle(movie);
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <>
      <div
        className="relative group cursor-pointer rounded-md overflow-hidden bg-gray-900 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/60"
        onClick={() => setShowTrailer(true)}
      >
        {/* Poster image */}
        <div className="aspect-[2/3] w-full overflow-hidden">
          {!imgError && movie.poster_path ? (
            <img
              src={posterUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-500 p-4">
              <Tv className="w-12 h-12 mb-2 opacity-40" />
              <span className="text-xs text-center opacity-60">{title}</span>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
          <div className="flex items-center gap-1 mb-1">
            <button className="bg-white text-black rounded-full p-1.5 hover:bg-gray-200 transition-colors">
              <Play className="w-3 h-3 fill-black" />
            </button>
          </div>
          <p className="text-white font-semibold text-xs truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            {movie.vote_average && (
              <span className="flex items-center gap-0.5 text-yellow-400 text-xs">
                <Star className="w-3 h-3 fill-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
            {movie.media_type && (
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                {movie.media_type === 'tv' ? 'Série' : 'Film'}
              </span>
            )}
          </div>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal movieId={movie.id} title={title} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
}
