import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Home } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <Film className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />
        <span className="text-red-600 font-extrabold text-2xl tracking-tight">NETFIX</span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
        <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
          <Home className="w-4 h-4" />
          Accueil
        </Link>
        <Link to="/search" className="flex items-center gap-1 hover:text-white transition-colors">
          <Search className="w-4 h-4" />
          Rechercher
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titres, films, séries..."
            className="bg-black/70 border border-gray-600 text-white placeholder-gray-500 rounded-full px-4 py-2 pr-10 text-sm w-48 focus:w-64 focus:border-gray-400 transition-all duration-300 outline-none"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>
    </nav>
  );
}
