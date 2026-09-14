import React, { useState } from "react";

export default function Articlescomponent({ article }) {
  const [imageError, setImageError] = useState(false);
  
  // Return null if article is undefined
  if (!article) return null;
  
  // Support both News API (publishedAt) and MediaStack (published_at)
  const publishedDate = (article.publishedAt || article.published_at) 
    ? new Date(article.publishedAt || article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Unknown Date';

  const handleArticleClick = () => {
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white dark:bg-gray-800"
      onClick={handleArticleClick}
    >
      <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
        {!imageError && (article.urlToImage || article.image) ? (
          <img 
            src={article.urlToImage || article.image} 
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
            <span className="text-sm font-spacegroteskregular">News Article</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h3 className="font-spacegroteskregular font-semibold text-lg line-clamp-2 text-gray-800 dark:text-white">
          {article.title}
        </h3>
        <p className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {article.description || 'No description available'}
        </p>
        <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="font-spacegroteskregular text-sm text-gray-700 dark:text-gray-300">
            {article.source?.name || 'Unknown Source'}
          </div>
          <div className="font-spacegroteskregular text-xs text-gray-500 dark:text-gray-400">
            {publishedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
