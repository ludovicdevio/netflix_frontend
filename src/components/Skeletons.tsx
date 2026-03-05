import { Film } from 'lucide-react';

interface SkeletonProps {
  count?: number;
}

export function MovieCardSkeleton() {
  return (
    <div className="w-36 md:w-44 flex-shrink-0 animate-pulse">
      <div className="aspect-[2/3] bg-gray-800 rounded-md" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[90vh] bg-gray-900 animate-pulse flex items-end pb-24 px-16">
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-20" />
        <div className="h-12 bg-gray-700 rounded w-80" />
        <div className="h-4 bg-gray-700 rounded w-96" />
        <div className="h-4 bg-gray-700 rounded w-64" />
        <div className="flex gap-3 mt-4">
          <div className="h-12 bg-gray-700 rounded-lg w-32" />
          <div className="h-12 bg-gray-700 rounded-lg w-36" />
        </div>
      </div>
    </div>
  );
}

export function RowSkeleton({ count = 6 }: SkeletonProps) {
  return (
    <div className="mb-10">
      <div className="h-7 bg-gray-800 rounded w-48 mx-6 md:mx-12 mb-4 animate-pulse" />
      <div className="flex gap-3 px-6 md:px-12">
        {Array.from({ length: count }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-gray-500">
      <Film className="w-16 h-16 opacity-30" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
