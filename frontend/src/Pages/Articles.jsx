import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuroraBackground from '../Components/AuroraBackground';
import { GlassFilter } from '../Components/ui/LiquidGlass';
import { useTheme } from '../contexts/ThemeContext';
import { API_URL } from '../url/base';

const gradientHeadingDark = {
  background: 'linear-gradient(to bottom, #fecdd3, #bae6fd, #f1f5f9)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};
const gradientHeadingLight = {
  background: 'linear-gradient(135deg, #312e81, #4f46e5)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function ArticleCard({ article }) {
  const { darkMode } = useTheme();
  const [imgErr, setImgErr] = useState(false);

  if (!article) return null;

  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown date';

  return (
    <div
      onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
      className="group flex flex-col rounded-2xl border border-white/8 overflow-hidden cursor-pointer transition-all duration-300 hover:border-indigo-500/30 hover:scale-[1.01]"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
    >
      {/* Thumbnail */}
      <div className="h-44 overflow-hidden flex-shrink-0 relative" style={{ background: 'rgba(99,102,241,0.08)' }}>
        {!imgErr && article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="text-3xl opacity-40">📰</div>
            <span className="text-white/20 font-inter text-xs uppercase tracking-widest">Article</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="font-cormorant font-light text-xl text-white/85 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h3>
        <p className="font-inter text-xs text-white/35 leading-relaxed line-clamp-3 flex-1">
          {article.description || 'No description available.'}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-white/6 mt-auto">
          <span className="font-inter text-xs text-indigo-400/80 truncate max-w-[60%]">
            {article.source?.name || 'Unknown Source'}
          </span>
          <span className="font-inter text-xs text-white/25">{published}</span>
        </div>
      </div>
    </div>
  );
}

export default function Articles() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const gradientHeading = darkMode ? gradientHeadingDark : gradientHeadingLight;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [stale, setStale] = useState(false);

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_URL}/api/articles${forceRefresh ? '?refresh=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load articles');
      setArticles(data.data || []);
      setStale(!!data.stale);
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden pt-20">
      <GlassFilter />
      <AuroraBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
          <div>
            <p className="text-indigo-400 font-inter text-xs uppercase tracking-[0.2em] mb-2">Resources</p>
            <h1
              className="font-cormorant font-light leading-tight"
              style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', ...gradientHeading }}
            >
              Speech Disorder Articles
            </h1>
            <p className="text-white/25 font-inter text-sm mt-1">
              Curated news &amp; research for families and therapists.
            </p>
            {lastFetch && (
              <p className="text-white/20 font-inter text-xs mt-1">
                {stale ? 'Showing cached results · ' : ''}
                Updated {lastFetch.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border border-white/8 text-white/40 font-inter text-sm hover:bg-white/5 hover:text-white/60 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => fetchArticles(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-300 font-inter text-sm hover:bg-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/8 px-5 py-3 mb-6 font-inter text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-indigo-400 animate-spin" />
            <p className="text-white/25 font-inter text-sm">Fetching articles…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-24">
            <div className="text-4xl mb-4 opacity-30">📰</div>
            <p className="text-white/30 font-inter text-sm">No articles found. Try refreshing.</p>
          </div>
        )}

        {/* Articles grid */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <ArticleCard key={i} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
