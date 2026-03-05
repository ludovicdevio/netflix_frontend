import { useEffect, useRef } from 'react';
import { X, AlertCircle, Loader2, Film } from 'lucide-react';
import { useMovieVideos } from '../hooks/useMovieVideos';
import VideoPlayer from './VideoPlayer';

interface TrailerModalProps {
  movieId: number;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ movieId, title, onClose }: TrailerModalProps) {
  const { data, isLoading, isError } = useMovieVideos(movieId);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fermer avec Échap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Trailer YouTube (priorité: "Trailer" > premier résultat YouTube)
  const youtubeVideo = data?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) ?? data?.results?.find((v) => v.site === 'YouTube');

  // Vidéo locale (stream du backend)
  const localStreamUrl = `/stream/${movieId}.mp4`;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-gray-900 rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <h3 className="text-white font-bold text-lg truncate max-w-md">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu vidéo */}
        <div className="p-4">
          {isLoading ? (
            <div className="aspect-video flex items-center justify-center bg-black rounded-lg">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            </div>
          ) : isError ? (
            <div className="aspect-video flex flex-col items-center justify-center bg-black rounded-lg gap-3">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-gray-400">Impossible de charger les vidéos</p>
            </div>
          ) : youtubeVideo ? (
            // Trailer YouTube
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideo.key}?autoplay=1&rel=0&modestbranding=1`}
                title={youtubeVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            // Lecteur vidéo local (stream backend)
            <VideoPlayer src={localStreamUrl} title={title} />
          )}

          {/* Liste des vidéos disponibles */}
          {data && data.results.length > 1 && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Autres vidéos disponibles :</p>
              <div className="flex flex-wrap gap-2">
                {data.results.slice(0, 5).map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-full transition-colors"
                  >
                    {video.type}: {video.name.slice(0, 30)}{video.name.length > 30 ? '…' : ''}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !isError && !youtubeVideo && (
            <div className="mt-3 p-3 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm">
                💡 Aucun trailer disponible. Lecture du fichier local :{' '}
                <code className="text-red-400">/stream/{movieId}.mp4</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
